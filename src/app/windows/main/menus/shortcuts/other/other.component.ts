import {Component} from '@angular/core';
import {SettingsService} from '@services/settings.service';

@Component({
    templateUrl: './other.component.html',
    styleUrls: ['./other.component.scss']
})
export class ShortcutsOtherComponent {

    constructor(
        public settingsService: SettingsService
    ) {}

    public range(start: number, end: number): Array<number> {
        const arr = [];

        for(let i = start; i <= end; i++)
            arr.push(i);

        return arr;
    }

}
