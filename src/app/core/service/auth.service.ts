import { IpcRendererService } from '../electron/ipcrenderer.service';
import { Injectable } from '@angular/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { CryptService } from 'app/core/service/crypt.service';
import { SettingsService } from 'app/core/service/settings.service';

@Injectable()
export class AuthService {
    public authRequired: boolean = false;

    constructor(
        private cryptService: CryptService,
        private applicationService: ApplicationService,
        private ipcRendererService: IpcRendererService,
        private settingsService: SettingsService
    ) {
        this.updateAuthState();
    }

    public updateAuthState(): void {
        this.authRequired = this.requireAuthentification();
    }

    public loginWithMasterPassword(masterPassword: string): Promise<string | any> {
        return new Promise((resolve, reject) => {
            if (this.settingsService.option.vip.multiaccount.master_password == this.cryptService.createHash(masterPassword)) {
                // hash sha512
                resolve(masterPassword);
            } else if (this.settingsService.option.vip.multiaccount.master_password == this.cryptService.createHashMd5(masterPassword)) {
                // hash md5

                // update hash password using sha512
                this.settingsService.option.vip.multiaccount.master_password = this.cryptService.createHash(masterPassword);
                resolve(masterPassword);
            } else {
                reject();
            }
        });
    }

    public requireAuthentification(): boolean {
        if (!isElectron) {
            return false;
        }

        if (Application.isAuthentified == false && Application.skipAuthentification == false) {
            if (this.settingsService.option.vip.multiaccount.active && Application.masterPassword == "") {
                return true;
            }
            //TODO if je suis pas connecté sur l'application via le service
        }

        return false;
    }
}
