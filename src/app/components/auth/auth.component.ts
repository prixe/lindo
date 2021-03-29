import { Component } from '@angular/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { AuthService } from 'app/core/service/auth.service';
import { SettingsService } from 'app/core/service/settings.service';

@Component({
    selector: 'component-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    public inputMasterPassword: string = "";
    public badMasterPassword: boolean = false;
    public loadingMultiAccount: boolean = false;

    constructor(
        public authService: AuthService,
        public applicationService: ApplicationService,
        private ipcRenderer: IpcRendererService,
        private settingsService: SettingsService
    ) {}

    public authByMasterPassword() {
        this.authService.loginWithMasterPassword(this.inputMasterPassword).then((inputMasterPassword) => {

            this.badMasterPassword = false;

            Application.masterPassword = inputMasterPassword;
            Application.isAuthentified = true;

            if (this.settingsService.option.vip.multiaccount.active) {
                this.processMultiAccount();
            } else {
                this.authService.updateAuthState();
            }

        }).catch(() => {
            this.badMasterPassword = true;
        });

        return false;
    }

    public skipAuth() {
        Application.skipAuthentification = true;
        this.authService.updateAuthState();
    }

    private processMultiAccount() {
        let multiAccountsParam = this.settingsService.option.vip.multiaccount.windows;
        if (multiAccountsParam.length > 0) {
            if ((multiAccountsParam.length - 1) == 0) {
                this.authService.updateAuthState();
                Application.mainWindows[0].win.webContents.send('accounts', multiAccountsParam[0]);
            } else {
                this.loadingMultiAccount = true;

                let windowsCount = 1;

                this.ipcRenderer.on('window-ready', (event, arg) => {
                    windowsCount += 1;

                    if (windowsCount == multiAccountsParam.length) {
                        this.loadingMultiAccount = false;
                        this.authService.updateAuthState();

                        for (let i = 0; i < multiAccountsParam.length; i++) {
                            Application.mainWindows[i].win.webContents.send('accounts', multiAccountsParam[i]);
                        }
                    }
                });

                for (let i = 0; i < (multiAccountsParam.length - 1); i++) {
                    Application.addWindow();
                }
            }
        }
    }
}
