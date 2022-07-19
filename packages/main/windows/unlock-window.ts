import { RootStore } from '@lindo/shared'
import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { EventEmitter } from 'stream'
import TypedEmitter from 'typed-emitter'

type UnlockWindowEvents = {
  close: (event: Event) => void
}
export class UnlockWindow extends (EventEmitter as new () => TypedEmitter<UnlockWindowEvents>) {
  private readonly _win: BrowserWindow
  private readonly _store: RootStore

  constructor(store: RootStore) {
    super()
    this._store = store
    this._win = new BrowserWindow({
      show: false,
      width: 600,
      height: 300,
      title: 'Unlock Multi-Accounts',
      fullscreenable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.cjs'),
        defaultEncoding: 'UTF-8'
      }
    })

    if (app.isPackaged) {
      this._win.loadURL(`file://${join(__dirname, '../renderer/index.html')}#/unlock`)
    } else {
      // 🚧 Use ['ENV_NAME'] avoid vite:define plugin

      // eslint-disable-next-line dot-notation
      const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}#/unlock`

      this._win.loadURL(url)
      if (process.env.NODE_ENV === 'development') {
        this._win.webContents.openDevTools({ mode: 'detach' })
      }
    }

    this._win.on('close', (event) => {
      this._close(event)
    })

    // Show window when page is ready
    this._win.webContents.on('did-finish-load', () => {
      this._win.show()
    })
  }

  private _close(event: Event) {
    this._win.removeAllListeners()
    this.emit('close', event)
  }

  close() {
    this._win.close()
  }

  focus = () => this._win.focus()
}
