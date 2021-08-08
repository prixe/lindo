import {Injectable} from '@angular/core';
import {IpcRendererService} from './electron/ipcrenderer.service';
import {Logger} from './logger.helper';
import {SettingsProviderIpc} from '@helpers/settings.provider.ipc';
import {WindowService} from './window.service';
import {SettingsProvider} from "@interfaces/setting-provider";
import {Option as ModelOption} from "@helpers/option";

@Injectable()
export class SettingsService {

    public option: ModelOption;
    private settingsProvider: SettingsProvider;

    private _buildVersion: string;
    private _appVersion: string;
    private _macAddress: string;
    private _alertCounter: number;
    private _language: string;
    private _last_news: number;

    constructor(private ipcRendererService: IpcRendererService, private windowService: WindowService) {

        this.settingsProvider = new SettingsProviderIpc(ipcRendererService);

        const init = () => {
            this.option = new ModelOption(this.settingsProvider);

            this._appVersion = this.settingsProvider.read('appVersion');
            this._macAddress = this.settingsProvider.read('macAddress');
            this._buildVersion = this.settingsProvider.read('buildVersion');
            this._alertCounter = this.settingsProvider.read('alertCounter');
            this._language = this.settingsProvider.read('language');
            this._last_news = this.settingsProvider.read('last_news');
        };
        init();

        this.ipcRendererService.on('reload-settings', () => {
            Logger.verbose('receive->reload-settings');
            init();
            Logger.verbose('emit->reload-settings-done');
            this.ipcRendererService.send('reload-settings-done');
        });
    }

    get last_news(): number {
        return this._last_news;
    }

    set last_news(last_news: number) {
        this.settingsProvider.write('last_news', last_news);
        this._last_news = last_news;
    }

    get alertCounter(): number {
        return this._alertCounter;
    }

    set alertCounter(alertCounter: number) {
        this.settingsProvider.write('alertCounter', alertCounter);
        this._alertCounter = alertCounter;
    }

    get buildVersion(): string {
        return this._buildVersion;
    }

    set buildVersion(buildVersion: string) {
        this.settingsProvider.write('buildVersion', buildVersion);
        this._buildVersion = buildVersion;
    }

    get appVersion(): string {
        return this._appVersion;
    }

    set appVersion(appVersion: string) {
        this.settingsProvider.write('appVersion', appVersion);
        this._appVersion = appVersion;
    }

    get macAddress(): string {
        return this._macAddress;
    }

    set macAddress(macAddress: string) {
        this.settingsProvider.write('macAddress', macAddress);
        this._macAddress = macAddress;
    }

    get language(): string {
        return this._language;
    }

    set language(language: string) {
        this.settingsProvider.write('language', language);
        this._language = language;
    }
}
