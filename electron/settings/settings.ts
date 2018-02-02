import { Application } from '../application';
import { Logger } from '../core/logger/logger-electron';
import { checkSettings } from './settings-checker';
import { SettingsDefault } from './settings-default';
import * as address from 'address';
import { app, ipcMain } from 'electron';

const settings = require('electron-settings');
const i18n = require('node-translate');

export class Settings {

    public static init(): void {

        (checkSettings()) ? null : this.resetSettings();

        if (!settings.get('language')) {

            let local = app.getLocale();
            let shortLocal = local.slice(0, 1);

            switch (shortLocal) {
                case "en":
                case "fr":
                case "es":
                    settings.set('language', shortLocal);
                    break;
                default:
                    settings.set('language', 'en');
                    break;
            }
        }

        //Configure the local for electron
        i18n.requireLocales({
            'en': require(Application.appPath + `/dist/electron/i18n/en`),
            'fr': require(Application.appPath + `/dist/electron/i18n/fr`),
            'es': require(Application.appPath + `/dist/electron/i18n/es`)
        }).setLocale(settings.get('language'));

        settings.watch('language', (newValue, oldValue) => {
            i18n.setLocale(newValue);
            this.reloadSettings();
        });

        settings.watch('option.shortcuts.no_emu.tabs', (newValue, oldValue) => {
            this.reloadShortcut();
        });

        ipcMain.on('read-settings', (event, args) => {
            console.log(args);
            console.log('read');
            let value = settings.get(args[0]);
            event.returnValue = value;
        });

        ipcMain.on('write-settings', (event, args) => {
            console.log('write');
            event.returnValue = settings.set(args[0], args[1]);
        });
    };

    public static resetSettings(): void {

        Logger.info("[SETTING] Restoring the settings..")

        settings.setAll(SettingsDefault);

        address.mac((err, addr) => {
            settings.set('macAddress', btoa(addr));
            Logger.info("[SETTING] All settings are restored.")
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

}
