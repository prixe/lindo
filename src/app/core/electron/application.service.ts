import { Injectable } from '@angular/core';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { environment } from 'environments/environment';

@Injectable()
export class ApplicationService {

    public websiteUrl: string;
    public apiUrl: string;
    public appName: string;
    public appPath: string;
    public gamePath: string;
    public buildVersion: string;
    public appVersion: string;
    public masterpassword: string;

    public remoteBuildVersion: string;
    public remoteAppVersion: string;
    public version: string;

    constructor(
        private ipcRendererService: IpcRendererService
    ) { }

    public load(): void {

        // Chargement de la configuration distance
        this.appName = environment.appName;
        this.websiteUrl = environment.websiteUrl;
        this.apiUrl = environment.apiUrl;

        //On récupère la version de DT distante
        this.remoteBuildVersion = Application.remoteBuildVersion;
        this.remoteAppVersion = Application.remoteAppVersion;
        this.version = Application.version;

        let appConfig = Settings.getAppConfig();
        this.appPath = appConfig.appPath;
        this.gamePath = appConfig.gamePath;
        this.appVersion = appConfig.appVersion;
        this.buildVersion = appConfig.buildVersion;
    }
}
