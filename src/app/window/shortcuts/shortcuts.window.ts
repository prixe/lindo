import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ShortcutsComponent } from 'app/window/shortcuts/shortcuts.component';

@Injectable()
export class ShortcutsWindowService {

    private dialogRef: MatDialogRef<ShortcutsComponent>;

    constructor(
        private dialog: MatDialog,
        private router: Router
    ) { }

    public open() {

        this.dialogRef = this.dialog.open(ShortcutsComponent, {
            width: '820px',
            height: '630px'
        });

        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
            Settings.reloadSettings();
        });

    }

    public close() {
        this.dialogRef.close();
    }
}