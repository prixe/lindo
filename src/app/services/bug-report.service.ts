import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Logger} from './logger.helper';
import {BugReportComponent} from '../windows/main/bug-report/bug-report.component';
import {ApplicationService} from './electron/application.service';
import axios from 'axios';

const os = osLib;

@Injectable()
export class BugReportService {
    private logs = "";
    private dialogRef: MatDialogRef<any>;

    constructor(
        private dialog: MatDialog,
        private applicationService: ApplicationService,
    ) {}

    public writeLog(from, msg) {
        this.logs += (new Date()).toISOString() + "\n" + from + "\n" + msg + "\n\n";
        // this.send("Auto send");
    }

    public send(description) {
        const body = this.getOs() + "\n" + description + "\n\n" + this.logs;
        axios.post('https://api.lindo-app.com/report.php', {
            logs: body,
            version: this.applicationService.version
        }).then(() => {
            this.logs = "";
        }).catch(error => {
            Logger.error(JSON.stringify(error));
        });
    }

    public open() {
        this.dialogRef = this.dialog.open(BugReportComponent, {
            width: '820px',
            height: '600px'
        });

        this.dialogRef.afterClosed().subscribe(description => {
            if (description) {
                this.send(description);
            }
        });
    }

    private getOs() {
        switch (os.platform()) {
            case 'linux':
            return os.type() + " " + os.release();
            case 'win32':
            return BugReportService.getWindowsRelease();
            case 'darwin':
            return BugReportService.getMacOsRelease();
            default:
            return os.type() + " " + os.release();
        }
    }


    /**
    * https://github.com/sindresorhus/macos-release
    **/
    private static getMacOsRelease() {
        const names = new Map([
            [19, 'Catalina'],
            [18, 'Mojave'],
            [17, 'High Sierra'],
            [16, 'Sierra'],
            [15, 'El Capitan'],
            [14, 'Yosemite'],
            [13, 'Mavericks'],
            [12, 'Mountain Lion'],
            [11, 'Lion'],
            [10, 'Snow Leopard'],
            [9, 'Leopard'],
            [8, 'Tiger'],
            [7, 'Panther'],
            [6, 'Jaguar'],
            [5, 'Puma']
        ]);

        const release = Number(os.release().split('.')[0]);

        return "MacOs " + names.get(release);
    }

    /**
    * https://github.com/sindresorhus/windows-release
    **/
    private static getWindowsRelease() {
        const names = new Map([
            ['10.0', '10'],
            ['6.3', '8.1'],
            ['6.2', '8'],
            ['6.1', '7'],
            ['6.0', 'Vista'],
            ['5.2', 'Server 2003'],
            ['5.1', 'XP'],
            ['5.0', '2000'],
            ['4.9', 'ME'],
            ['4.1', '98'],
            ['4.0', '95']
        ]);
        const version = /\d+\.\d/.exec(os.release());
        const ver = (version || [])[0];

        return "Windows " + names.get(ver);
    }

}
