import {autoUpdater} from 'electron-updater';
import {app} from 'electron';
import {EUpdateType, UpdateWindow} from './update-window';

export class Updater {
  constructor() {
  }

  async checkForUpdatesAndUpdate(): Promise<void> {
    await this.updateApp();
  }

  private async updateApp() {
    const result = await autoUpdater.checkForUpdates();
    if (result.updateInfo.version !== app.getVersion()) {
      console.log('update require');
      const windowAppUpdate = new UpdateWindow(EUpdateType.Application);
      windowAppUpdate.run();
    }
  }

}
