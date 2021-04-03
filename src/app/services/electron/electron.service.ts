import {Injectable} from '@angular/core';

const process = nodeProcess;

@Injectable()
export class ElectronService {

    public static getCurrentWindow() {
        return Remote.getCurrentWindow();
    }

    public static openExternal(url: string) {
        electron.shell.openExternal(url);
    }

    public static getVersion() {
        return app.version;
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
