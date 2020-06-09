import { Logger } from '../core/logger/logger-electron';
import { Application } from '../application';
import { UpdateWindow } from '../windows/update-window';
import { Versions } from './versions.interface';
import { app, ipcMain } from 'electron';

const settings = require('electron-settings');

export class UpdateGame {

    public static updateWindow: Electron.BrowserWindow;
    
    public static officialUpdate(): Promise<Versions> {
        return new Promise((resolve, reject) => {
            Logger.info("[UPDATE] Game update started..");

            let destinationPath = app.getPath('userData') + '/game';

            this.updateWindow = UpdateWindow.createWindow();

            this.updateWindow.loadURL(`file://${Application.appPath}/dist/app/index.html#/official-game-update`
                    + `/${encodeURIComponent(destinationPath)}`);

            ipcMain.on('update-finished', (event, args) => {
                Logger.info("[UPDATE] Game update finished.");

                settings.set('buildVersion', args[0].buildVersion);
                this.updateWindow.close();
                resolve(args[0]);
            });
        });
    }

}
