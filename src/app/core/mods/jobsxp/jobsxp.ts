import { Mods } from "../mods";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";
import * as util from 'util' // has no default export
import { inspect } from 'util' // or directly

export class Jobsxp extends Mods{

    private params: Option.VIP.General;
    private xpRestanteText : HTMLDivElement;

    constructor(wGame: any, params: Option.VIP.General) {
        super(wGame);
        this.params = params;

        if (this.params.jobsxp) {
            let jobsxpbarCssverif = this.wGame.document.getElementById('jobsxpbarCss');
            let xpRestanteIdverif = this.wGame.document.getElementById('xpRestanteId');
            if (jobsxpbarCssverif && jobsxpbarCssverif.parentElement) jobsxpbarCssverif.parentElement.removeChild(jobsxpbarCssverif);
            if (xpRestanteIdverif && xpRestanteIdverif.parentElement) xpRestanteIdverif.parentElement.removeChild(xpRestanteIdverif);
            Logger.info('- enable jobsxp');

            let jobsxpbarCss = document.createElement('style');
            jobsxpbarCss.id = 'jobsxpbarCss';
            jobsxpbarCss.innerHTML = `
            .xpRestanteText {
                box-sizing: border-box;
                border: 1px gray solid;
                background-color: #222;
                border-radius: 3px;
                overflow: hidden;
                background-color: #333;
                font-size: 11px;
                position: absolute;
                color: white;
                width: 115px;
                margin-right: 10px;
                margin-top: 10px;
                text-align: right;
                text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.9);
                right: 10px;
                opacity = 0.5;
            }`;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(jobsxpbarCss);
            
            this.setFightStart();
            this.updateJob();
        }
    }

    private create(): void{
        // xpRestanteText
        this.xpRestanteText = document.createElement('div');
        this.xpRestanteText.id = 'xpRestanteId';
        this.xpRestanteText.className = 'xpRestanteText';
        this.xpRestanteText.style.visibility = 'visible';

        this.wGame.foreground.rootElement.appendChild(this.xpRestanteText);
    }

    private updateJob(): void {
        this.on(this.wGame.gui, 'JobExperienceUpdateMessage', (e: any) => {
            try {
                if (this.xpRestanteText && this.xpRestanteText.parentElement){
                    this.xpRestanteText.style.visibility = '';
                    this.xpRestanteText.innerHTML = '';
                    this.xpRestanteText.parentElement.removeChild(this.xpRestanteText);
                }
                if(e.experiencesUpdate.jobXpNextLevelFloor){
                    this.create();
                    this.xpRestanteText.innerHTML = this.wGame.gui.playerData.jobs.list[e.experiencesUpdate.jobId].info.nameId + ": </br>"+(e.experiencesUpdate.jobXpNextLevelFloor - e.experiencesUpdate.jobXP) + " xp manquante avant le lvl "+ (e.experiencesUpdate.jobLevel + 1);
                }
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private setFightStart(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', (e: any) => {
            try {
                // il se passe quelque chose
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    public reset() {
        super.reset();
        if (!this.params.jobsxp) {
            let jobsxpbarCss = this.wGame.document.getElementById('jobsxpbarCss');
            if (jobsxpbarCss && jobsxpbarCss.parentElement) jobsxpbarCss.parentElement.removeChild(jobsxpbarCss);
            if (this.xpRestanteText && this.xpRestanteText.parentElement) this.xpRestanteText.parentElement.removeChild(this.xpRestanteText);
        }
    }

}
