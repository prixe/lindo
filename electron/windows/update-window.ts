import electron = require('electron');

export class UpdateWindow {

    public static createWindow(): Electron.BrowserWindow {

        let screenPoint = electron.screen.getCursorScreenPoint();
        let display = electron.screen.getDisplayNearestPoint(screenPoint);

        let displayWidth = display.size.width;
        let displayHeight = display.size.height;

        let applicationWidth = 700;
        let applicationHeight = 190;

        let applicationPositionX = display.bounds.x + ((displayWidth / 2) - (applicationWidth / 2));
        let applicationPositionY = display.bounds.y + ((displayHeight / 2) - (applicationHeight / 2));

        let window = new electron.BrowserWindow({
            width: applicationWidth,
            height: applicationHeight,
            x: applicationPositionX,
            y: applicationPositionY,
            resizable: false,
            show: false,
            backgroundColor: '#e6e6e6',
            frame: false,
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });

        window.once('ready-to-show', () => { window.show() })
        window.on('closed', () => { window = null; });

        return window;
    }
}
