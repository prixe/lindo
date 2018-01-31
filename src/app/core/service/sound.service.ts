import { Injectable } from '@angular/core';
import { ElectronService as electron } from 'app/core/electron/electron.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { SettingsService } from 'app/core/service/settings.service';
import { WindowService } from 'app/core/service/window.service';

@Injectable()
export class SoundService {

    private window: any;
    private events: Array<any> = [];
    private isAudioMuted: boolean = false;

    constructor(private ipcRendererService: IpcRendererService,
                private settingsService: SettingsService,
                private windowService: WindowService) {
        if(isElectron){
            this.ipcRendererService.on('reload-settings', () => {
                this.listenFocusAndBlur()
            });

            this.window = electron.getCurrentWindow();
            this.isAudioMuted = this.window.webContents.isAudioMuted();

            window.onbeforeunload = () => {
                this.window.removeAllListeners();
            };

            this.listenFocusAndBlur()
        }
    }


    private listenFocusAndBlur() {

        this.events.forEach(event => {
            event();
        });

        if (this.settingsService.option.general.sound_focus) {

            this.window.webContents.setAudioMuted(false);

            let onFocus = () => {
                (!this.isAudioMuted) ? this.window.webContents.setAudioMuted(false) : false;
            };

            let onBlur = () => {
                (!this.isAudioMuted) ? this.window.webContents.setAudioMuted(true) : false;
            };

            this.window.on("focus", onFocus);
            this.window.on("blur", onBlur);

            this.events.push(() => {
                this.window.removeListener("focus", onFocus);
                this.window.removeListener("blur", onBlur);
            });

        }
    }

    public toggleSound(state: boolean) {
        this.window.webContents.setAudioMuted(state);
        this.isAudioMuted = this.window.webContents.isAudioMuted();
    }

}
