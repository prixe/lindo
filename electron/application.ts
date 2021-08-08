import {Logger} from './core/logger/logger-lindo';
import {UpdateAll} from './update/update-all';
import {MainWindow} from './windows/main-window';
import {app, BrowserWindow, dialog, ipcMain} from 'electron';

const settings = require('electron-settings');
const pkg = require(`${app.getAppPath()}/package.json`);

export class Application {

    public static mainWindows: MainWindow[] = [];
    public static appPath: string = __dirname + '/../..';
    public static userDataPath: string = app.getPath('userData');

    public static version: string;
    public static remoteBuildVersion: string;
    public static remoteAppVersion: string;
    public static canAddWindow: boolean = false;

    public static skipAuthentication: boolean = false;
    public static isAuthenticated: boolean = false;
    public static masterPassword: string = "";

    public static run() {

        this.version = pkg.version;

        UpdateAll.run().then((versions) => {

            settings.setSync('appVersion', versions.appVersion);

            this.remoteBuildVersion = versions.buildVersion;
            this.remoteAppVersion = versions.appVersion;

            Logger.info("[APPLICATION] Starting..");
            this.canAddWindow = true;
            this.addWindow();

        }).catch((error: any) => {

            Logger.error('Error occured on update process : ');
            Logger.error(error);

            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'error',
                title: 'Error',
                message: "Error occured on update process.",
                buttons: ['Close']
            }).then(() => {
                app.exit();
            });
        });

        //Renvoi de l'événement à toute les fenêtres
        ipcMain.on('auto-group-reset-counter', (event, arg) => {
            this.mainWindows.forEach((gWindow, index) => {
                gWindow.win.webContents.send('auto-group-reset-counter');
            });
        });

        ipcMain.on('auto-group-push-path', (event, arg) => {
            arg.unshift('auto-group-push-path');
            this.mainWindows.forEach((gWindow, index) => {
                gWindow.win.webContents.send.apply(gWindow.win.webContents, arg);
            });
        });

        ipcMain.on('window-ready', (event, arg) => {
            this.mainWindows.forEach((gWindow, index) => {
                gWindow.win.webContents.send('window-ready');
            });
        });

        app.on('second-instance', (event, commandLine, workingDirectory) => {
            if (this.canAddWindow) this.addWindow();
        });

        app.setAppUserModelId('com.lindo.app');

    }

    public static addWindow(): void {
        let gWindow = new MainWindow(this);
        gWindow.run();
        this.mainWindows.push(gWindow);
    }
}
