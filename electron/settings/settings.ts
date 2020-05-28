import { Application } from '../application';
import { Logger } from '../core/logger/logger-electron';
import { checkSettings } from './settings-checker';
import { SettingsDefault } from './settings-default';
import * as macAddress from 'macaddress';
import { app, ipcMain, session, dialog, BrowserWindow } from 'electron';
import del from 'del';

const settings = require('electron-settings');
const i18n = require('node-translate');

export class Settings {

    public static init(): void {
        (checkSettings()) ? null : this.resetSettings();

        if (!settings.get('language')) {
            let local = app.getLocale();
            let shortLocal = local.slice(0, 1);

            switch (shortLocal) {
                case "fr":
                case "es":
                case "it":
                    settings.set('language', shortLocal);
                    break;
                case "en":
                case "pl":
                case "tr":
                default:
                    settings.set('language', 'en');
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
        }).setLocale(settings.get('language'));

        settings.watch('language', (newValue, oldValue) => {
            i18n.setLocale(newValue);
            this.reloadSettings();
        });

        settings.watch('option.shortcuts.no_emu.tabs', (newValue, oldValue) => {
            this.reloadShortcut();
        });

        ipcMain.on('read-settings', (event, args) => {
            let value = settings.get(args[0]);
            event.returnValue = value;
        });

        ipcMain.on('write-settings', (event, args) => {
            event.returnValue = settings.set(args[0], args[1]);
        });

        ipcMain.on('reset-game', (event, args) => {
            this.resetGame();
        });

        ipcMain.on('clear-cache', (event, args) => {
            this.clearCache();
        });
    };

    public static resetSettings(): void {

        Logger.info("[SETTING] Restoring the settings..")

        settings.setAll(SettingsDefault);

        macAddress.one((err, addr) => {
            if(err || !addr){
                settings.set('macAddress',  Math.random().toString());
                Logger.warn("[SETTING] Unable to retrieve the mac address");
            }else{
                settings.set('macAddress', Buffer.from(addr).toString('base64'));
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
            gamePath: app.getPath('userData') + '/game',
            appPath: Application.appPath,
            platform: process.platform,
            language: settings.get('language')
        };
    };

    public static resetGame() {
        let destinationPath = app.getPath('userData') + '/game';

        del([destinationPath + "/*"], {force: true}).then((paths) => {
            app.relaunch();
            app.quit();
        });
    }

    public static clearCache() {
        let promises = [];
        promises.push(new Promise((resolve, reject) => {
            Application.mainWindows.forEach((mainWindow) => {
                mainWindow.win.webContents.session.clearCache(() => {
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
            }, () => {
            });
        });
    }

}
