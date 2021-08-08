import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CryptService} from '@services/crypt.service';
import {PromptService} from '@services/prompt.service';
import {SettingsService} from '@services/settings.service';
import Swal from "sweetalert2";
import {ApplicationService} from "@services/electron/application.service";

@Component({
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

    private windows: { account_name_encrypted: string, password_encrypted: string }[][];
    public inputCheckMasterPassword: string = "";
    public inputCheckMasterPasswordError: boolean = false;

    constructor(public settingsService: SettingsService,
                public applicationService: ApplicationService,
                public crypt: CryptService,
                private translate: TranslateService,
                private promptService: PromptService
    ) {
    }

    public hasPassword() {
        return this.settingsService.option.vip.multiaccount.master_password != "";
    }

    public setMasterPassword() {

        void this.promptService.custom({

            input: 'password',
            title: this.translate.instant("app.option.vip.multi-account.prompt.add-master.title"),
            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.add-master.confirm"),
            showLoaderOnConfirm: true,

            showDenyButton: true,
            denyButtonText: this.translate.instant("app.option.vip.multi-account.prompt.add-master.cancel"),

            preConfirm: (masterPassword) => {

                return new Promise((resolve, reject) => {

                    if (masterPassword.length < 8) {
                        Swal.hideLoading();
                        return Swal.showValidationMessage(this.translate.instant("app.option.vip.multi-account.prompt.add-master.min-lenght", {"lenght": 8}))
                    }

                    this.applicationService.masterpassword = masterPassword;
                    this.settingsService.option.vip.multiaccount.master_password = this.crypt.createHash(masterPassword);

                    this.settingsService.option.vip.multiaccount.active = true;

                    resolve();
                })
            },

        }).then((result) => {

            if (result.isConfirmed) {
                void this.promptService.success({html: this.translate.instant("app.option.vip.multi-account.prompt.add-master.success-text")})
            }
        });
    }

    public updateMasterPassword() {

        void this.promptService.custom({

            title: this.translate.instant("app.option.vip.multi-account.prompt.edit-master.title"),
            html:
                '<input type="password" id="input-old-password" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.edit-master.input-old-placeholder") + '">' +
                '<input type="password" id="input-new-password" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.edit-master.input-new-placeholder") + '">',

            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.edit-master.confirm"),
            showLoaderOnConfirm: true,

            showDenyButton: true,
            denyButtonText: this.translate.instant("app.option.vip.multi-account.prompt.edit-master.cancel"),

            preConfirm: () => {

                return new Promise((resolve, reject) => {

                    const oldPassword = (<HTMLInputElement>document.getElementById("input-old-password")).value;
                    const newPassword = (<HTMLInputElement>document.getElementById("input-new-password")).value;

                    if (newPassword.length < 8) {
                        Swal.hideLoading();
                        return Swal.showValidationMessage(this.translate.instant("app.option.vip.multi-account.prompt.edit-master.min-lenght", {"lenght": 8}))
                    }

                    if (this.settingsService.option.vip.multiaccount.master_password != this.crypt.createHash(oldPassword)) {
                        Swal.hideLoading();
                        return Swal.showValidationMessage(this.translate.instant("app.option.vip.multi-account.prompt.edit-master.incorrect-old", {"lenght": 8}))
                    }

                    // For every window and accounts in settings,
                    // Re-encrypt account names and password with the new master password
                    const windows = this.settingsService.option.vip.multiaccount.windows;
                    for (const i in windows) {
                        for (const j in windows[i]) {
                            const account_name = this.crypt.decrypt(windows[i][j].account_name_encrypted, oldPassword);
                            const password = this.crypt.decrypt(windows[i][j].password_encrypted, oldPassword);

                            windows[i][j] = {
                                account_name_encrypted: this.crypt.encrypt(account_name, newPassword),
                                password_encrypted: this.crypt.encrypt(password, newPassword),
                            }
                        }
                    }
                    this.settingsService.option.vip.multiaccount.windows = windows;
                    ////////////////////////////////////////////////////////////////

                    this.settingsService.option.vip.multiaccount.master_password = this.crypt.createHash(newPassword);
                    this.applicationService.masterpassword = newPassword;

                    resolve();
                })
            },

        }).then((result) => {

            if (result.isConfirmed) {
                void this.promptService.success({html: this.translate.instant("app.option.vip.multi-account.prompt.edit-master.success-text")})
            }
        });

    }

    public confirmDeleteMasterPassword() {

        void this.promptService.custom({

            icon: "warning",
            title: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.title"),
            html: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.text"),
            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.confirm"),
            showLoaderOnConfirm: true,

            showDenyButton: true,
            denyButtonText: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.cancel")

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteMasterPassword();
                void this.promptService.success({html: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.success-text")})
            }
        });
    }

    public checkMasterPassword($event: any) {

        $event.preventDefault();

        if (this.settingsService.option.vip.multiaccount.master_password == this.crypt.createHash(this.inputCheckMasterPassword)) {
            this.inputCheckMasterPasswordError = false;
            this.applicationService.masterpassword = this.inputCheckMasterPassword;
        } else {
            this.inputCheckMasterPasswordError = true;
        }
    }

    public addAccount(windowIndex: number) {

        const windows = this.settingsService.option.vip.multiaccount.windows;

        void this.promptService.custom({

            title: this.translate.instant("app.option.vip.multi-account.prompt.add-account.title"),
            html:
                '<input type="text" id="input-account-login" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.add-account.input-login-placeholder") + '">' +
                '<input type="password" id="input-account-password" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.add-account.input-password-placeholder") + '">',

            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.add-account.confirm"),
            showLoaderOnConfirm: true,

            showDenyButton: true,
            denyButtonText: this.translate.instant("app.option.vip.multi-account.prompt.add-account.cancel"),

            preConfirm: () => {

                return new Promise((resolve, reject) => {

                    const accountLogin = (<HTMLInputElement>document.getElementById("input-account-login")).value;
                    const accountPassword = (<HTMLInputElement>document.getElementById("input-account-password")).value;

                    if (accountLogin == "") {
                        Swal.hideLoading();
                        return Swal.showValidationMessage(this.translate.instant("app.option.vip.multi-account.prompt.add-account.min-lenght-login"))
                    }

                    if (accountPassword == "") {
                        Swal.hideLoading();
                        return Swal.showValidationMessage(this.translate.instant("app.option.vip.multi-account.prompt.add-account.min-lenght-password"))
                    }

                    windows[windowIndex].push({
                        account_name_encrypted: this.crypt.encrypt(accountLogin, this.applicationService.masterpassword),
                        password_encrypted: this.crypt.encrypt(accountPassword, this.applicationService.masterpassword)
                    });

                    this.settingsService.option.vip.multiaccount.windows = windows;

                    resolve();
                })
            },

        });
    }

    // Delete the account from settings
    public deleteAccount(windowIndex: number, accountIndex: number) {

        const windows = this.settingsService.option.vip.multiaccount.windows;

        windows[windowIndex].splice(accountIndex, 1);

        this.settingsService.option.vip.multiaccount.windows = windows;
    }

    // Modify an account
    public modifyAccount(windowIndex: number, accountIndex: number, account_name_encrypted: string) {

        const login = this.crypt.decrypt(account_name_encrypted, this.applicationService.masterpassword);
        const windows = this.settingsService.option.vip.multiaccount.windows;

        void this.promptService.custom({

            title: this.translate.instant("app.option.vip.multi-account.prompt.edit-account.title"),
            html:
                '<input type="text" id="input-account-login" value="' + login + '" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.edit-account.input-login-placeholder") + '"  >' +
                '<input type="password" id="input-account-password" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.edit-account.input-password-placeholder") + '">',

            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.edit-account.confirm"),
            showLoaderOnConfirm: true,

            showDenyButton: true,
            denyButtonText: this.translate.instant("app.option.vip.multi-account.prompt.edit-account.cancel"),

            preConfirm: () => {

                return new Promise((resolve, reject) => {

                    const accountLogin = (<HTMLInputElement>document.getElementById("input-account-login")).value;
                    const accountPassword = (<HTMLInputElement>document.getElementById("input-account-password")).value;

                    if (accountLogin == "") {
                        Swal.hideLoading();
                        return Swal.showValidationMessage(this.translate.instant("app.option.vip.multi-account.prompt.edit-account.min-lenght-login"))
                    }

                    if (accountPassword == "") {
                        Swal.hideLoading();
                        return Swal.showValidationMessage(this.translate.instant("app.option.vip.multi-account.prompt.edit-account.min-lenght-password"))
                    }

                    windows[windowIndex][accountIndex].account_name_encrypted = this.crypt.encrypt(accountLogin, this.applicationService.masterpassword);
                    windows[windowIndex][accountIndex].password_encrypted = this.crypt.encrypt(accountPassword, this.applicationService.masterpassword);

                    this.settingsService.option.vip.multiaccount.windows = windows;

                    resolve();
                })
            },

        });

    }

    public getTotalAccounts(windows: Array<Array<any>>): number {

        let total: number = 0;

        windows.forEach((window) => {
            total += window.length;
        });

        return total;
    }

    public addWindow() {

        let windows = this.settingsService.option.vip.multiaccount.windows;
        if (typeof windows === "undefined") windows = [];

        windows.push([]);
        this.settingsService.option.vip.multiaccount.windows = windows;
    }

    public deleteWindow(windowIndex: number) {

        const windows = this.settingsService.option.vip.multiaccount.windows;

        windows.splice(windowIndex, 1);

        if (windows.length == 0) this.settingsService.option.vip.multiaccount.windows.push([]);

        this.settingsService.option.vip.multiaccount.windows = windows;
    }

    private deleteMasterPassword() {

        this.applicationService.masterpassword = "";
        this.settingsService.option.vip.multiaccount.master_password = "";
        this.settingsService.option.vip.multiaccount.active = false;

        this.settingsService.option.vip.multiaccount.windows = [];
        this.settingsService.option.vip.multiaccount.windows.push([])
    }

}
