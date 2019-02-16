import {app, BrowserWindow, dialog} from 'electron';
import * as log from 'electron-log';
import {autoUpdater} from 'electron-updater';
import {Application} from './application';

// ignore black list GPU for WebGL
app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');

// disable background throttling
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');

// bypass SSL bad certificate
app.on('certificate-error', (event, webContents, u, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

// configure logger
log.transports.file.level = 'info';
autoUpdater.logger = log;
log.info('App starting...');

// intercept uncaughtException
(process as NodeJS.EventEmitter).on('uncaughtException', function (error) {
  // Logger.error(error);
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'error',
    title: 'Error :(',
    message: 'An error as occurred in the main process, Lindo will close. ' + error.toString(),
    buttons: ['Close']
  }, () => {
    app.exit();
  });
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const application = new Application();
// start the application
app.on('ready', () => {
  application.run();
});

app.on('quit', () => {
  // application.destroy();
});

/* try {
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
    // if (win === null) {
    // createWindow();
    // }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
*/
