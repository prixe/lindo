import { Api } from '../core/api';
import { Logger } from '../core/logger/logger-lindo';
import { UpdateApp } from './update-app';
import { UpdateGame } from './update-game';
import { UpdateInformations } from './update-informations.interface';
import { Versions } from './versions.interface';

const settings = require('electron-settings');

export class UpdateAll {

    public static run(): Promise<Versions> {

        return new Promise((resolve, reject) => {

            Api.getUpdateInformations().then((response: UpdateInformations) => {

                let doAppUpdate = UpdateApp.check(response);
                if (doAppUpdate) {
                    Logger.info("[UPDATE] Application update required.");
                    return UpdateApp.update(response);
                } else {
                    Logger.info("[UPDATE] Application is up to date.");
                    return new Promise((resolve) => { resolve(response) });
                }

            })
            .catch(() => {
                Logger.warn("[UPDATE] Skipping app check");
            })
            .then(() => {
                UpdateGame.officialUpdate().then((versions) => {
                    resolve(versions);
                })
                .catch(err => {
                    reject(err);
                })
            })

        });

    }
}
