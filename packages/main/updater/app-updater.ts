import { RootStore } from '@lindo/shared'
import { app, dialog, shell } from 'electron'
import { logger } from '../logger'
import { I18n } from '../utils'
import { autoUpdater, UpdateInfo } from 'electron-updater'
import { UpdaterWindow } from '../windows/updater-window'
import { GITHUB_LATEST_RELEASE_URL, GITHUB_OWNER, GITHUB_REPO } from '../constants'
import { platform } from 'os'
import { Octokit } from '@octokit/rest'
import compareVersions from 'compare-versions'

export class AppUpdater {
  private readonly _updaterWindow: UpdaterWindow
  private readonly _rootStore: RootStore
  private readonly _octokit: Octokit
  private readonly _i18n: I18n

  private constructor(updaterWindow: UpdaterWindow, rootStore: RootStore, i18n: I18n) {
    this._updaterWindow = updaterWindow
    this._rootStore = rootStore
    this._octokit = new Octokit()
    this._i18n = i18n
  }

  static async init(rootStore: RootStore, i18n: I18n): Promise<AppUpdater> {
    const updaterWindow = await UpdaterWindow.init(rootStore, { show: false })
    return new AppUpdater(updaterWindow, rootStore, i18n)
  }

  async run() {
    // set the current version of the app
    logger.info('appUpdater -> Start app update checking...')
    const currentVersion = app.getVersion()
    this._rootStore.appStore.setLindoVersion(currentVersion)

    autoUpdater.logger = logger
    autoUpdater.autoDownload = false
    autoUpdater.setFeedURL({ provider: 'github', owner: GITHUB_OWNER, repo: GITHUB_REPO })

    return new Promise<void>((resolve, reject) => {
      autoUpdater.on('checking-for-update', () => {
        logger.info('appUpdater -> Checking for updates...')
      })

      autoUpdater.on('update-available', (updateInfo: UpdateInfo) => {
        logger.info('appUpdater -> An Update is available v' + updateInfo.version)
        let required = false
        if (typeof updateInfo.releaseNotes === 'string') {
          required = updateInfo.releaseNotes.includes('__update:required__') ?? false
        }
        this._showUpdateDialog(updateInfo.version, required).then((ignored) => {
          // resolve the promise if the update is ignored
          if (ignored) {
            resolve()
          }
        })
      })

      autoUpdater.on('update-not-available', () => {
        logger.info('appUpdater -> There is no available update')
        resolve()
      })

      autoUpdater.on('update-cancelled', () => {
        logger.info('appUpdater -> Update is cancelled')
        resolve()
      })

      autoUpdater.on('download-progress', ({ percent }) => {
        this._updaterWindow.show()
        this._updaterWindow.sendProgress({ message: 'DOWNLOADING UPDATE', percent })
      })

      autoUpdater.on('update-downloaded', () => {
        logger.info('appUpdater -> Update downloaded, will install now')
        this._updaterWindow.close()
        autoUpdater.quitAndInstall()
      })

      autoUpdater.on('error', (error: Error) => {
        if (error) logger.info('appUpdater -> An error occured: ' + error)
        reject(error)
      })

      autoUpdater.checkForUpdatesAndNotify().then(() => {
        logger.info('appUpdater -> Update check done')
        // if app is not packaged, we skip the update
        if (!app.isPackaged) {
          return resolve()
        }
        // if app is not an appimage under linux then we check for update manually
        if (platform() === 'linux' && !process.env.APPIMAGE) {
          this._manuallyCheckUpdate().then((ignored) => {
            if (ignored) {
              resolve()
            }
          })
        }
      })
    })
  }

  private _isUpdateRequired(releaseNotes?: string): boolean {
    return releaseNotes?.includes('__update:required__') ?? false
  }

  private _manuallyCheckUpdate(): Promise<boolean> {
    return this._octokit.repos
      .getLatestRelease({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO
      })
      .then((res) => {
        const currentVersion = app.getVersion()
        const latestVersion = res.data.tag_name.replaceAll('v', '')
        const required = this._isUpdateRequired(res.data.body ?? '')
        logger.info({ latestVersion, currentVersion })
        if (compareVersions(latestVersion, currentVersion) === 1) {
          return this._showUpdateDialog(latestVersion, required)
        }
        return true
      })
  }

  /**
   *
   * @param newVersion
   * @param required
   * @returns true if the update is ignored, false otherwise
   */
  private _showUpdateDialog(newVersion: string, required: boolean): Promise<boolean> {
    const buttons: Array<string> = [this._i18n.LL.main.updater.download()]
    if (!required) {
      buttons.push(this._i18n.LL.main.updater.ignore())
    }
    return dialog
      .showMessageBox({
        type: 'info',
        title: this._i18n.LL.main.updater.title({ version: newVersion }),
        message: required
          ? this._i18n.LL.main.updater.messageRequired({ version: newVersion })
          : this._i18n.LL.main.updater.message({ version: newVersion }),
        buttons
      })
      .then(async (returnValue) => {
        if (returnValue.response === 0) {
          // automatic update cant work on macos until we sign the app
          if (platform() === 'darwin') {
            logger.warn('appUpdater -> unable to download automatically the release on MacOS')
            await this._downloadFromWeb()
            return false
          }
          return autoUpdater.downloadUpdate().catch(async (err) => {
            logger.error('appUpdater -> unable to download automatically the release', err)
            await this._downloadFromWeb()
            return false
          })
        } else {
          logger.info('appUpdater -> App update ignored.')
          return true
        }
      })
  }

  private async _downloadFromWeb() {
    logger.info('appUpdater -> Redirected to app download page.')
    await shell.openExternal(GITHUB_LATEST_RELEASE_URL)
    app.exit()
  }
}
