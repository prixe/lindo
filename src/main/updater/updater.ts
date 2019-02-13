import {autoUpdater} from 'electron-updater';

export class Updater {
  constructor() {
  }

  async checkForUpdatesAndUpdate(): Promise<void> {
    const result = await autoUpdater.checkForUpdates();
    console.log('infof', result);
  }

  updateApp() {

  }

}
