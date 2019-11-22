import { Mods } from "../mods";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";

/**
* This mod add the possibility to display a chronometer while fighting,
* usefull for PVE to always know if the combat is still decent in time for xp
*/

export class FightChronometer extends Mods {
    private container              : any;
    private chronometerInitialized : boolean;
    private chronometerInterval    : any;
    private chronometerContainer   : any;

    constructor(wGame: any | Window, private params: Option.VIP.General) {
        super(wGame);

        if (this.params.fightchronometer) {
            Logger.info('- enable Fight-Chronometer');

            this.chronometerInitialized = (this.wGame.document.querySelector("#chronometerContainer") === null ? false : true);
            if (!this.chronometerInitialized) {
                this.create();
            }

            this.on(this.wGame.dofus.connectionManager, 'GameFightStartMessage', this.update.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', this.clear.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage', this.clear.bind(this));
        }
    }

    private create() {
        try {
            if (this.chronometerInitialized) {
                return;
            }

            this.container = this.wGame.document.querySelector('.infoContainer');
            if (!this.container) return;

            // Makes some room for the chronometer
            const turnsContainer = this.wGame.document.querySelector('.turnCountLabel');
            turnsContainer.style = `margin-top: -5px;`;

            this.chronometerContainer = this.wGame.document.createElement("div");
            this.chronometerContainer.id = "chronometerContainer";
            this.chronometerContainer.style = `
            margin-top: -9px;
            color: white;
            text-align: center;
            `;
            this.chronometerContainer.innerHTML = `00:00:00`;

            this.container.insertBefore(this.chronometerContainer,
                this.wGame.document.querySelector('.fightControlButtons'));
                this.chronometerInitialized = true;
        } catch (ex) {
            Logger.error(ex);
        }
    }

    private update() {
        if (!this.chronometerInitialized) {
            this.create();
        }
        let chronometerTime = 0;
        /**TODO(HoPollo) : Opti : use "this.wGame.gui.fightManager.timeCreationStarted" for accuracy
         * & to allow chornometer to count if activated mid game (missing start event)
         * */
        try {
            this.chronometerInterval = setInterval(() => {
                if (this.wGame.gui.fightManager.fightState != 1) {
                    return clearInterval(this.chronometerInterval);
                }
                
                this.chronometerContainer.innerHTML = new Date(chronometerTime++ * 1000).toISOString().substr(11, 8);
            }, 1000);
        } catch (ex) {
            Logger.error(ex);
        }
    }

    private clear() {
        try {
            clearInterval(this.chronometerInterval);
            this.chronometerContainer.innerHTML = '00:00:00';
        } catch (ex) {
            Logger.error(ex);
        }
    }

    private destroy() {
        this.chronometerInitialized = false;
        if (this.chronometerContainer && this.container) {
            this.container.removeChild(this.chronometerContainer);
            clearInterval(this.chronometerInterval);
        }
    }

    public reset() {
        super.reset();
        if (!this.params.fightchronometer) {
            this.destroy();
        }
    }
}