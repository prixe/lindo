import {OptionDefinitions} from './option-definitions';
import configureStore from '../shared/store/configureStore';
import {BrowserWindow, screen} from 'electron';
import * as url from 'url';
import * as path from 'path';
import {AppState} from '../shared/store/store';
import {Store} from 'redux';
import {Updater} from './updater/updater';

export class Application {

  private readonly  store: Store<AppState>;
  private readonly  updater: Updater;

  constructor(private options: OptionDefinitions) {
    this.store = configureStore({}, 'main');
    this.updater = new Updater();

    this.store.subscribe(async () => {
      console.log(this.store.getState());
      // persist store changes
      // await storage.set('state', global.state);
    });
    // this.store.dispatch(setRemindersEnabled(true));
  }

  async run(): Promise<void> {
    await this.updater.checkForUpdatesAndUpdate();
    this.createWindow();
  }

  private createWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    let win = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      webPreferences: {
        nodeIntegration: true
      }
    });

    if (this.options.serve) {
      require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/../../node_modules/electron`)
      });
      win.loadURL('http://localhost:4200');
    } else {
      win.loadURL(url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }

    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = undefined;
    });
  }
}
