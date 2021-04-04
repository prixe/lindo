import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {OptionComponent} from "./option.component";
import {ShortcutsComponent} from "../shortcuts/shortcuts.component";
import {ShortcutsWindowService} from "../shortcuts/shortcuts.window";

@Injectable()
export class OptionWindowService {

    private dialogRef: MatDialogRef<any>;

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private shortcutsWindowService: ShortcutsWindowService
    ) {
    }

    public open(): void {

        this.dialogRef = this.dialog.open(OptionComponent, {
            width: '820px',
            height: '600px'
        });

        this.dialogRef.afterClosed().subscribe(() => {

            Settings.reloadSettings();

            this.dialogRef = null;
            void this.router.navigate(['/option']);
        });

    }

    public close(): void {
        this.dialogRef.close();
    }

    public closeAndOpenShortcuts(): void {

        this.dialogRef.afterClosed().subscribe(() => {
            this.shortcutsWindowService.open();
        });

        this.dialogRef.close();
    }

    public openShortcuts(): void {
        this.dialogRef.componentInstance = ShortcutsComponent;
    }
}