import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService as electron } from 'app/core/electron/electron.service';
import { Logger } from "app/core/electron/logger.helper";
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'component-bug-report',
    templateUrl: './bug-report.component.html',
    styleUrls: ['./bug-report.component.scss']
})
export class BugReportComponent implements OnInit, OnDestroy {

    public informations: string;
    public descriptionEmpty: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<BugReportComponent>,
        private translate: TranslateService,
        private zone: NgZone
    ) { }

    ngOnInit() {
        this.translate.get('app.window.update-dofus.information.search').subscribe((res: string) => {
            this.informations = res;
        });
    }

    ngOnDestroy() {
    }

    public closeWindow() {
        this.dialogRef.close();
    }

    public send() {
        this.zone.run(() => {
            let description = (<HTMLTextAreaElement>document.getElementById("bug-description")).value;
            if (description) {
                this.descriptionEmpty = false;
                this.dialogRef.close(description);
            }
            else {
                this.descriptionEmpty = true;
            }
        });
    }
}
