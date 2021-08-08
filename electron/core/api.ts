import {UpdateInformations} from '../update/update-informations.interface';
import axios from 'axios';

const settings = require('electron-settings');

export class Api {

    public static apiUrl: string = "https://api.lindo-app.com";

    public static getRemoteVersion(): Promise<Object | any> {

        return new Promise((resolve, reject) => {

            axios.get(this.apiUrl + '/version.json?time=' + new Date().getTime()).then((response) => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            });
        });
    }

    public static getUpdateInformations(): Promise<UpdateInformations | any> {

        return new Promise((resolve, reject) => {

            const params = new URLSearchParams({
                version: settings.getSync('buildVersion'),
                os: process.platform,
                time: new Date().getTime().toString(),
                lindo: "1"
            });

            axios.get(this.apiUrl + '/update.php?' + params.toString()).then((response) => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            });
        });
    }
}
