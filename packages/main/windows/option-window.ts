import { IPCEvents } from '@lindo/shared'
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { EventEmitter } from 'stream'
import TypedEmitter from 'typed-emitter'
import { logger } from '../logger'

type OptionWindowEvents = {
  close: (event: Event) => void
}

export class OptionWindow extends (EventEmitter as new () => TypedEmitter<OptionWindowEvents>) {
  private readonly _win: BrowserWindow

  constructor() {
    super()
    this._win = new BrowserWindow({
      show: false,
      width: 860,
      height: 600,
      title: 'Options',
      fullscreenable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.cjs'),
        sandbox: false,
        defaultEncoding: 'UTF-8'
      }
    })

    // Show window when page is ready
    this._win.webContents.on('ipc-message', (event, channel) => {
      if (channel === IPCEvents.APP_READY_TO_SHOW) {
        setTimeout(() => {
          this._win.show()
        }, 100)
      }
    })

    this._win.on('close', (event) => {
      logger.debug('OptionWindow -> close')
      this._handleClose(event)
    })

    if (app.isPackaged) {
      this._win.loadURL(`file://${join(__dirname, '../renderer/index.html')}#/option`)
    } else {
      // 🚧 Use ['ENV_NAME'] avoid vite:define plugin

      // eslint-disable-next-line dot-notation
      const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}#/option`

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
  }

  private _handleClose(event: Event) {
    this._win.removeAllListeners()
    this.emit('close', event)
  }

  close() {
    this._win.close()
  }

  focus = () => this._win.focus()
  isMinimized = () => this._win.isMinimized()
  restore = () => this._win.restore()
}
