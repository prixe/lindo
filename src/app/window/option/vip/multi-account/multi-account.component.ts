import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { CryptService } from 'app/core/service/crypt.service';
import { PromptService } from 'app/core/service/prompt.service';
import { SettingsService } from 'app/core/service/settings.service';

@Component({
    templateUrl: './multi-account.component.html',
    styleUrls: ['./multi-account.component.scss']
})
export class MultiAccountComponent {

    private windows: { account_name_encrypted: string, password_encrypted: string }[][];
    public inputCheckMasterPassword: string = "";
    public inputCheckMasterPasswordError: boolean = false;

    constructor(public settingsService: SettingsService,
        public applicationService: ApplicationService,
        public crypt: CryptService,
        private translate: TranslateService,
        private promptService: PromptService
    ) { }

    public hasPassword() {
        return this.settingsService.option.vip.multiaccount.master_password != "";
    }

    public setMasterPassword() {

        let self = this;

        self.promptService.custom({

            input: 'password',
            title: this.translate.instant("app.option.vip.multi-account.prompt.add-master.title"),
            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.add-master.confirm"),
            showLoaderOnConfirm: true,

            showCancelButton: true,
            cancelButtonText: this.translate.instant("app.option.vip.multi-account.prompt.add-master.cancel"),

            preConfirm: function (masterPassword) {

                return new Promise(function (resolve, reject) {

                    if (masterPassword.length < 8) {
                        reject(self.translate.instant("app.option.vip.multi-account.prompt.add-master.min-lenght", { "lenght": 8 }));
                        return false;
                    }

                    self.applicationService.masterpassword = masterPassword;
                    self.settingsService.option.vip.multiaccount.master_password = self.crypt.createHash(masterPassword);

                    self.settingsService.option.vip.multiaccount.active = true;

                    resolve();
                })
            },

        }).then(function (vipId) {
            self.promptService.success({ html: self.translate.instant("app.option.vip.multi-account.prompt.add-master.success-text") })
        }, (dismiss) => { });
    }

    public updateMasterPassword() {

        let self = this;

        self.promptService.custom({

            title: this.translate.instant("app.option.vip.multi-account.prompt.edit-master.title"),
            html:
            '<input type="password" id="input-old-password" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.edit-master.input-old-placeholder") + '">' +
            '<input type="password" id="input-new-password" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.edit-master.input-new-placeholder") + '">',

            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.edit-master.confirm"),
            showLoaderOnConfirm: true,

            showCancelButton: true,
            cancelButtonText: this.translate.instant("app.option.vip.multi-account.prompt.edit-master.cancel"),

            preConfirm: function () {

                return new Promise(function (resolve, reject) {

                    let oldPassword = (<HTMLInputElement>document.getElementById("input-old-password")).value;
                    let newPassword = (<HTMLInputElement>document.getElementById("input-new-password")).value;

                    if (newPassword.length < 8) {
                        reject(self.translate.instant("app.option.vip.multi-account.prompt.edit-master.min-lenght", { "lenght": 8 }));
                        return false;
                    }

                    if (self.settingsService.option.vip.multiaccount.master_password != self.crypt.createHash(oldPassword)) {
                        reject(self.translate.instant("app.option.vip.multi-account.prompt.edit-master.incorrect-old"));
                        return false;
                    }

                    // For every windows and accounts in settings,
                    // Re-encrypt account names and password with the new master password
                    let windows = self.settingsService.option.vip.multiaccount.windows;
                    for (let i in windows) {
                        for (let j in windows[i]) {
                            let account_name = self.crypt.decrypt(windows[i][j].account_name_encrypted, oldPassword);
                            let password = self.crypt.decrypt(windows[i][j].password_encrypted, oldPassword);

                            windows[i][j] = {
                                account_name_encrypted: self.crypt.encrypt(account_name, newPassword),
                                password_encrypted: self.crypt.encrypt(password, newPassword),
                            }
                        }
                    }
                    self.settingsService.option.vip.multiaccount.windows = windows;
                    ////////////////////////////////////////////////////////////////

                    self.settingsService.option.vip.multiaccount.master_password = self.crypt.createHash(newPassword);
                    self.applicationService.masterpassword = newPassword;

                    resolve();
                })
            },

        }).then(function (vipId) {
            self.promptService.success({ html: self.translate.instant("app.option.vip.multi-account.prompt.edit-master.success-text") })
        }, (dismiss) => { });

    }

    public confirmDeleteMasterPassword() {

        let self = this;

        self.promptService.custom({

            type: "warning",
            title: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.title"),
            html: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.text"),
            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.confirm"),
            showLoaderOnConfirm: true,

            showCancelButton: true,
            cancelButtonText: this.translate.instant("app.option.vip.multi-account.prompt.delete-master.cancel")

        }).then(function (result) {
            if (result.value) {
                self.deleteMasterPassword();
                self.promptService.success({ html: self.translate.instant("app.option.vip.multi-account.prompt.delete-master.success-text") })
            }
        }, (dismiss) => { });
    }

