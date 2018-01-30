import { Component } from '@angular/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { SettingsService } from 'app/core/service/settings.service';

@Component({
    templateUrl: './auto-group.component.html',
    styleUrls: ['./auto-group.component.scss']
})
export class AutoGroupComponent {

    public groupMembers: string[] = [];

    constructor(
        public settingsService: SettingsService,
        public applicationService: ApplicationService
    ) {

        settingsService.option.vip.autogroup.leader;

        if (settingsService.option.vip.autogroup.members !== null && settingsService.option.vip.autogroup.members !== '') {
            this.groupMembers = this.settingsService.option.vip.autogroup.members.split(';');
        }
    }

    onAddMemberList(value: any) {

        if (value !== undefined) {
            this.groupMembers.push(value.value);
            this.settingsService.option.vip.autogroup.members = this.groupMembers.join(";");
        }
    }

    onRemoveMemberList(value: any) {

        let index = this.groupMembers.findIndex((element) => {
            return element = value;
        });

        if (index != -1) {
            this.groupMembers.splice(index, 1);
        }

        this.settingsService.option.vip.autogroup.members = this.groupMembers.join(";");
    }
}