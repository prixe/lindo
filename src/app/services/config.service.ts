import {Injectable} from '@angular/core';
import {IpcRendererService} from './electron/ipcrenderer.service';
import {EventEmitter} from 'eventemitter3';

type Param = 'language'
    | 'buildVersion'
    | 'appVersion'
    | 'alertCounter'
    | 'last_news'
    | 'appPreferences'
    | 'option'
    /* GENERAL */
    | 'option.general'
    | 'option.general.hidden_shop'
    | 'option.general.stay_connected'
    | 'option.general.resolution'
    | 'option.general.resolution.x'
    | 'option.general.resolution.y'
    | 'option.general.local_content'
    | 'option.general.sound_focus'
    | 'option.general.early';

@Injectable()
// @ts-ignore
export class ConfigService extends EventEmitter {
    public get(param: Param): any {
        return this.ipcRendererService.sendSync('read-settings', param);
    }

    public set(param: Param, value: any): void {
        this.ipcRendererService.sendSync('write-settings', param, value);
    }

    constructor(private ipcRendererService: IpcRendererService) {
        super();
        this.ipcRendererService.on('reload-settings', () => {
            this.emit('reload');
        });
    }
}
