import {
  GameContext,
  IPCEvents,
  RootStore,
  SaveCharacterImageArgs,
  GameTeamWindow,
  GameTeam,
  LANGUAGE_KEYS
} from '@lindo/shared'
import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron'
import crypto from 'crypto'
import express from 'express'
import getPort from 'get-port'
import { Server } from 'http'
import { observe } from 'mobx'
import { AddressInfo } from 'net'
import { APP_PATH, CHARACTER_IMAGES_PATH, GAME_PATH, LINDO_API } from './constants'
import fs from 'fs-extra'
// @vite-ignore
import originalFs from 'original-fs'
import { getAppMenu } from './menu'
import { MultiAccount } from './multi-account'
import { runUpdater } from './updater'
import { GameWindow, OptionWindow } from './windows'
import path from 'path'
import cors from 'cors'
import { I18n } from './utils'
import { logger, setupRendererLogger } from './logger'
import axios from 'axios'
import { Locales } from '@lindo/i18n'

export class Application {
  private static _instance: Application
  private readonly _multiAccount: MultiAccount
  private readonly _i18n: I18n
  private readonly _hash: string

  static async init(rootStore: RootStore) {
    if (Application._instance) {
      throw new Error('Application already initialized')
    }

    // generate a hash for the app for randomization
    let hash: string
    if (app.isPackaged) {
      const path = app.getAppPath()
      const fileBuffer = originalFs.readFileSync(path)
      const hashSum = crypto.createHash('sha256')
      hashSum.update(fileBuffer)
      hash = hashSum.digest('hex')
    } else {
      const hashSum = crypto.createHash('sha256')
      hashSum.update(app.name)
      hash = hashSum.digest('hex')
    }

    // create express server to serve game file
    const serveGameServer = express()
    serveGameServer.use(
      cors({
        origin: '*'
      })
    )
    serveGameServer.use('/', express.static(GAME_PATH))
    serveGameServer.use('/character-images', express.static(CHARACTER_IMAGES_PATH))
    serveGameServer.use('/changelog', express.static(APP_PATH + '/CHANGELOG.md'))
    const port = await getPort({ port: 3000 })
    const server: Server = serveGameServer.listen(port)

    // set default language
    if (!rootStore.appStore._language) {
      const userLocal = app.getLocale()
      const userLang = userLocal.split('-')[0] as Locales
      console.log(userLang)
      if (LANGUAGE_KEYS.includes(userLang)) {
        rootStore.appStore.setLanguageKey(userLang)
      }
    }

    Application._instance = new Application(rootStore, server, hash)
  }

  static get instance(): Application {
    if (!Application._instance) {
      throw new Error('Application not initialized')
    }
    return Application._instance
  }

  private _gWindows: Array<GameWindow> = []
  private _optionWindow?: OptionWindow

  private constructor(private _rootStore: RootStore, private _serveGameServer: Server, hash: string) {
    this._multiAccount = new MultiAccount(this._rootStore)
    this._i18n = new I18n(this._rootStore)
    this._hash = hash
  }

  async run() {
    // setup global IPC handlers
    this._setupIPCHandlers()

    // run updater
    await runUpdater(this._rootStore, this._i18n)

    // set the app menu
    this._setAppMenu()

    await this._initGameWindows()

    app.on('second-instance', () => {
      logger.debug('Application -> second-instance')
      if (this._gWindows.length) {
        // Focus on the main window if the user tried to open another
        if (this._gWindows[0].isMinimized()) this._gWindows[0].restore()
        this._gWindows[0].focus()
      }
    })

    app.on('activate', () => {
      logger.debug('Application -> activate')
      if (this._gWindows.length) {
        this._gWindows[0].focus()
      } else {
        this.createGameWindow()
      }
    })
  }

  private async _initGameWindows() {
    const multiAccountEnabled = await this._multiAccount.isEnabled()
    if (multiAccountEnabled) {
      try {
        const selectedTeamId = await this._multiAccount.unlockWithTeam()
        const team = this._rootStore.optionStore.gameMultiAccount.selectTeamById(selectedTeamId)
        if (!team) {
          throw new Error('Team not found')
        }
        for (const window of team.windows) {
          this.createGameWindow(team, window)
        }
      } catch (e) {
        console.log(e)
        logger.warn('MultiAccount canceled')

        this.createGameWindow()
      }
    } else {
      this.createGameWindow()
    }
    observe(
      this._rootStore.optionStore.window,
      'audioMuted',
      () => {
        for (const gWindow of this._gWindows) {
          gWindow.setAudioMute(this._rootStore.optionStore.window.audioMuted)
        }
      },
      true
    )
  }

  private _setAppMenu() {
    Menu.setApplicationMenu(getAppMenu(this._rootStore, this._i18n))
    logger.debug('Application -> _setAppMenu')
    observe(this._rootStore.hotkeyStore.window, (change) => {
      logger.debug('Application -> _setAppMenu')
      if (change.type === 'update') {
        Menu.setApplicationMenu(getAppMenu(this._rootStore, this._i18n))
      }
    })
    this._i18n.on('localeChanged', () => {
      Menu.setApplicationMenu(getAppMenu(this._rootStore, this._i18n))
    })
  }

