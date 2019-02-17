import * as log from 'electron-log';
import axios from 'axios';
import { AppStore } from '../app-store';
import { gameVersionSelector } from '../../shared/store/game-version/game-version.reducer';
import { ENV } from '../environnement';
import { DofusManifest } from '../models/dofus-manifest';
import { ItunesResponse } from '../models/itunes-app';
import { setAppVersion } from '../../shared/store/game-version/game-version.action';

export class GameUpdater {
  constructor() {
  }

  async checkForUpdatesAndUpdate(): Promise<void> {
    await this.updateAppVersion();
    await this.check();
  }

  private async updateAppVersion(): Promise<void> {
    const itunesAppVersion = await axios.get<ItunesResponse>(`${ENV.itunesUrl}/lookup`, {
      params: {
        id: ENV.dofusTouch.itunesAppId,
        t: (new Date().getTime())
      }
    })
      .then(response => response.data.results[ 0 ].version)
      .catch(() => {
        log.error('[UPDATE] unable to fetch the appVersion from itunes');

        return undefined;
      });
    const currentAppVersion = AppStore.select(gameVersionSelector).appVersion;
    if (itunesAppVersion && currentAppVersion !== itunesAppVersion) {
      AppStore.dispatch(setAppVersion(itunesAppVersion));
    }
  }

  private async check() {
    log.info('[UPDATE] Check the game version..');
    const currentHashVersion = AppStore.select(gameVersionSelector).build.hash;
    const manifest = await this.getManifest();
  }

  private async getManifest(): Promise<any> {
    return axios.get<DofusManifest>(`${ENV.dofusTouch.origin}/${ENV.dofusTouch.manifestPath}`, {
      params: {
        t: (new Date().getTime())
      }
    })
      .then(response => response.data);
  }

}
