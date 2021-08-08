import {Component, OnInit} from '@angular/core';
import {SoundService} from '@services/sound.service';
import {ApplicationService} from "@services/electron/application.service";
import {ElectronService as electron} from '@services/electron/electron.service';

@Component({
    selector: 'app-main-toolbar-component',
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
