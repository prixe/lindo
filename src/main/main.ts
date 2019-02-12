import {app, BrowserWindow, screen} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as log from 'electron-log';
import {autoUpdater} from 'electron-updater';
import configureStore from '../shared/store/configureStore';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

log.transports.file.level = 'info';
autoUpdater.logger = log;
log.info('App starting...');

function createWindow() {

  const store = configureStore({}, 'main');
  store.subscribe(async () => {
    console.log(store.getState());
    // persist store changes
    // TODO: should this be blocking / wait? _.throttle?
    // await storage.set('state', global.state);
  });

  // store.dispatch(setRemindersEnabled(true));
  // store.dispatch(setRemindersEnabled(false));
  const size = screen.getPrimaryDisplay().workAreaSize;

  const createBrowserWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      webPreferences: {
        nodeIntegration: true
      }
    });

    if (serve) {
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
      win = null;
    });
  };

  createBrowserWindow();
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  app.on('ready', function () {
    autoUpdater.checkForUpdatesAndNotify();
  });


  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
  });
  autoUpdater.on('update-available', (info) => {
    console.log('Update available.', info);
  });
  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.', info);
  });
  autoUpdater.on('error', (err) => {
    console.log('Error in auto-updater. ' + err);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
