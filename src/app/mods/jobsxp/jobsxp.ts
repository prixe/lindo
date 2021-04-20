import {Mod} from "../mod";

export class Jobsxp extends Mod{
    private xpRestanteText : HTMLDivElement;

    startMod(): void {
        this.params = this.settings.option.vip.general.jobsxp;

        if (this.params) {
            Logger.info('- enable Jobsxp');
            const jobsxpbarCssverif = this.wGame.document.getElementById('jobsxpbarCss');
            const xpRestanteIdverif = this.wGame.document.getElementById('xpRestanteId');
            if (jobsxpbarCssverif && jobsxpbarCssverif.parentElement) {
                jobsxpbarCssverif.parentElement.removeChild(jobsxpbarCssverif);
            }
            if (xpRestanteIdverif && xpRestanteIdverif.parentElement) {
                xpRestanteIdverif.parentElement.removeChild(xpRestanteIdverif);
            }

            const jobsxpbarCss = document.createElement('style');
            jobsxpbarCss.id = 'jobsxpbarCss';
            jobsxpbarCss.innerHTML = `
            .xpRestanteText {
                box-sizing: border-box;
                overflow: hidden;
                font-size: 11px;
                position: absolute;
                color: white;
                margin-right: 10px;
                margin-top: 10px;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.9);
                right: 10px;
                pointer-events: none;
                padding: 5px 16px;
            }

            .xpRestanteText::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-image-source: url(./assets/ui/container.png);
                border-image-slice: 63;
                border-image-width: 37px;
                border-radius: 10px;
                border-style: solid;
                background-color: #2e2d28;
                z-index: -1;
                box-sizing: border-box;
                opacity: 0.8;
            }

            .xpRestanteText .job {
                display: flex;
                margin: 8px;
                align-items: center;
            }

            .xpRestanteText img {
                flex-grow: 0;
                flex-shrink: 0;
                width: 50px;
                height: 50px;
                margin-left: 10px;
            }

            .xpRestanteText .description {
                flex-grow: 1;
                width: 120px;
                text-align: right;
            }

            .xpRestanteText .name {
                font-family: berlin_sans_fb_demibold;
                font-size: 1.6em;
                color: #ced0bb;
                text-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
            }


            `;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(jobsxpbarCss);

            this.create();
            this.updateJob();
            this.setFightStart()
            this.stopOnFightEnd()
            this.stopOnFightStop()
        }
    }

    private create(): void {
        setTimeout(() => {
            if (this.wGame.gui.playerData && this.wGame.gui.playerData.jobs && this.wGame.gui.playerData.jobs.list) {
                const jobs = this.wGame.gui.playerData.jobs.list;
                if (Object.keys(jobs).length > 0 && typeof jobs[Object.keys(jobs)[0]].experience == "undefined") this.create();
                else {
                    this.clean();
                    this.xpRestanteText = document.createElement('div');
                    this.xpRestanteText.id = 'xpRestanteId';
                    this.xpRestanteText.className = 'xpRestanteText';
                    this.xpRestanteText.style.visibility = 'visible';
                    this.xpRestanteText.innerHTML = '';
                    for (const id in jobs) {
                        const job = jobs[id];
                        if (job.experience.jobXpNextLevelFloor) {
                            const xpToWin = job.experience.jobXpNextLevelFloor - job.experience.jobXP;
                            const html = `
                                <div class="job">
                                    <div class="description">
                                        <div class="name">${job.info.nameId}</div>
                                        <div class="text">
                                            ${xpToWin}
                                            ${this.translate.instant('app.option.vip.jobsxp.text')}
                                            ${job.experience.jobLevel + 1}
                                        </div>
                                    </div>
                                    ${this.getIconHTML(job)}
                                </div>
                            `;

                            this.xpRestanteText.insertAdjacentHTML('beforeend', html);
                        }
                    }
                    if (this.xpRestanteText.innerHTML != '') {
                        this.wGame.foreground.rootElement.appendChild(this.xpRestanteText);
                    }
                }
            }
            else this.create();
        }, 500);
    }

    private setFightStart(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', () => {
            try {
                this.clean();
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }

    private stopOnFightEnd(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', () => {
            try {
                this.create();
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }

    private stopOnFightStop(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage', () => {
            try {
                this.create();
            } catch (ex) {
                Logger.error(ex);
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
                Logger.error(ex);
            }
        });
    }

    private getIconHTML(job): string {
        const src = this.wGame.Config.assetsUrl + "/gfx/jobs/" + job.info.iconId + ".png";
        return '<img src="' + src + '"  alt=""/>';
    }

    public reset() {
        super.reset();
        if (this.params) {
            const jobsxpbarCss = this.wGame.document.getElementById('jobsxpbarCss');
            if (jobsxpbarCss && jobsxpbarCss.parentElement) {
                jobsxpbarCss.parentElement.removeChild(jobsxpbarCss);
            }
            if (this.xpRestanteText && this.xpRestanteText.parentElement) {
                this.xpRestanteText.parentElement.removeChild(this.xpRestanteText);
            }
        }
    }

}
