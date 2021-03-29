import {Injectable} from '@angular/core';

const {shell, remote} = electron;
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
        Application.quit();
    }

    public static restart() {
        Application.relaunch();
        Application.quit();
    }
}
