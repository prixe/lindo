import { Mods } from "../mods";
import { TranslateService } from "@ngx-translate/core";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";

export class Jobsxp extends Mods{
    private xpRestanteText : HTMLDivElement;

    constructor(
        wGame: any,
        private params: Option.VIP.General,
        private translate: TranslateService
    ) {
        super(wGame);

        if (this.params.jobsxp) {
            Logger.info('- enable jobsxp');
            let jobsxpbarCssverif = this.wGame.document.getElementById('jobsxpbarCss');
            let xpRestanteIdverif = this.wGame.document.getElementById('xpRestanteId');
            if (jobsxpbarCssverif && jobsxpbarCssverif.parentElement) {
                jobsxpbarCssverif.parentElement.removeChild(jobsxpbarCssverif);
            }
            if (xpRestanteIdverif && xpRestanteIdverif.parentElement) {
                xpRestanteIdverif.parentElement.removeChild(xpRestanteIdverif);
            }

            let jobsxpbarCss = document.createElement('style');
            jobsxpbarCss.id = 'jobsxpbarCss';
            jobsxpbarCss.innerHTML = `
            .xpRestanteText {
                opacity = 0.6;
                box-sizing: border-box;
                border: 1.5px #232323 solid;
                border-radius: 3px;
                overflow: hidden;
                background-color: #333;
                font-size: 11px;
                position: absolute;
                color: white;
                width: 150px;
                margin-right: 10px;
                margin-top: 10px;
                text-align: center;
                text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.9);
                right: 10px;
            }`;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(jobsxpbarCss);

            setTimeout(() => {
                this.create();
            }, 5000);
            this.updateJob();
            this.setFightStart()
            this.stopOnFightEnd()
            this.stopOnFightStop()
        }
    }

    private create(): void {
        setTimeout(() => {
            this.clean();
            this.xpRestanteText = document.createElement('div');
            this.xpRestanteText.id = 'xpRestanteId';
            this.xpRestanteText.className = 'xpRestanteText';
            this.xpRestanteText.style.visibility = 'visible';
            let jobs = this.wGame.gui.playerData.jobs.list;
            this.xpRestanteText.innerHTML = '';
            for (var id in jobs) {
                let job = this.wGame.gui.playerData.jobs.list[id];
                if (job.experience.jobXpNextLevelFloor) {
                    let xpToWin = job.experience.jobXpNextLevelFloor - job.experience.jobXP;
                    this.xpRestanteText.innerHTML += "<br>" + "<div style=\"color:  #2196f3; font-size: 20px\" >"+ job.info.nameId + " </div>"+ xpToWin + this.translate.instant('app.option.vip.jobsxp.text') + (job.experience.jobLevel + 1 + "</br>") + "<br>";
                }
            }
            if (this.xpRestanteText.innerHTML != '') {
                this.wGame.foreground.rootElement.appendChild(this.xpRestanteText);
            }
        }, 500);
    }

    private setFightStart(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', (e: any) => {
            try {
                this.clean();
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private stopOnFightEnd(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', (e: any) => {
            try {
                this.create();
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private stopOnFightStop(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage', (e: any) => {
            try {
                this.create();
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private clean(): void {
        if (this.xpRestanteText && this.xpRestanteText.parentElement) {
            this.xpRestanteText.style.visibility = '';
            this.xpRestanteText.innerHTML = '';
            this.xpRestanteText.parentElement.removeChild(this.xpRestanteText);
        }
    }

    private updateJob(): void {
        this.on(this.wGame.gui, 'JobExperienceUpdateMessage', (e: any) => {
            try {
                if (e.experiencesUpdate.jobXpNextLevelFloor) {
                    this.create();
                }
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    public reset() {
        super.reset();
        if (!this.params.jobsxp) {
            let jobsxpbarCss = this.wGame.document.getElementById('jobsxpbarCss');
            if (jobsxpbarCss && jobsxpbarCss.parentElement) {
                jobsxpbarCss.parentElement.removeChild(jobsxpbarCss);
            }
            if (this.xpRestanteText && this.xpRestanteText.parentElement) {
                this.xpRestanteText.parentElement.removeChild(this.xpRestanteText);
            }
        }
    }

}
