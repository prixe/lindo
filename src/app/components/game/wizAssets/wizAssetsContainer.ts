import { WizAssets } from './wizAssets';
import { ApplicationService } from 'app/core/electron/application.service';
import { Option } from 'app/core/service/settings.service';
import { Logger } from "app/core/electron/logger.helper";
import { HttpClient } from '@angular/common/http';

export class WizAssetsContainer {

    private wGame: any | Window;

    constructor(wGame: any | Window, applicationService: ApplicationService, http: HttpClient, general: Option.General) {

        this.wGame = wGame;

        function escapeRegExp(str: string) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
        }

        function replaceAll(str: string, find: string, replace: string) {
            return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }

        if (general.local_content) {
            Logger.info('- wizAssets enable');
            let cachePath = Application.userDataPath + '/wizCache';

            cachePath = replaceAll(cachePath, '\\', '/');

            this.wGame.wizAssets = new WizAssets(cachePath, http);
        }
    }
}