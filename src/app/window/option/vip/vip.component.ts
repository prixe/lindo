import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { PromptService } from 'app/core/service/prompt.service';
import { SettingsService } from 'app/core/service/settings.service';

@Component({
    templateUrl: './vip.component.html',
    styleUrls: ['./vip.component.scss']
})
export class VipComponent implements AfterViewInit {

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
        this.router.navigate(['/option/features', { outlets: { 'featuresOutlet': ["general"] } }]);
    }
}
