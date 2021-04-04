import {Component, Injector, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ElectronService as electron, ElectronService} from '@services/electron/electron.service';
import {PromptService} from '@services/prompt.service';
import {SettingsService} from '@services/settings.service';
import {WindowService} from '@services/window.service';
import {OptionWindowService} from '../option.window';
import {IpcRendererService} from "@services/electron/ipcrenderer.service";

interface select {
    name: string;
    value: string;
}

@Component({
    selector: "component-option-general",
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

    public _resolution: string;
    public _language: string;
    public resolutions: select[] = [
        {name: '800x600', value: "800;600"},
        {name: '960x600', value: "960;600"},
        {name: '1280x720', value: "1280;720"},
        {name: '1024x768', value: "1024;768"},
        {name: '1366x768', value: "1366;768"},
        {name: '1440x900', value: "1440;900"},
        {name: '1600x900', value: "1600;900"},
        {name: '1280x1024', value: "1280;1024"},
        {name: '1680x1050', value: "1680;1050"},
        {name: '1920x1080', value: "1920;1080"},
        {name: '2560x1440', value: "2560;1440"}
    ];

    public languages: select[] = [
        {name: 'Français', value: "fr"},
        {name: 'English', value: "en"},
        {name: 'Español', value: "es"},
        {name: 'Italiano', value: "it"},
        {name: 'Polskie', value: "pl"},
        {name: 'Türkçe', value: "tr"}
    ];

    public restartForEarlyDisplayed: boolean = false;

    public windowService: WindowService;

    constructor(
        public option: OptionWindowService,
        private translateService: TranslateService,
        private ipcRendererService: IpcRendererService,
        public settingsService: SettingsService,
        private promptService: PromptService,
        private electronService: ElectronService,
        private injector: Injector,
    ) {
        this.windowService = this.injector.get(WindowService)
    }


    ngOnInit(): void {
        // fixe the two way binding object by this tricks
        this._resolution = this.settingsService.option.general.resolution.x + ';' + this.settingsService.option.general.resolution.y;
        this._language = this.settingsService.language;
    }

    public setResolution($event: any): void {

        const aValue = $event.value.split(';');

        const resolution = {
            x: parseInt(aValue[0]),
            y: parseInt(aValue[1])
        };

        console.log(resolution);

        if (this.settingsService.option.general.resolution != resolution) {

            electron.getCurrentWindow().setSize(parseInt(aValue[0]), parseInt(aValue[1]), true);

            this.promptService.confirm({
                html: this.translateService.instant("app.window.options.general.resolution.confirm-body"),
                timer: 10000
            }).then((result) => {

                if (result.isConfirmed) {

                    this.settingsService.option.general.resolution = resolution;

                } else if (result.isDenied) {

                    const oldX = this.settingsService.option.general.resolution.x;
                    const oldY = this.settingsService.option.general.resolution.y;
                    this._resolution = oldX + ';' + oldY;

                    electron.getCurrentWindow().setSize(parseInt(this.settingsService.option.general.resolution.x), parseInt(this.settingsService.option.general.resolution.y), true);
                }
            });
        }
    }

    public setServerName($event: any): void {
        console.log($event.value);
        this.restartForEarlyDisplayed = true;
    }

    public resetGameFile() {
        this.ipcRendererService.send('reset-game');
    }

    public clearCache() {
        this.ipcRendererService.send('clear-cache');
    }

    public onLanguageChange($event) {
        this.ipcRendererService.send('change-language', $event.value);
    }
}
