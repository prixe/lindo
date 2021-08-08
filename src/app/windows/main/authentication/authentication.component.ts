import {Component} from '@angular/core';
import {SettingsService} from "@services/settings.service";
import {AuthService} from "@services/auth.service";
import {ApplicationService} from "@services/electron/application.service";
import {IpcRendererService} from "@services/electron/ipcrenderer.service";

@Component({
    selector: 'app-main-authentication-component',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {
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
            Application.isAuthenticated = true;

            if (this.settingsService.option.vip.multiaccount.active) {
                this.processMultiAccount();
            }

        }).catch(() => {
            this.badMasterPassword = true;
        });

        return false;
    }

    public skipAuth() {
        Application.skipAuthentication = true;
        this.authService.updateAuthState();
    }

    private processMultiAccount() {

        const multiAccountsParam = this.settingsService.option.vip.multiaccount.windows;
        if (multiAccountsParam.length > 0) {
            if ((multiAccountsParam.length - 1) == 0) {
                this.authService.updateAuthState();
                Application.mainWindows[0].win.webContents.send('accounts', multiAccountsParam[0]);
            } else {
                this.loadingMultiAccount = true;

                let windowsCount = 1;

                this.ipcRenderer.on('window-ready', () => {
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
