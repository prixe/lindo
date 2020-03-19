import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { Logger } from 'app/core/electron/logger.helper';
import { PromptService } from 'app/core/service/prompt.service';
import { ChangelogWindowService } from '../changelog/changelog.window';
import { MatDialogRef } from '@angular/material/dialog';
import { SettingsService } from 'app/core/service/settings.service';

@Component({
    selector: 'component-options',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent {
    constructor(
        public dialogRef: MatDialogRef<OptionComponent>,
        public changelog: ChangelogWindowService,
        private translateService: TranslateService,
        public applicationService: ApplicationService,
        private ipcRendererService: IpcRendererService,
        private promptService: PromptService,
        private router: Router,
        public settingsService: SettingsService,
    ) {
        this.router.navigate(['/option/general']);
    }


    public validate() {
        Logger.verbose('emit->valite-option');
        this.ipcRendererService.send('validate-option');
    }

    public reset() {
        this.promptService.confirm({
            title: this.translateService.instant('app.prompt.title.confirm'),
            html: this.translateService.instant('app.option.prompt.reset-option.text'),
            type: 'warning',
            target: 'component-options'
        }).then(() => {
            Settings.resetSettings();
        }, (dismiss) => {});
    }

    public navigateTo($event: any, route: string) {

        let old = document.querySelector('component-options .tab-bar-item.selected');
        if (old !== null) {
            old.classList.remove('selected');
        }

        let target = $event.target.classList.add('selected');

        this.router.navigate([route]);
    }

}
