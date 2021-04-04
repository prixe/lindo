import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ChangeLogComponent} from "./changelog.component";

@Injectable()
export class ChangelogWindowService {

    private dialogRef: MatDialogRef<ChangeLogComponent>;

    constructor(
        private dialog: MatDialog
    ) { }

    public open($event : any) {

        $event.preventDefault();
        $event.stopPropagation();

        this.dialogRef = this.dialog.open(ChangeLogComponent, {
            width: '860px',
            height: '600px',
        });
    }

    public close() {
        this.dialogRef.close();
    }
}