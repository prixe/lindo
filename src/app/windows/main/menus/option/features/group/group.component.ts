import {Component} from '@angular/core';
import {SettingsService} from '@services/settings.service';
import {ApplicationService} from "@services/electron/application.service";

@Component({
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent {

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

        const index = this.groupMembers.findIndex((element) => {
            return element = value;
        });

        if (index != -1) {
            this.groupMembers.splice(index, 1);
        }

        this.settingsService.option.vip.autogroup.members = this.groupMembers.join(";");
    }
}