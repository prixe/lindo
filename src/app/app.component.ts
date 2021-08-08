import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IpcRendererService} from 'app/services/electron/ipcrenderer.service';
import {Logger} from 'app/services/logger.helper';
import {SettingsService} from '@services/settings.service';
import {SoundService} from '@services/sound.service';

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

    constructor(private translate: TranslateService, private settingsService: SettingsService, private ipcRendererService: IpcRendererService, private soundService: SoundService,) {
    }

    ngOnInit(): void {

        this.translate.addLangs(["en", "fr", "es", "it", "pl", "tr"]);

        this.translate.setDefaultLang(this.settingsService.language);
        this.translate.use(this.settingsService.language);

        this.ipcRendererService.on('reload-settings-done', () => {
            Logger.info('receive->reload-settings-done');
            this.translate.use(this.settingsService.language);
        });
    }

    ngAfterViewInit(): void {
        const loading = window.document.getElementById("loading");
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.remove();
        }, 500);
    }
}
