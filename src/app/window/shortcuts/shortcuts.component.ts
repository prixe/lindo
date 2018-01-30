import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from 'app/core/service/settings.service';
import { ShortcutsWindowService } from './shortcuts.window';
import { MatDialogRef } from '@angular/material';

@Component({
    templateUrl: './shortcuts.component.html',
    styleUrls: ['./shortcuts.component.scss']
})
export class ShortcutsComponent implements AfterViewInit {

    constructor(
        public dialogRef: MatDialogRef<ShortcutsComponent>,
        private settingsService: SettingsService,
        private router: Router,
    ) {
    }

    public ngAfterViewInit(): void {
        this.router.navigate(["/shortcuts/application"]);
    }

    public selectRoute($event: any, route: string): void {

        let old = document.querySelector(".tab-bar-item.selected");
        if (old !== null) {
            old.classList.remove("selected");
        }
        let target = $event.target.classList.add("selected");

        this.navigateTo(route);
    }

    public navigateTo(route: string) {
        this.router.navigate(["/shortcuts/" + route]);
    }
}
