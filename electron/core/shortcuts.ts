import { Logger } from './logger/logger-lindo';

const electronLocalshortcut = require('electron-localshortcut');
const settings = require('electron-settings');
const async = require('async');

/** TODO a déplacer dans l'app */

export class ShortCuts {

    private win: Electron.BrowserWindow;
    private isBinded: boolean;

    constructor(win: Electron.BrowserWindow) {
        this.win = win;
        this.isBinded = false;
    }

    public bindAll(): void {

        let errorConsoleFunction = console.error;
        console.error = function() {}

        async.forEachOf(settings.getSync('option.shortcuts.no_emu.tabs'), (shortcut: string, index: number) => {
            if (shortcut) {
                try{
                    electronLocalshortcut.register(this.win, ShortCuts.convert(shortcut), () => {
                        this.win.webContents.send('switch-tab', index);
                    });
                }catch(e){
                    //console.log(e);
                }
            }
        });

        console.error = errorConsoleFunction;
    }

    public reload(): void {
        electronLocalshortcut.unregisterAll(this.win);
        this.bindAll();
        Logger.info('emit->reload-shortcuts');
        this.win.webContents.send('reload-shortcuts');
    }

    public enable(): void {
        if (!this.isBinded) {
            this.bindAll()
        } else {
            electronLocalshortcut.enableAll(this.win);
        }
    }

    public disable(): void {
        electronLocalshortcut.disableAll(this.win);
    }

    public static convert(shortcut: string): string {
        shortcut = shortcut.replace('ctrl', 'CmdOrCtrl');

        return shortcut;
    }
}