    public checkMasterPassword($event : any) {

        $event.preventDefault();

        if (this.settingsService.option.vip.multiaccount.master_password == this.crypt.createHash(this.inputCheckMasterPassword)) {
            this.inputCheckMasterPasswordError = false;
            this.applicationService.masterpassword = this.inputCheckMasterPassword;
        } else {
            this.inputCheckMasterPasswordError = true;
        }
    }

    public addAccount(windowIndex: number) {

        let self = this;
        let windows = this.settingsService.option.vip.multiaccount.windows;

        self.promptService.custom({

            title: this.translate.instant("app.option.vip.multi-account.prompt.add-account.title"),
            html:
            '<input type="text" id="input-account-login" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.add-account.input-login-placeholder") + '">' +
            '<input type="password" id="input-account-password" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.add-account.input-password-placeholder") + '">',

            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.add-account.confirm"),
            showLoaderOnConfirm: true,

            showCancelButton: true,
            cancelButtonText: this.translate.instant("app.option.vip.multi-account.prompt.add-account.cancel"),

            preConfirm: function () {

                return new Promise(function (resolve, reject) {

                    let accountLogin = (<HTMLInputElement>document.getElementById("input-account-login")).value;
                    let accountPassword = (<HTMLInputElement>document.getElementById("input-account-password")).value;

                    if (accountLogin == "") { reject(self.translate.instant("app.option.vip.multi-account.prompt.add-account.min-lenght-login")); return false; }
                    if (accountPassword == "") { reject(self.translate.instant("app.option.vip.multi-account.prompt.add-account.min-lenght-password")); return false; }

                    windows[windowIndex].push({
                        account_name_encrypted: self.crypt.encrypt(accountLogin, self.applicationService.masterpassword),
                        password_encrypted: self.crypt.encrypt(accountPassword, self.applicationService.masterpassword)
                    });

                    self.settingsService.option.vip.multiaccount.windows = windows;

                    resolve();
                })
            },

        }).then(function () { }, (dismiss) => { });
    }

    // Delete the account from settings
    public deleteAccount(windowIndex: number, accountIndex: number) {

        let windows = this.settingsService.option.vip.multiaccount.windows;

        windows[windowIndex].splice(accountIndex, 1);

        this.settingsService.option.vip.multiaccount.windows = windows;
    }

    // Modify an account
    public modifyAccount(windowIndex: number, accountIndex: number, account_name_encrypted: string) {

        let self = this;
        let login = self.crypt.decrypt(account_name_encrypted, self.applicationService.masterpassword);
        let windows = self.settingsService.option.vip.multiaccount.windows;

        self.promptService.custom({

            title: this.translate.instant("app.option.vip.multi-account.prompt.edit-account.title"),
            html:
            '<input type="text" id="input-account-login" value="' + login + '" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.edit-account.input-login-placeholder") + '"  >' +
            '<input type="password" id="input-account-password" class="swal2-input" placeholder="' + this.translate.instant("app.option.vip.multi-account.prompt.edit-account.input-password-placeholder") + '">',

            confirmButtonText: this.translate.instant("app.option.vip.multi-account.prompt.edit-account.confirm"),
            showLoaderOnConfirm: true,

            showCancelButton: true,
            cancelButtonText: this.translate.instant("app.option.vip.multi-account.prompt.edit-account.cancel"),

            preConfirm: function () {

                return new Promise(function (resolve, reject) {

                    let accountLogin = (<HTMLInputElement>document.getElementById("input-account-login")).value;
                    let accountPassword = (<HTMLInputElement>document.getElementById("input-account-password")).value;

                    if (accountLogin == "") { reject(self.translate.instant("app.option.vip.multi-account.prompt.edit-account.min-lenght-login")); return false; }
                    if (accountPassword == "") { reject(self.translate.instant("app.option.vip.multi-account.prompt.edit-account.min-lenght-password")); return false; }

                    windows[windowIndex][accountIndex].account_name_encrypted = self.crypt.encrypt(accountLogin, self.applicationService.masterpassword);
                    windows[windowIndex][accountIndex].password_encrypted = self.crypt.encrypt(accountPassword, self.applicationService.masterpassword);

                    self.settingsService.option.vip.multiaccount.windows = windows;

                    resolve();
                })
            },

        }).then(function () { }, (dismiss) => { });

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
        windows.push([]);
        this.settingsService.option.vip.multiaccount.windows = windows;
    }

    public deleteWindow(windowIndex: number) {

        let windows = this.settingsService.option.vip.multiaccount.windows;

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
