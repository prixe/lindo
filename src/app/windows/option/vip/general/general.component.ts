import {Component} from '@angular/core';
import {ApplicationService} from 'app/services/electron/application.service';
import {SettingsService} from '@services/settings.service';

@Component({
    templateUrl: './general.component.html'
})
export class GeneralComponent {

    constructor(
        public settingsService: SettingsService,
        public applicationService: ApplicationService
    ) { }

}
