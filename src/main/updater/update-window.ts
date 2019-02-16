import {GenericWindow} from '../generic-window';

export enum EUpdateType {
  Application,
  Game
}

export class UpdateWindow extends GenericWindow {

  constructor(private updateType: EUpdateType) {
    super({
      width: 700,
      height: 190,
      center: true,
      resizable: false,
      show: false,
      frame: false,
      backgroundColor: '#e6e6e6'
    });
  }

  run(): void {
    this.loadUrl('updater');
  }

}
