import { Logger } from '../core/logger/logger-electron';
import { Application } from '../application';
import { UpdateWindow } from '../windows/update-window';
import { UpdateInformations } from './update-informations.interface';
import { Versions } from './versions.interface';
import { app, ipcMain } from 'electron';

const settings = require('electron-settings');
const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
const decompressUnzip = require('decompress-unzip');

export class UpdateGame {

    public static updateWindow: Electron.BrowserWindow;

    public static check(response: UpdateInformations): boolean {
        Logger.info("[UPDATE] Check the game version..");
        return (settings.get('buildVersion') == response.dofustouch.version) ? false : true;
    }

    public static update(response: UpdateInformations): Promise<UpdateInformations | string> {

        return new Promise((resolve, reject) => {

            Logger.info("[UPDATE] Game update started..");

            let downloadPath = app.getPath('temp') + '/' + response.dofustouch.fileName;
            let extractPath = app.getPath('userData') + '/game';
            let downloadUrl = response.dofustouch.file;

            this.updateWindow = UpdateWindow.createWindow();

            this.updateWindow.loadURL(`file://${Application.appPath}/dist/app/index.html#/game-update`
                + `/${encodeURIComponent(downloadPath)}`
                + `/${encodeURIComponent(downloadUrl)}`);


            ipcMain.on('install-update', (event, arg) => {

                decompress(downloadPath, extractPath, {
                    plugins: [decompressTargz(), decompressUnzip()]
                }).then(() => {

                    Logger.info("[UPDATE] Game update finished.");

                    settings.set('buildVersion', response.dofustouch.version);
                    this.updateWindow.close();
                    resolve(response);

                }).catch(() => {
                    reject("Error on game update installation.");
                });
            });

        });

    }

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
