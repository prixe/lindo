import {screen} from 'electron';
import {GenericWindow} from './generic-window';

export class MainWindow extends GenericWindow {


  constructor() {
    const {height, width} = screen.getPrimaryDisplay().workAreaSize;
    super({
      width,
      height,
      center: true,
      webPreferences: {
        nodeIntegration: true
      }
    });
  }

  run(): void {
    this.loadUrl('');
  }

}
