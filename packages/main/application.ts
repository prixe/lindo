import { GameContext, IPCEvents, RootStore, SaveCharacterImageArgs, GameTeamWindow, GameTeam } from '@lindo/shared'
import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron'
import express from 'express'
import getPort from 'get-port'
import { Server } from 'http'
import { observe } from 'mobx'
import { AddressInfo } from 'net'
import { APP_PATH, CHARACTER_IMAGES_PATH, GAME_PATH } from './constants'
import fs from 'fs-extra'
import { getAppMenu } from './menu'
import { MultiAccount } from './multi-account'
import { runUpdater } from './updater'
import { GameWindow, OptionWindow } from './windows'
import path from 'path'
import cors from 'cors'
import { I18n } from './utils'

export class Application {
  private static _instance: Application
  private readonly _multiAccount: MultiAccount
  private readonly _i18n: I18n

  static async init(rootStore: RootStore) {
    if (Application._instance) {
      throw new Error('Application already initialized')
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

    Application._instance = new Application(rootStore, server)
  }

  static get instance(): Application {
    if (!Application._instance) {
      throw new Error('Application not initialized')
    }
    return Application._instance
  }

  private _gWindows: Array<GameWindow> = []
  private _optionWindow?: OptionWindow

  private constructor(private _rootStore: RootStore, private _serveGameServer: Server) {
    this._multiAccount = new MultiAccount(this._rootStore)
    this._i18n = new I18n(this._rootStore)
  }

  async run() {
    // setup global IPC handlers
    this._setupIPCHandlers()

    // run updater
    await runUpdater(this._rootStore)

    // set the app menu
    this._setAppMenu()

    // TODO: unlock the master password
    await this._initGameWindows()

    app.on('second-instance', () => {
      console.log('Application ->', 'second-instance')
      if (this._gWindows.length) {
        // Focus on the main window if the user tried to open another
        if (this._gWindows[0].isMinimized()) this._gWindows[0].restore()
        this._gWindows[0].focus()
      }
    })

    app.on('activate', () => {
      console.log('Application ->', 'activate')
      if (this._gWindows.length) {
        this._gWindows[0].focus()
      } else {
        this.createGameWindow()
      }
    })
  }

  private async _initGameWindows() {
    const multiAccountEnabled = await this._multiAccount.isEnabled()
    console.log({ multiAccountEnabled })
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
        this.createGameWindow()
      }
    } else {
      this.createGameWindow()
    }
  }

  private _setAppMenu() {
    Menu.setApplicationMenu(getAppMenu(this._rootStore.hotkeyStore.window, this._i18n))
    console.log('Application ->', '_setAppMenu')
    observe(this._rootStore.hotkeyStore.window, (change) => {
      console.log('Application ->', '_setAppMenu')
      if (change.type === 'update') {
        Menu.setApplicationMenu(getAppMenu(this._rootStore.hotkeyStore.window, this._i18n))
      }
    })
    this._i18n.on('localeChanged', () => {
      Menu.setApplicationMenu(getAppMenu(this._rootStore.hotkeyStore.window, this._i18n))
    })
  }

  async createGameWindow(team?: GameTeam, teamWindow?: GameTeamWindow) {
    console.log('Application ->', '_createGameWindow')
    const gWindow = await GameWindow.init(this._rootStore, team, teamWindow)
    gWindow.on('close', () => {
      this._gWindows.splice(this._gWindows.indexOf(gWindow), 1)
    })
    this._gWindows.push(gWindow)
  }

  openOptionWindow() {
    console.log('Application ->', 'openOptionWindow')
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
    // handlers
    ipcMain.handle(IPCEvents.GET_GAME_CONTEXT, (event) => {
      const serverAddress: AddressInfo = this._serveGameServer.address() as AddressInfo
      const gWindow = this._gWindows.find((gWindow) => gWindow.id === event.sender.id)
      const context: GameContext = {
        gameSrc: 'http://localhost:' + serverAddress.port + '/index.html?delayed=true',
        characterImagesSrc: 'http://localhost:' + serverAddress.port + '/character-images/',
        changeLogSrc: 'http://localhost:' + serverAddress.port + '/changelog',
        windowId: event.sender.id,
        multiAccount: gWindow?.multiAccount
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
        console.log(err)
      })
    })

    ipcMain.on(IPCEvents.TOGGLE_MAXIMIZE_WINDOW, (event) => {
      console.log('Application ->', 'TOGGLE_MAXIMIZE_WINDOW')
      const gWindow = this._gWindows.find((gWindow) => gWindow.id === event.sender.id)
      if (gWindow) {
        gWindow.toggleMaximize()
      }
    })

    ipcMain.on(IPCEvents.AUTO_GROUP_PUSH_PATH, (event, instruction) => {
      console.log('Application ->', 'AUTO_GROUP_PUSH_PATH')
      for (const gWindow of this._gWindows) {
        gWindow.sendAutoGroupInstruction(instruction)
      }
    })

    ipcMain.on(IPCEvents.FOCUS_WINDOW, (event) => {
      console.log('Application ->', 'FOCUS_WINDOW')
      const gWindow = this._gWindows.find((gWindow) => gWindow.id === event.sender.id)
      if (gWindow) {
        gWindow.focus()
      }
    })

    ipcMain.on(IPCEvents.AUDIO_MUTE_WINDOW, (event, value) => {
      console.log('Application ->', 'AUDIO_MUTE_WINDOW')
      const gWindow = this._gWindows.find((gWindow) => gWindow.id === event.sender.id)
      if (gWindow) {
        gWindow.setAudioMute(value)
      }
    })

    ipcMain.on(IPCEvents.RESET_GAME_DATA, () => {
      console.log('Application ->', 'RESET_GAME_DATA')
      fs.rmSync(GAME_PATH, { recursive: true, force: true })
      app.relaunch()
      app.quit()
    })

    ipcMain.on(IPCEvents.CLEAR_CACHE, async () => {
      console.log('Application ->', 'CLEAR_CACHE')
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
