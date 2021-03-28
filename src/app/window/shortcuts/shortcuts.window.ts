import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ShortcutsComponent} from 'app/window/shortcuts/shortcuts.component';
import {IpcRendererService} from "../../core/electron/ipcrenderer.service";

@Injectable()
export class ShortcutsWindowService {

    private dialogRef: MatDialogRef<ShortcutsComponent>;

    constructor(
        private dialog: MatDialog,
        private ipcRendererService: IpcRendererService
    ) {
    }

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
        this.ipcRendererService.send("change-shortcuts");
        this.dialogRef.close();
    }
}