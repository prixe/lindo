import {AfterViewInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {SettingsService} from '@services/settings.service';
import {MatDialogRef} from '@angular/material/dialog';

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
        void this.router.navigate(["/shortcuts/application"]);
    }

    public selectRoute($event: any, route: string): void {

        const old = document.querySelector(".tab-bar-item.selected");
        if (old !== null) {
            old.classList.remove("selected");
        }

        $event.target.classList.add("selected");

        this.navigateTo(route);
    }

    public navigateTo(route: string) {
        void this.router.navigate(["/shortcuts/" + route]);
    }
}
