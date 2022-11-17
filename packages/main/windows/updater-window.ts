import { IPCEvents, RootStore, UpdateProgress } from '@lindo/shared'
import { app, BeforeSendResponse, BrowserWindow } from 'electron'
import { join } from 'path'
import { EventEmitter } from 'stream'
import TypedEmitter from 'typed-emitter'
import { logger } from '../logger'
import { generateUserArgent } from '../utils'

type UpdaterWindowEvents = {
  close: (event: Event) => void
}

export interface UpdaterWindowOptions {
  show?: boolean // will automatically show the window when dom is ready
}

export class UpdaterWindow extends (EventEmitter as new () => TypedEmitter<UpdaterWindowEvents>) {
  private readonly _win: BrowserWindow

  private constructor(userAgent: string, options?: UpdaterWindowOptions) {
    super()
    this._win = new BrowserWindow({
      show: false,
      width: 700,
      height: 190,
      title: 'Updater',
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.cjs'),
        sandbox: false,
        defaultEncoding: 'UTF-8'
      }
    })
    this._win.webContents.setUserAgent(userAgent)

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
        if (options?.show ?? true) {
          setTimeout(() => {
            this._win.show()
          }, 100)
        }
      }
    })

    this._win.on('close', (event) => {
      logger.debug('UpdaterWindow -> close')
      this._handleClose(event)
    })

    if (app.isPackaged) {
      this._win.loadURL(`file://${join(__dirname, '../renderer/index.html')}#/updater`)
    } else {
      // 🚧 Use ['ENV_NAME'] avoid vite:define plugin

      // eslint-disable-next-line dot-notation
      const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}#/updater`

      this._win.loadURL(url)
      if (process.env.NODE_ENV === 'development') {
        this._win.webContents.openDevTools({ mode: 'detach' })
      }
    }
  }

  static async init(store: RootStore, options?: UpdaterWindowOptions): Promise<UpdaterWindow> {
    const userAgent = await generateUserArgent(store.appStore.appVersion)
    return new UpdaterWindow(userAgent, options)
  }

  sendProgress(progress: UpdateProgress) {
    logger.debug(progress.message)
    this._win.webContents.send(IPCEvents.UPDATE_PROGRESS, progress)
  }

  private _handleClose(event: Event) {
    this._win.removeAllListeners()
    this.emit('close', event)
  }

  close() {
    this._win.close()
  }

  show() {
    this._win.show()
  }

  focus = () => this._win.focus()
  isMinimized = () => this._win.isMinimized()
  restore = () => this._win.restore()
}
