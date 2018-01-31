import { SettingsProvider } from './settings.provider';
import { IpcRendererService } from '../electron/ipcrenderer.service';
import { WindowService } from '../service/window.service';
import { SettingsDefault } from '../../../../electron/settings/settings-default';

export class SettingsProviderLocal implements SettingsProvider {

    private window: Window;

    constructor(window: WindowService) {
        this.window = window.window;

        if (!this.window.localStorage.getItem('isConfig')) {
            let getPathValue = (obj: Object, prefix?: string) => {

                let vals = {};
                prefix = prefix ? prefix + '.' : '';

                for (let key in obj) {
                    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                        vals = Object.assign(vals, getPathValue(obj[key], prefix + key));
                    } else {
                        vals[prefix + key] = obj[key];
                    }
                }
                return vals;
            };

            const settings = getPathValue(SettingsDefault);

            for (let key in settings) {
                this.write(key, settings[key]);
            }
        }
    }

    write(key: string, value: string): void {
        value = JSON.stringify(value);
        this.window.localStorage.setItem(key, value);
    }

    read<T>(key: string): T {
        let value: any = this.window.localStorage.getItem(key);
        value = JSON.parse(value);

        return <T>(value);
    }
}