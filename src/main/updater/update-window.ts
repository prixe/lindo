import {BrowserWindow} from 'electron';

export enum EUpdateType {
  Application,
  Game
}

export class UpdateWindow {

  private window: BrowserWindow;

  constructor(private updateType: EUpdateType) {
    this.window = new BrowserWindow({
      width: 700,
      height: 700,
      center: true,
      resizable: false,
      show: false,
      frame: false,
      backgroundColor: '#e6e6e6'
    });
  }

  run(): void {

  }

}
