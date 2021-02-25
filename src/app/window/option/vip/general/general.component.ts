import { Component } from '@angular/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { SettingsService } from 'app/core/service/settings.service';

@Component({
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss']
})
export class GeneralComponent {

    constructor(
        public settingsService: SettingsService,
        public applicationService: ApplicationService
    ) { }

}
