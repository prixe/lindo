import {Component} from '@angular/core';
import {SettingsService} from '@services/settings.service';
import {ApplicationService} from "@services/electron/application.service";

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
