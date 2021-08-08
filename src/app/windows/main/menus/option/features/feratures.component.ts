import {AfterViewInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {PromptService} from '@services/prompt.service';
import {SettingsService} from '@services/settings.service';
import {ApplicationService} from "@services/electron/application.service";

@Component({
    templateUrl: './feratures.component.html',
    styleUrls: ['./feratures.component.scss']
})
export class FeraturesComponent implements AfterViewInit {

    public rlaSafe: boolean = false;

    constructor(
        private settingsService: SettingsService,
        private applicationService: ApplicationService,
        private translate: TranslateService,
        private promptService: PromptService,
        private router : Router
    ) { }

    public ngAfterViewInit(): void {
        this.rlaSafe = true;
        void this.router.navigate(['/option/features', { outlets: { 'featuresOutlet': ["general"] } }]);
    }
}
