import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService as electron } from 'app/core/electron/electron.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { Subscription } from 'rxjs';
import { Logger } from "app/core/electron/logger.helper";

const progress = requestProgressLib;
const request = requestLib;
const fs = fsLib;

@Component({
    selector: 'component-game-update',
    templateUrl: './game-update.component.html',
    styleUrls: ['./game-update.component.scss']
})
export class GameUpdateComponent implements OnInit, OnDestroy {

    public progressMode: string = "indeterminate";
    public progressValue: number = 0;
    private savePath: string;
    private saveFile: any;
    private remoteUrl: string;
    public informations: string;
    private sub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private translate: TranslateService,
        private zone: NgZone,
        private ipcRendererService: IpcRendererService
    ) { }

    ngOnInit() {

        this.translate.get('app.window.update-dofus.information.start').subscribe((res: string) => {
            this.informations = res;
        });

        this.sub = this.route.params.subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.savePath = decodeURIComponent(params['savePath']);
            this.remoteUrl = decodeURIComponent(params['remoteUrl']);

            this.saveFile = fs.createWriteStream(this.savePath);

            this.download();
        });

        this.saveFile.addListener('finish', () => {
            this.zone.run(() => {
                this.install();
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    download() {

        Logger.info(this.remoteUrl);

        progress(request(this.remoteUrl), {
            rejectUnauthorized : false,
            strictSSL : false
        })
            .on('progress', (state: any) => {

                this.progressMode = "determinate";

                this.zone.run(() => {
                    this.progressValue = Math.round(state.percent * 100);
                    this.informations = this.formatUnit(state.size.transferred) + ' / ' + this.formatUnit(state.size.total);
                });
            })
            .on('error', (err: any) => {
                Logger.error(err);
                this.zone.run(() => {
                    this.translate.get('app.window.update-dofus.information.error').subscribe((res: string) => {
                        this.informations = res;
                    });
                });
            })
            .on('end', () => {
                this.zone.run(() => {
                    this.progressValue = 100;
                });
            })
            .pipe(this.saveFile);
    }

    install() {

        this.translate.get('app.window.update-dofus.information.install').subscribe((res: string) => {
            this.informations = res;
        });

        this.progressMode = "query";

        this.ipcRendererService.send('install-update');
    }

    formatUnit(count: number): string {
        if (count >= 1000000) {
            return (Math.round((count / 1000000) * 100) / 100) + ' Mb';
        }
        else if (count >= 1000) {
            return (Math.round((count / 1000) * 100) / 100) + ' Kb';
        }
        else {
            return (Math.round(count * 100) / 100) + ' B';
        }
    }

    public closeWindow() {
        electron.close();
    }
}
