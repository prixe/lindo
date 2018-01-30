import { UpdateInformations } from '../update/update-informations.interface';
import request = require('request');

const settings = require('electron-settings');

export class Api {

    public static apiUrl: string = "http://api.no-emu.co";

    public static getRemoteVersion(): Promise<Object | any> {

        return new Promise((resolve, reject) => {

            request.get({ url: `${this.apiUrl}/version.json?time=${new Date().getTime()}`, forever: true }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(error);
                }
            });
        });
    }

    public static getUpdateInformations(): Promise<UpdateInformations | any> {

        return new Promise((resolve, reject) => {

            let queries = 'version=' + settings.get('buildVersion') + '&os=' + process.platform + '&time=' + new Date().getTime() + '&lindo=1';
            let uri = `${this.apiUrl}/update.php?${queries}`;

            request.get({ url: uri, forever: true, gzip: true }, (error, response, body) => {

                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(error);
                }
            });
        });
    }
}