  async createGameWindow(team?: GameTeam, teamWindow?: GameTeamWindow) {
    logger.debug('Application -> _createGameWindow')
    const gWindow = await GameWindow.init(this._rootStore, team, teamWindow)
    gWindow.on('close', () => {
      this._gWindows.splice(this._gWindows.indexOf(gWindow), 1)
    })
    this._gWindows.push(gWindow)
  }

  openOptionWindow() {
    logger.debug('Application -> openOptionWindow')
    if (this._optionWindow) {
      this._optionWindow.focus()
      return
    }
    this._optionWindow = new OptionWindow()
    this._optionWindow.on('close', () => {
      this._optionWindow = undefined
    })
  }

  private _setupIPCHandlers() {
    // logger handler
    setupRendererLogger()

    // handlers
    ipcMain.handle(IPCEvents.GET_GAME_CONTEXT, (event) => {
      const serverAddress: AddressInfo = this._serveGameServer.address() as AddressInfo
      const gWindow = this._gWindows.find((gWindow) => gWindow.id === event.sender.id)
      const context: GameContext = {
        gameSrc: 'http://localhost:' + serverAddress.port + '/index.html?delayed=true',
        characterImagesSrc: 'http://localhost:' + serverAddress.port + '/character-images/',
        changeLogSrc: 'http://localhost:' + serverAddress.port + '/changelog',
        windowId: event.sender.id,
        multiAccount: gWindow?.multiAccount,
        hash: this._hash
      }
      return JSON.stringify(context)
    })

    ipcMain.on(IPCEvents.OPEN_OPTION, () => {
      this.openOptionWindow()
    })

    ipcMain.on(IPCEvents.CLOSE_OPTION, () => {
      if (this._optionWindow) {
        this._optionWindow.close()
      }
    })

    ipcMain.on(IPCEvents.RESET_STORE, () => {
      this._rootStore.reset()
    })

    ipcMain.on(IPCEvents.SAVE_CHARACTER_IMAGE, (event, { image, name }: SaveCharacterImageArgs) => {
      const base64Data = image.replace(/^data:image\/png;base64,/, '')
      fs.mkdirSync(CHARACTER_IMAGES_PATH, { recursive: true })
      fs.writeFile(path.join(CHARACTER_IMAGES_PATH, `${name}.png`), base64Data, 'base64', (err) => {
        logger.error(err)
      })
    })

    ipcMain.on(IPCEvents.TOGGLE_MAXIMIZE_WINDOW, (event) => {
      logger.debug('Application -> TOGGLE_MAXIMIZE_WINDOW')
      const gWindow = this._gWindows.find((gWindow) => gWindow.id === event.sender.id)
      if (gWindow) {
        gWindow.toggleMaximize()
      }
    })

    ipcMain.on(IPCEvents.AUTO_GROUP_PUSH_PATH, (event, instruction) => {
      logger.debug('Application -> AUTO_GROUP_PUSH_PATH')
      for (const gWindow of this._gWindows) {
        gWindow.sendAutoGroupInstruction(instruction)
      }
    })

    ipcMain.on(IPCEvents.FOCUS_WINDOW, (event) => {
      logger.debug('Application -> FOCUS_WINDOW')
      const gWindow = this._gWindows.find((gWindow) => gWindow.id === event.sender.id)
      if (gWindow) {
        gWindow.focus()
      }
    })

    ipcMain.handle(IPCEvents.FETCH_GAME_CONTEXT, (event, context: string) => {
      logger.debug('Application -> FETCH_GAME_CONTEXT')
      return axios
        .post(LINDO_API, {
          context
        })
        .then((res) => res.data)
    })

    ipcMain.on(IPCEvents.AUDIO_MUTE_WINDOW, (event, value) => {
      logger.debug('Application -> AUDIO_MUTE_WINDOW')
      const gWindow = this._gWindows.find((gWindow) => gWindow.id === event.sender.id)
      if (gWindow) {
        gWindow.setAudioMute(value)
      }
    })

    ipcMain.on(IPCEvents.RESET_GAME_DATA, () => {
      logger.debug('Application -> RESET_GAME_DATA')
      fs.rmSync(GAME_PATH, { recursive: true, force: true })
      app.relaunch()
      app.quit()
    })

    ipcMain.on(IPCEvents.CLEAR_CACHE, async () => {
      logger.debug('Application -> CLEAR_CACHE')
      Promise.all(this._gWindows.map((gWindow) => gWindow.clearCache())).finally(() => {
        dialog
          .showMessageBox(BrowserWindow.getFocusedWindow()!, {
            type: 'info',
            title: this._i18n.LL.main.dialogs.cacheCleared.title(),
            message: this._i18n.LL.main.dialogs.cacheCleared.message(),
            buttons: ['OK']
          })
          .then(() => {
            app.exit()
          })
      })
    })
  }
}
