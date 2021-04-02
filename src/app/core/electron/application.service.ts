import { Injectable } from '@angular/core';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApplicationService {

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
        private ipcRendererService: IpcRendererService,
        private http: HttpClient
    ) {
    }

    public async load(): Promise<void> {
        // Chargement de la configuration distance
        this.appName = environment.appName;
        this.apiUrl = environment.apiUrl;

        return new Promise<void>((resolve, reject)=>{
            //On récupère la version de DT distante
            this.remoteBuildVersion = Application.remoteBuildVersion;
            this.remoteAppVersion = Application.remoteAppVersion;
            this.version = Application.version;

            let appConfig = Settings.getAppConfig();
            this.appPath = appConfig.appPath;
            this.gamePath = appConfig.gamePath;
            this.appVersion = appConfig.appVersion;
            this.buildVersion = appConfig.buildVersion;

            return resolve();
        });
    }
}
