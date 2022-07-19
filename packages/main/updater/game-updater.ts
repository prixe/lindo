import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'
import fs from 'fs-extra'
import path from 'path'
import * as beautify from 'js-beautify'
import { UpdaterWindow } from '../windows/updater-window'
import { Files, ItunesLookup, Manifest, RegexPatches } from './models'
import { DiffManifest, retrieveManifests } from './updater-utils'
import {
  DOFUS_ITUNES_ORIGIN,
  DOFUS_ORIGIN,
  GAME_PATH,
  LOCAL_ASSET_MAP_PATH,
  LOCAL_DOFUS_MANIFEST_PATH,
  LOCAL_LINDO_MANIFEST_PATH,
  REMOTE_LINDO_MANIFEST_URL,
  LOCAL_REGEX_PATH,
  LOCAL_VERSIONS_PATH,
  REMOTE_ASSET_MAP_URL,
  REMOTE_DOFUS_MANIFEST_URL,
  DOFUS_EARLY_ORIGIN
} from '../constants'
import { RootStore } from '@lindo/shared'
import { app } from 'electron'

interface GameVersion {
  buildVersion: string
  appVersion: string
}

export class GameUpdater {
  private readonly _updaterWindow: UpdaterWindow
  private readonly _rootStore: RootStore
  private readonly _httpClient: AxiosInstance
  private readonly _dofusOrigin: string

  private constructor(updaterWindow: UpdaterWindow, rootStore: RootStore) {
    this._updaterWindow = updaterWindow
    this._rootStore = rootStore
    this._httpClient = axios.create()
    this._dofusOrigin = rootStore.appStore.dofusTouchEarly ? DOFUS_EARLY_ORIGIN : DOFUS_ORIGIN
    console.log(this._dofusOrigin)
    axiosRetry(this._httpClient, { retries: 5, retryDelay: () => 1000 })
  }

  static async init(rootStore: RootStore): Promise<GameUpdater> {
    const updaterWindow = await UpdaterWindow.init(rootStore)
    return new GameUpdater(updaterWindow, rootStore)
  }

  async run() {
    // create folder if missing
    // fs.rmSync(GAME_PATH, { recursive: true, force: true })
    fs.mkdirSync(GAME_PATH, { recursive: true })
    fs.mkdirSync(GAME_PATH + 'build', { recursive: true })

    this._updaterWindow.sendProgress({ message: 'DOWNLOADING ALL MANIFESTS', percent: 0 })

    const [, remoteAssetManifest, assetDiffManifest] = await retrieveManifests({
      localManifestPath: LOCAL_ASSET_MAP_PATH,
      remoteManifestUrl: REMOTE_ASSET_MAP_URL,
      httpClient: this._httpClient
    })
    const [, remoteLindoManifest, lindoDiffManifest] = await retrieveManifests({
      localManifestPath: LOCAL_LINDO_MANIFEST_PATH,
      remoteManifestUrl: REMOTE_LINDO_MANIFEST_URL,
      httpClient: this._httpClient
    })
    const [, remoteDofusManifest, dofusDiffManifest] = await retrieveManifests({
      localManifestPath: LOCAL_DOFUS_MANIFEST_PATH,
      remoteManifestUrl: REMOTE_DOFUS_MANIFEST_URL,
      httpClient: this._httpClient
    })

    this._updaterWindow.sendProgress({ message: 'DOWNLOAD MISSING ASSETS FILES ON DISK..', percent: 10 })
    return this._downloadAssetsFiles(assetDiffManifest, remoteAssetManifest)
      .catch((error) => {
        console.log('Error while downloading assets files:', error)
        console.log('Will restart in non async mod')
        return this._downloadAssetsFiles(assetDiffManifest, remoteAssetManifest, false)
      })
      .then(async () => {
        this._updaterWindow.sendProgress({ message: 'DOWNLOAD MISSING LINDO AND DOFUS FILES IN MEMORY..', percent: 40 })
        const [missingLindoFiles, missingDofusFiles] = await this._retrieveMissingLindoAndDofusFiles(
          lindoDiffManifest,
          remoteLindoManifest,
          dofusDiffManifest,
          remoteDofusManifest
        )

        this._updaterWindow.sendProgress({ message: 'FINDING VERSIONS..', percent: 60 })
        const localVersions = await this._findingVersions(missingDofusFiles)

        this._updaterWindow.sendProgress({
          message: 'APPLYING REGEX (LINDO OVERRIDE) ON DOFUS MISSING FILES',
          percent: 70
        })
        this._applyRegex(lindoDiffManifest, missingLindoFiles, missingDofusFiles)

        this._updaterWindow.sendProgress({ message: 'WRITING LINDO AND DOFUS MISSING FILES TO DISK', percent: 80 })
        this._writeMissingFiles(missingLindoFiles)
        this._writeMissingFiles(missingDofusFiles)

        this._updaterWindow.sendProgress({ message: 'REMOVING OLD ASSETS AND DOFUS FILES..', percent: 90 })
        this._removeOldAssets(dofusDiffManifest, remoteDofusManifest)
        this._removeOldAssets(lindoDiffManifest, remoteLindoManifest)

        this._updaterWindow.sendProgress({ message: 'SAVING ALL JSON FILES TO DISK', percent: 100 })
        await Promise.all([
          fs.promises.writeFile(LOCAL_ASSET_MAP_PATH, JSON.stringify(remoteAssetManifest)),
          fs.promises.writeFile(LOCAL_LINDO_MANIFEST_PATH, JSON.stringify(remoteLindoManifest)),
          fs.promises.writeFile(LOCAL_DOFUS_MANIFEST_PATH, JSON.stringify(remoteDofusManifest)),
          fs.promises.writeFile(LOCAL_VERSIONS_PATH, JSON.stringify(localVersions))
        ])

        // save to store
        this._rootStore.appStore.setAppVersion(localVersions.appVersion)
        this._rootStore.appStore.setBuildVersion(localVersions.buildVersion)
        this._rootStore.appStore.setLindoVersion(app.getVersion())
      })
      .finally(() => {
        console.log('UPDATE FINISH')
        this._updaterWindow.close()
      })
  }

