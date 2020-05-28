import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { Logger } from 'app/core/electron/logger.helper';
import { SettingsService } from 'app/core/service/settings.service';
import { SoundService } from 'app/core/service/sound.service';

@Component({
  selector: 'component-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private ipcRendererService: IpcRendererService,
    private soundService: SoundService,
  ) { }

  ngOnInit() {

    this.translate.addLangs(["en", "fr", "es", "it", "pl", "tr"]);
    this.translate.setDefaultLang(this.settingsService.language);

    if(isElectron) {
        this.ipcRendererService.on('reload-settings-done', () => {
            Logger.info('receive->reload-settings-done');
            this.translate.use(this.settingsService.language);
        });
    }

  }

  ngAfterViewInit() {
    let loading = window.document.getElementById("loading");
    loading.style.opacity = '0';
    setTimeout(function () {
      loading.remove();
    }, 500);
  }
}
