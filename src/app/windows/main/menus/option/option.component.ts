import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {PromptService} from '@services/prompt.service';
import {ChangelogWindowService} from '../changelog/changelog.window';
import {MatDialogRef} from '@angular/material/dialog';
import {SettingsService} from '@services/settings.service';
import {ApplicationService} from "@services/electron/application.service";
import {IpcRendererService} from "@services/electron/ipcrenderer.service";

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
        void this.router.navigate(['/option/general']);
    }


    public validate() {
        Logger.verbose('emit->valite-option');
        this.ipcRendererService.send('validate-option');
    }

    public reset() {
        void this.promptService.confirm({
            title: this.translateService.instant('app.prompt.title.confirm'),
            html: this.translateService.instant('app.option.prompt.reset-option.text'),
            icon: 'warning'
        }).then((result) => {
            if (result.isConfirmed) Settings.resetSettings();
        });
    }
}
