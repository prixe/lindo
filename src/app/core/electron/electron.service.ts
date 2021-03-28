import { Injectable } from '@angular/core';

const {shell, remote} = electron;
const {app} = electron.remote;
const process = nodeProcess;

@Injectable()
export class ElectronService {

    constructor() {
    }

    public static getCurrentWindow() {
        return remote.getCurrentWindow();
    }

    public static openExternal(url: string) {
        shell.openExternal(url);
    }

    public static getVersion() {
        return Application.version;
    }

    public static getPlatform() {
        return process.platform;
    }

    public static close() {
        app.quit();
    }

    public static restart() {
        app.relaunch();
        app.quit();
    }
}
