import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { ElectronService as electron } from 'app/core/electron/electron.service';
import { SoundService } from 'app/core/service/sound.service';
import { Logger } from "app/core/electron/logger.helper";

@Component({
    selector: 'component-toolbar',
    templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit {

    public appName: string;
    public platform: string = "win";
    public window: any | Window;
    public isAudioMuted: boolean = false;
    public isFullscreen: boolean = false;

    constructor(
        private soundService: SoundService,
        private applicationService: ApplicationService
    ) {
        this.appName = applicationService.appName;
        this.isAudioMuted = this.soundService.isAudioMuted();
    }

    ngOnInit() {
        switch (electron.getPlatform()) {
            case 'win32':
                Logger.verbose('win');
                this.platform = "win";
                break;
            case 'darwin':
                Logger.verbose('mac');
                this.platform = "mac";
                break;
        }

        this.window = electron.getCurrentWindow();
    }

    public minimizeWindow() {
        this.window.minimize();
    }

    public fullScreenWindow() {
        this.window.setFullScreen(!this.window.isFullScreen());
        this.isFullscreen = this.window.isFullScreen();
    }

    public maximizeWindow() {
        if (this.window.isMaximized()) {
            this.window.restore();
        } else {
            this.window.maximize(true);
        }
    }

    public closeWindow() {
        this.window.close();
    }

    public toggleSound(state: boolean) {
        this.isAudioMuted = state;
        this.soundService.toggleSound(state);
    }

    public newWindow() {
        Application.addWindow();
    }
}
