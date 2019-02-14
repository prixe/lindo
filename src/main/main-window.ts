import {BrowserWindow, screen} from 'electron';
import * as url from 'url';
import * as path from 'path';
import {OptionDefinitions} from './option-definitions';
import {Store} from 'redux';
import {AppState} from '../shared/store/store';

export class MainWindow {

  private window: BrowserWindow;

  constructor(private options: OptionDefinitions, private store: Store<AppState>) {
    const {height, width} = screen.getPrimaryDisplay().workAreaSize;

    this.window = new BrowserWindow({
      width,
      height,
      center: true,
      webPreferences: {
        nodeIntegration: true
      }
    });
  }

  run(): void {
    if (this.options.serve) {
      require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/../../node_modules/electron`)
      });
      this.window.loadURL('http://localhost:4200');
      this.window.webContents.openDevTools();
    } else {
      this.window.loadURL(url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }
  }

}
