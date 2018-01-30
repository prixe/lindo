import { Component, Injector } from '@angular/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { ElectronService as electron } from 'app/core/electron/electron.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

    public version: string;

    constructor(
        public applicationService: ApplicationService,
        private ipcRendererService: IpcRendererService,
        private injector: Injector
    ) {
        this.version = this.applicationService.version;
    }

    public goToWebsite($event: any) {
        $event.preventDefault();
        electron.openExternal(this.applicationService.websiteUrl);
    }

    public gotToProject($event: any) {
        $event.preventDefault();
        electron.openExternal(this.applicationService.websiteUrl);
    }
}
