import {Application} from '../application';
import {Logger} from '../core/logger/logger-lindo';
import {UpdateInformations} from './update-informations.interface';
import {app, BrowserWindow, dialog, shell} from 'electron';

const compareVersions = require('compare-versions');
const i18n = require('node-translate');

export class UpdateApp {

    public static check(response: UpdateInformations): boolean {
        Logger.info("[UPDATE] Check the application version..");

        const diff = compareVersions(Application.version, response.noemu.version);
        return (diff == -1);
    }

    public static update(response: UpdateInformations): Promise<UpdateInformations> {

        return new Promise((resolve, reject) => {

            switch (process.platform) {
                case 'darwin':
                case 'linux':
                case 'win32':
                    UpdateApp.openUpdateInfo(response).then(() => {
                        resolve(response);
                    });
            }
        });

    }

    public static openUpdateInfo(response: UpdateInformations): Promise<UpdateInformations> {

        return new Promise((resolve, reject) => {

            let message = i18n.t('updater.new-update.default');
            let buttons: Array<string> = [i18n.t('updater.new-update.go-site')];

            if (!response.noemu.required) {
                buttons.push(i18n.t('updater.new-update.ignore'));
            } else {
                message = i18n.t('updater.new-update.required')
            }

            Logger.info("[UPDATE] App update alert given..");

            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: i18n.t('updater.new-update.title', {version: response.noemu.version}),
                message: message,
                buttons: buttons,
            }).then((returnValue) => {

                if (returnValue.response == 0) {

                    Logger.info("[UPDATE] Redirected to app download page.");

                    shell.openExternal("https://lindo-app.com");
                    app.exit();

                } else {
                    Logger.warn("[UPDATE] App update ingored.");
                    resolve();
                }
            });
        });
    }

}
