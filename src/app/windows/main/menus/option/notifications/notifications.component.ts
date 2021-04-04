import {Component} from '@angular/core';
import {SettingsService} from '@services/settings.service';

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

    constructor(
        public settingsService: SettingsService
    ) { }
}
