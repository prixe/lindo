import {autoUpdater} from 'electron-updater';
import {app} from 'electron';
import {EUpdateType, UpdateWindow} from './update-window';
import { GameUpdater } from './game-updater';

export class Updater {
  constructor() {
  }

  async checkForUpdatesAndUpdate(): Promise<void> {
    await this.updateApp();
    await this.updateGame();
  }

  private async updateApp() {
    const result = await autoUpdater.checkForUpdates();
    if (result.updateInfo.version !== app.getVersion()) {
      console.log('update require');
      const windowAppUpdate = new UpdateWindow(EUpdateType.Application);
      windowAppUpdate.run();
    }
  }

  private async updateGame(): Promise<void> {
    const gameUpdater = new GameUpdater();
    await gameUpdater.checkForUpdatesAndUpdate();
  }

}