  private _writeMissingFiles(files: Files) {
    for (const filename in files) {
      let fileContent: string
      if (typeof files[filename] === 'object') {
        fileContent = JSON.stringify(files[filename])
      } else {
        fileContent = files[filename] as string
      }

      fs.writeFileSync(GAME_PATH + filename, fileContent)
    }
  }

  private _removeOldAssets(differences: DiffManifest, manifest: Manifest) {
    for (const key in differences) {
      if (differences[key] === -1) {
        const filePath = GAME_PATH + manifest.files[key].filename
        const directoryPath = path.dirname(filePath)

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)

          const directory = fs.readdirSync(directoryPath)
          if (directory.length === 0) fs.rmdirSync(directoryPath)
        }
      }
    }
  }

  private _applyRegex(lindoDiffManifest: DiffManifest, missingLindoFiles: Files, missingDofusFiles: Files) {
    let regex: RegexPatches

    if (lindoDiffManifest['regex.json'] === 1) {
      regex = missingLindoFiles['regex.json'] as RegexPatches
    } else {
      regex = fs.existsSync(LOCAL_REGEX_PATH) ? JSON.parse(fs.readFileSync(LOCAL_REGEX_PATH, 'utf-8')) : {}
    }

    for (const filename in regex) {
      if (missingDofusFiles[filename]) {
        if (/.js$/.test(filename)) {
          missingDofusFiles[filename] = beautify.js(missingDofusFiles[filename] as string, {
            break_chained_methods: true
          })
        } else if (/.css$/.test(filename)) {
          missingDofusFiles[filename] = beautify.css(missingDofusFiles[filename] as string)
        }

        for (const i in regex[filename]) {
          missingDofusFiles[filename] = (missingDofusFiles[filename] as string).replace(
            new RegExp(regex[filename][i][0], 'g'),
            regex[filename][i][1]
          )
        }
      }
    }
  }

  private async _findingVersions(missingDofusFiles: Files): Promise<GameVersion> {
    const localVersions: GameVersion = fs.existsSync(LOCAL_VERSIONS_PATH)
      ? JSON.parse(fs.readFileSync(LOCAL_VERSIONS_PATH, 'utf-8'))
      : {}

    const buildScriptFile = missingDofusFiles['build/script.js']
    if (buildScriptFile && typeof buildScriptFile === 'string') {
      console.log('FETCH BUILD VERSION FROM script.js')
      localVersions.buildVersion = buildScriptFile.match(/window\.buildVersion\s?=\s?"(\d+\.\d+\.\d+(?:-\d+)?)"/)![1]
      localVersions.appVersion = await this._httpClient
        .get<ItunesLookup>(DOFUS_ITUNES_ORIGIN)
        .then((response) => response.data.results[0].version)
    }

    console.log(
      'VERSIONS : buildVersion = ' + localVersions.buildVersion + ' - appVersion = ' + localVersions.appVersion
    )

    return localVersions
  }

  private async _retrieveMissingLindoAndDofusFiles(
    lindoDiff: DiffManifest,
    remoteLindo: Manifest,
    dofusDiff: DiffManifest,
    remoteDofus: Manifest
  ) {
    const lindoFiles: Files = {}
    for (const i in lindoDiff) {
      if (lindoDiff[i] === 1) {
        lindoFiles[i] = await this._downloadFile(remoteLindo.files[i].filename)
      }
    }

    /** Re-download forced dofus if regex has changed */
    if (lindoDiff['regex.json'] === 1) {
      for (const i in dofusDiff) dofusDiff[i] = 1
    }

    const dofusFiles: Files = {}
    for (const i in dofusDiff) {
      if (dofusDiff[i] === 1) {
        dofusFiles[i] = await this._downloadFile(this._dofusOrigin + remoteDofus.files[i].filename).catch((err) => {
          // switch on the normal version if it failed on the early version
          if (this._dofusOrigin === DOFUS_EARLY_ORIGIN) {
            return this._downloadFile(DOFUS_ORIGIN + remoteDofus.files[i].filename)
          }
          throw err
        })
      }
    }
    return [lindoFiles, dofusFiles]
  }

  private async _downloadAssetsFiles(diffManifest: DiffManifest, remoteAsset: Manifest, parallel: boolean = true) {
    const initialStatus = 'Downloading Dofus files'

    const totalDownload = Object.keys(diffManifest).reduce((acc, key) => acc + (diffManifest[key] === 1 ? 1 : 0), 0)
    let currentDownload = 0

    const promises = Object.keys(diffManifest)
      .filter((key) => diffManifest[key] === 1)
      .map(async (key) => {
        const url = this._dofusOrigin + remoteAsset.files[key].filename
        const filePath = GAME_PATH + remoteAsset.files[key].filename

        const directoryPath = path.dirname(filePath)
        const fileExists = await fs.promises
          .access(directoryPath, fs.constants.F_OK)
          .then(() => true)
          .catch(() => false)
        if (!fileExists) {
          await fs.promises.mkdir(directoryPath, { recursive: true })
        }

        const fileWriteStream = fs.createWriteStream(filePath)

        return this._httpClient
          .get(url, { responseType: 'stream' })
          .catch((err) => {
            // switch on the normal version if it failed on the early version
            if (this._dofusOrigin === DOFUS_EARLY_ORIGIN) {
              return this._httpClient.get(DOFUS_ORIGIN + remoteAsset.files[key].filename, {
                responseType: 'stream'
              })
            }
            throw err
          })
          .then((response) => {
            // response.data.pipe(fileWriteStream)
            return new Promise<void>((resolve, reject) => {
              const timeoutInt = setTimeout(() => {
                reject(new Error('Timeout'))
              }, 40000)

              fileWriteStream.on('finish', function () {
                resolve()
                clearTimeout(timeoutInt)
              })
              fileWriteStream.on('error', (err) => {
                clearTimeout(timeoutInt)
                reject(err)
              })
              response.data.pipe(fileWriteStream)
            }).catch(() => {
              console.log('Error while downloading ' + url)
              console.log('This will ignore')
            })
          })
          .then(() => {
            currentDownload++
            this._updaterWindow.sendProgress({
              message: initialStatus + ' (' + currentDownload + '/' + totalDownload + ')',
              percent: 10 + (currentDownload / totalDownload) * 30
            })
          })
      })

    if (parallel) {
      await Promise.allSettled(promises).then((results) => {
        if (results.some((result) => result.status === 'rejected')) {
          throw new Error('Error while downloading files')
        }
      })
    } else {
      for (const promise of promises) {
        await promise
      }
    }
  }

  private _downloadFile(url: string) {
    return this._httpClient.get(url).then((response) => response.data)
  }
}
