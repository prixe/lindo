import {Application} from '../application';
import {Logger} from '../core/logger/logger-lindo';
import {checkSettings} from './settings-checker';
import {SettingsDefault} from './settings-default';
import * as macAddress from 'macaddress';
import {app, ipcMain, dialog, BrowserWindow} from 'electron';
import * as rimraf from "rimraf";

const settings = require('electron-settings');
const i18n = require('node-translate');

export class Settings {

    public static init(): void {
        (checkSettings()) ? null : this.resetSettings();

        if (!settings.getSync('language')) {
            let local = app.getLocale();
            let shortLocal = local.slice(0, 1);

            switch (shortLocal) {
                case "fr":
                case "es":
                case "it":
                    settings.setSync('language', shortLocal);
                    break;
                case "en":
                case "pl":
                case "tr":
                default:
                    settings.setSync('language', 'en');
                    break;
            }
        }

        //Configure the local for electron
        i18n.requireLocales({
            'en': require(Application.appPath + `/dist/electron/i18n/en`),
            'fr': require(Application.appPath + `/dist/electron/i18n/fr`),
            'es': require(Application.appPath + `/dist/electron/i18n/es`),
            'it': require(Application.appPath + `/dist/electron/i18n/it`),
            'pl': require(Application.appPath + `/dist/electron/i18n/pl`),
            'tr': require(Application.appPath + `/dist/electron/i18n/tr`)
        }).setLocale(settings.getSync('language'));

        ipcMain.on('read-settings', (event, args) => {
            let value = settings.getSync(args[0]);
            event.returnValue = value;
        });

        ipcMain.on('write-settings', (event, args) => {
            event.returnValue = settings.setSync(args[0], args[1]);
        });

        ipcMain.on('reset-game', (event, args) => {
            this.resetGame();
        });

        ipcMain.on('clear-cache', (event, args) => {
            this.clearCache();
        });

        ipcMain.on('change-shortcuts', (event, args) => {
            this.reloadShortcut();
        });

        ipcMain.on('change-language', (event, args) => {
            i18n.setLocale(args[0]);
            this.reloadSettings();
        });
    };

    public static resetSettings(): void {

        Logger.info("[SETTING] Restoring the settings..")

        settings.setSync(SettingsDefault);

        macAddress.one((err, addr) => {
            if (err || !addr) {
                settings.setSync('macAddress', Math.random().toString());
                Logger.warn("[SETTING] Unable to retrieve the mac address");
            } else {
                settings.setSync('macAddress', Buffer.from(addr).toString('base64'));
            }

            Logger.info("[SETTING] All settings are restored.");
            this.reloadSettings();
        });
    };

    public static reloadSettings(): void {
        Application.mainWindows.forEach((window) => {
            window.reloadSettings();
        });
    }

    public static reloadShortcut(): void {
        Application.mainWindows.forEach((window) => {
            window.shortCuts.reload();
        });
    }

    public static getAppConfig() {
        return {
            gamePath: Application.userDataPath + '/game',
            appPath: Application.appPath,
            platform: process.platform,
            language: settings.getSync('language')
        };
    };

    public static resetGame() {

        let destinationPath = Application.userDataPath + '/game';

        rimraf(destinationPath, () => {
            app.relaunch();
            app.quit();
        });
    }

    public static clearCache() {
        let promises = [];
        promises.push(new Promise((resolve, reject) => {
            Application.mainWindows.forEach((mainWindow) => {
                mainWindow.win.webContents.session.clearCache().then(() => {
                    resolve();
                });
            });
        }));
        Promise.all(promises).then(() => {
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: i18n.t('options.clear-cache.title'),
                message: i18n.t('options.clear-cache.message'),
                buttons: ['OK']
            }).then(() => {
                app.exit();
            });
        });
    }

}
