import { IPCEvents, UpdateProgress } from '@lindo/shared'
import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { EventEmitter } from 'stream'
import TypedEmitter from 'typed-emitter'

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
        defaultEncoding: 'UTF-8'
      }
    })

    this._win.on('close', (event) => {
      console.log('OptionWindow ->', 'close')
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

    // Show window when page is ready
    this._win.webContents.on('did-finish-load', () => {
      this._win.show()
    })
  }

  sendProgress(progress: UpdateProgress) {
    console.log(progress.message)
    this._win.webContents.send(IPCEvents.UPDATE_PROGRESS, progress)
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
