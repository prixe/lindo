import {Component} from '@angular/core';
import {SettingsService} from '@services/settings.service';

@Component({
    templateUrl: './mod.component.html',
    styleUrls: ['./mod.component.scss']
})
export class ShortcutsModComponent {

    constructor(
        public settingsService: SettingsService
    ) {}

    public range(start: number, end: number): Array<number> {
        let arr = [];

        for(let i = start; i <= end; i++)
            arr.push(i);

        return arr;
    }

}
