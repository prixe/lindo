import {autoUpdater} from 'electron-updater';
import {app} from 'electron';
import BrowserWindow = Electron.BrowserWindow;

export enum EUpdateType {
  Application,
  Game
}

export class UpdateWindow extends BrowserWindow {

  constructor(private updateType: EUpdateType) {
    super({
      width: 700,
      height: 700,
      center: true
    });
  }

  run(): void {

  }

}
