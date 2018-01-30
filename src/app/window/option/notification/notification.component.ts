import { Component } from '@angular/core';
import { SettingsService } from 'app/core/service/settings.service';

@Component({
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

    constructor(
        public settingsService: SettingsService
    ) { }
}
