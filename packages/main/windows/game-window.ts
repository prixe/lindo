import { FollowInstruction, GameTeam, GameTeamWindow, IPCEvents, MultiAccountContext, RootStore } from '@lindo/shared'
import { app, BeforeSendResponse, BrowserWindow, shell } from 'electron'
import { attachTitlebarToWindow } from 'custom-electron-titlebar/main'
import { join } from 'path'
import { EventEmitter } from 'stream'
import TypedEmitter from 'typed-emitter'
import { generateUserArgent } from '../utils'
import { logger } from '../logger'
import { observe } from 'mobx'
import { electronLocalshortcut } from '@hfelix/electron-localshortcut'
import { platform } from 'os'

type GameWindowEvents = {
  close: (event: Event) => void
}
export class GameWindow extends (EventEmitter as new () => TypedEmitter<GameWindowEvents>) {
  private readonly _win: BrowserWindow
  private readonly _store: RootStore
  private readonly _teamWindow?: GameTeamWindow
  private readonly _team?: GameTeam
  private _isMuted = false
  private readonly _index: number
  private readonly _shortcutStoreDisposer: () => void

  get id() {
    return this._win.webContents.id!
  }

  get multiAccount(): MultiAccountContext | undefined {
    if (this._teamWindow && this._team) {
      return {
        teamWindowId: this._teamWindow.id,
        teamId: this._team.id
      }
    }
  }

  private constructor({
    index,
    userAgent,
    store,
    team,
    url,
    teamWindow
  }: {
    index: number
    userAgent: string
    store: RootStore
    url: string
    team?: GameTeam
    teamWindow?: GameTeamWindow
  }) {
    super()
    this._index = index
    this._store = store
    this._teamWindow = teamWindow
    this._team = team
    this._win = new BrowserWindow({
      show: false,
      resizable: true,
      frame: platform() !== 'linux',
      title: 'Lindo',
      fullscreenable: true,
      fullscreen: this._store.optionStore.window.fullScreen,
      width: this._store.optionStore.window.resolution.width,
      height: this._store.optionStore.window.resolution.height,
      titleBarStyle: 'hidden',
      webPreferences: {
        preload: join(__dirname, '../preload/index.cjs'),
        backgroundThrottling: false,
        partition: 'persist:' + this._index,
        sandbox: false,
        allowRunningInsecureContent: true,
        webviewTag: true,
        webSecurity: false // require to load dofus files
      }
    })

    // when Referer is send to the ankama server, the request can be blocked
    this._win.webContents.session.webRequest.onBeforeSendHeaders(
      {
        urls: ['https://static.ankama.com/*']
      },
      (details, callback) => {
        const requestHeaders = { ...(details.requestHeaders ?? {}) }
        delete requestHeaders.Referer
        const beforeSendResponse: BeforeSendResponse = { requestHeaders }
        callback(beforeSendResponse)
      }
    )

    // remove sec headers on requests
    this._win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
      const requestHeaders = { ...(details.requestHeaders ?? {}) }
      delete requestHeaders['sec-ch-ua']
      delete requestHeaders['sec-ch-ua-mobile']
      delete requestHeaders['sec-ch-ua-platform']
      delete requestHeaders['Sec-Fetch-Site']
      delete requestHeaders['Sec-Fetch-Mode']
      delete requestHeaders['Sec-Fetch-Dest']
      const beforeSendResponse: BeforeSendResponse = { requestHeaders }
      callback(beforeSendResponse)
    })

    // Show window when page is ready
    this._win.webContents.on('ipc-message', (event, channel) => {
      if (channel === IPCEvents.APP_READY_TO_SHOW) {
        setTimeout(() => {
          this._win.show()
        }, 100)
      }
    })

    this._win.webContents.setUserAgent(userAgent)

    this._win.webContents.setAudioMuted(this._store.optionStore.window.audioMuted)

    this._win.on('close', (event) => {
      logger.debug('GameWindow -> close')
      this._close(event)
    })

    this._win.on('focus', () => {
      if (this._store.optionStore.window.audioMuted || this._isMuted) {
        this._win.webContents.setAudioMuted(true)
        return
      }
      this._win.webContents.setAudioMuted(false)
    })

    this._win.on('blur', () => {
      if (this._store.optionStore.window.audioMuted || this._isMuted) {
        this._win.webContents.setAudioMuted(true)
        return
      }
      if (this._store.optionStore.window.soundOnFocus) {
        this._win.webContents.setAudioMuted(true)
      }
    })

    this._shortcutStoreDisposer = observe(
      this._store.hotkeyStore.window.tabs,
      () => {
        electronLocalshortcut.unregisterAll(this._win)
        this._store.hotkeyStore.window.tabs.forEach((tab, index) => {
          if (tab) {
            electronLocalshortcut.register(this._win, tab, () => {
              this._win.webContents.send(IPCEvents.SELECT_TAB, index)
            })
          }
        })
      },
      true
    )

    if (app.isPackaged) {
      this._win.loadURL(url)
    } else {
      // 🚧 Use ['ENV_NAME'] avoid vite:define plugin

      // eslint-disable-next-line dot-notation
      const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

      this._win.loadURL(url)
      if (process.env.NODE_ENV === 'development') {
        this._win.webContents.openDevTools({ mode: 'detach' })
      }
    }
    // Make all links open with the browser, not with the application
    this._win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url)
      return { action: 'deny' }
    })

    attachTitlebarToWindow(this._win)
  }

  static async init({
    index,
    store,
    team,
    url,
    teamWindow
  }: {
    index: number
    store: RootStore
    url: string
    team?: GameTeam
    teamWindow?: GameTeamWindow
  }): Promise<GameWindow> {
    const userAgent = await generateUserArgent(store.appStore.appVersion)
    return new GameWindow({ index, url, userAgent, store, team, teamWindow })
  }

  private _close(event: Event) {
    this._win.removeAllListeners()
    electronLocalshortcut.unregisterAll(this._win)
    this._shortcutStoreDisposer()
    this.emit('close', event)
  }

  focus = () => this._win.focus()
  isMinimized = () => this._win.isMinimized()
  restore = () => this._win.restore()

  toggleMaximize() {
    return this._win.isMaximized() ? this._win.unmaximize() : this._win.maximize()
  }

  setAudioMute(value: boolean) {
    this._isMuted = value
    this._win.webContents.setAudioMuted(value)
  }

  sendAutoGroupInstruction(instruction: FollowInstruction) {
    this._win.webContents.send(IPCEvents.AUTO_GROUP_PUSH_PATH, instruction)
  }

  clearCache() {
    return this._win.webContents.session.clearCache()
  }
}
