import {Component} from '@angular/core';
import {ApplicationService} from 'app/services/electron/application.service';
import {ElectronService as electron} from 'app/services/electron/electron.service';
import {environment} from "../../../../environments/environment";

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

    public version: string;
    public environment = environment;

    constructor(public applicationService: ApplicationService) {
        this.version = this.applicationService.version;
    }

    public goToWebsite($event: any) {
        $event.preventDefault();
        electron.openExternal(environment.websiteUrl);
    }

    public gotToProject($event: any) {
        $event.preventDefault();
        electron.openExternal(environment.websiteUrl);
    }
}
