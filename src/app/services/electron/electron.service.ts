import {Injectable} from '@angular/core';

@Injectable()
export class ElectronService {

    public static getCurrentWindow() {
        return electronRemote.getCurrentWindow();
    }

    public static openExternal(url: string) {
        electron.shell.openExternal(url);
    }

    public static getVersion() {
        return electronRemoteApp.version;
    }

    public static getPlatform() {
        return electronRemoteProcess.platform;
    }

    public static close() {
        electronRemoteApp.quit();
    }

    public static restart() {
        electronRemoteApp.relaunch();
        electronRemoteApp.quit();
    }
}
