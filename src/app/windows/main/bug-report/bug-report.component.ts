import {Component, NgZone} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-main-bug-report-component',
    templateUrl: './bug-report.component.html',
    styleUrls: ['./bug-report.component.scss']
})
export class BugReportComponent {

    public descriptionEmpty: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<BugReportComponent>,
        private translate: TranslateService,
        private zone: NgZone
    ) { }

    public closeWindow() {
        this.dialogRef.close();
    }

    public send() {
        this.zone.run(() => {
            const description = (<HTMLTextAreaElement>document.getElementById("bug-description")).value;
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
