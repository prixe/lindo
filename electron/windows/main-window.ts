import { Logger } from '../core/logger/logger-lindo';
import { Application } from '../application';
import { GameMenuTemplate } from '../core/game-menu.template';
import { ShortCuts } from '../core/shortcuts';
import { UserAgent } from '../core/user-agent';
import { app, Menu, ipcMain } from 'electron';

const { webContents } = require('electron')
const settings = require('electron-settings');
const electron = require('electron');

export class MainWindow {

    private static count: number = 0;

    public win: Electron.BrowserWindow;
    public shortCuts: ShortCuts;
    public userAgent: UserAgent;

    private application: Application;
    private menu: Electron.Menu;
    private events: Array<any> = [];

    constructor(application: Application) {

        this.application = application;

        let screenPoint = electron.screen.getCursorScreenPoint();
        let display = electron.screen.getDisplayNearestPoint(screenPoint);

        let displayWidth = display.size.width;
        let displayHeight = display.size.height;

        let applicationWidth = parseInt(settings.getSync('option.general.resolution').x);
        let applicationHeight = parseInt(settings.getSync('option.general.resolution').y);

        let applicationPositionX = display.bounds.x + ((displayWidth / 2) - (applicationWidth / 2));
        let applicationPositionY = display.bounds.y + ((displayHeight / 2) - (applicationHeight / 2));

        let windowId = MainWindow.count;

        this.win = new electron.BrowserWindow({
            width: applicationWidth,
            height: applicationHeight,
            x: applicationPositionX,
            y: applicationPositionY,
            frame: false,
            show: false,
            backgroundColor: '#e6e6e6',
            webPreferences: {
                defaultFontSize: 13,
                defaultEncoding: "UTF-8",
                backgroundThrottling: false,
                allowRunningInsecureContent: true,
                webSecurity: false,
                partition: 'persist:' + windowId,
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });

        MainWindow.count++;

        this.userAgent = new UserAgent(windowId);
        this.win.webContents.setUserAgent(this.userAgent.getString());

        this.shortCuts = new ShortCuts(this.win);
        this.menu = Menu.buildFromTemplate(GameMenuTemplate.build());

        this.win.on('close', () => {

            let indexOfWindow = Application.mainWindows.findIndex((element) => {
                return element.win.id == this.win.id;
            });

            Application.mainWindows.splice(indexOfWindow, 1);

            if (Application.mainWindows.length == 0) {
                app.quit();
            }
        });
    }

    public reloadSettings(): void {

        Logger.info('emit->reload-settings');
        this.win.webContents.send('reload-settings');

        ipcMain.once('reload-settings-done', () => {
            this.win.webContents.send('reload-settings-done');
        });

        //Redraw the menu
        this.menu = Menu.buildFromTemplate(GameMenuTemplate.build());
        Menu.setApplicationMenu(this.menu);
    }

    public reloadShortcut(): void {
        this.shortCuts.reload();
    }

    public run(): void {

        this.win.loadURL(`file://${Application.appPath}/dist/app/index.html`);
        this.win.once('ready-to-show', () => {
            this.win.show()
        })

        Menu.setApplicationMenu(this.menu);

        // bind shortcuts
        this.shortCuts.enable();

        //On bloque les ouverture d'url
        this.win.webContents.on("new-window", (event: any, url: string) => {
            event.preventDefault();
        });
    }
}
