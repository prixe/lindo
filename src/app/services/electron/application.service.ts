import {Injectable} from '@angular/core';
import {environment} from "@env/environment";

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

    public async load(): Promise<void> {

        // Chargement de la configuration distance
        this.appName = environment.appName;
        this.apiUrl = environment.apiUrl;

        return new Promise<void>((resolve)=>{

            //On récupère la version de DT distante
            this.remoteBuildVersion = Application.remoteBuildVersion;
            this.remoteAppVersion = Application.remoteAppVersion;
            this.version = Application.version;

            const appConfig = Settings.getAppConfig();
            this.appPath = appConfig.appPath;
            this.gamePath = appConfig.gamePath;
            this.appVersion = appConfig.appVersion;
            this.buildVersion = appConfig.buildVersion;

            return resolve();
        });
    }
}
