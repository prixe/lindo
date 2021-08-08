import {Component} from '@angular/core';
import {SettingsService} from '@services/settings.service';

@Component({
    templateUrl: './interface.component.html',
    styleUrls: ['./interface.component.scss']
})
export class ShortcutsInterfaceComponent {

    constructor(
        public settingsService: SettingsService
    ) { }

    public range(start: number, end: number): Array<number> {

        const arr = [];

        for (let i = start; i <= end; i++)
            arr.push(i);

        return arr;
    }

}
