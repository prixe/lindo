import { ShortcutsWindowService } from '../shortcuts/shortcuts.window';
import { Injectable, Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { OptionComponent } from 'app/window/option/option.component';
import { ShortcutsComponent } from "app/window/shortcuts/shortcuts.component";

@Injectable()
export class OptionWindowService {

    private dialogRef: MatDialogRef<any>;

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private shortcutsWindowService: ShortcutsWindowService
    ) { }

    public open() {

        this.dialogRef = this.dialog.open(OptionComponent, {
            width: '820px',
            height: '600px'
        });

        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
            this.router.navigate(['/option']);
            Settings.reloadSettings();
        });

    }

    public close() {
        this.dialogRef.close();
    }

    public closeAndOpenShortcuts() {

        this.dialogRef.afterClosed().subscribe(result => {
            this.shortcutsWindowService.open();
        });

        this.dialogRef.close();
    }

    public openShortcuts() {
        this.dialogRef.componentInstance = ShortcutsComponent;
    }
}