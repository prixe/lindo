import { Api } from '../core/api';
import { Logger } from '../core/logger/logger-electron';
import { UpdateApp } from './update-app';
import { UpdateGame } from './update-game';
import { UpdateInformations } from './update-informations.interface';

const settings = require('electron-settings');

export class UpdateAll {

    public static run(): Promise<UpdateInformations | string> {

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

            }).then((response: UpdateInformations) => {

                let doGameUpdate = UpdateGame.check(response);
                if (doGameUpdate) {
                    Logger.info("[UPDATE] Game update required.");
                    return UpdateGame.update(response);
                } else {
                    Logger.info("[UPDATE] Game is up to date.");
                    return new Promise((resolve) => { resolve(response) });
                }

            }).then((response: UpdateInformations) => {

                resolve(response);

            }).catch((response: UpdateInformations | any) => {
                reject(response);
            });
        });

    }
}