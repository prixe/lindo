import {Component} from '@angular/core';
import {ElectronService as electron} from '@services/electron/electron.service';
import {environment} from "@env/environment";
import {ApplicationService} from "@services/electron/application.service";

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
