import {IpcRendererService} from '@services/electron/ipcrenderer.service';
import {SettingsProvider} from "@interfaces/setting-provider";

export class SettingsProviderIpc implements SettingsProvider {

    private ipcRendererService: IpcRendererService;

    constructor(ipcRendererService: IpcRendererService) {
        this.ipcRendererService = ipcRendererService;
    }

    write(key: string, value: string): void {
        this.ipcRendererService.send('write-settings', key, value);
    }

    read<T>(key: string): T {
        return this.ipcRendererService.sendSync('read-settings', key);
    }
}