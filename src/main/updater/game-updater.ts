import * as log from 'electron-log';
import axios from 'axios';
import { AppStore } from '../app-store';
import { gameVersionSelector } from '../../shared/store/game-version/game-version.reducer';
import { ENV } from '../environnement';
import { DofusManifest } from '../models/dofus-manifest';

export class GameUpdater {
  constructor() {
  }

  async checkForUpdatesAndUpdate(): Promise<void> {

  }

  private async check() {
    log.info('[UPDATE] Check the game version..');
    const currentBuildVersion = AppStore.select(gameVersionSelector).build.version;
    const manifest = this.getManifest();
  }

  private async getManifest(): Promise<any> {
    return axios.get<DofusManifest>(`${ENV.dofusTouch.origin}/${ENV.dofusTouch.manifestPath}`, {
      params: {
        t:  (new Date().getTime())
      }
    })
      .then(response => response.data);
  }

}
