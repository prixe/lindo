import {Mod} from "../mod";
import {Bar} from "./bar";
import { TranslateService } from "@ngx-translate/core";
import {SettingsService} from "@services/settings.service";

export class HealthBar extends Mod {

    startMod(): void {}

    private bars: { [fighterId: number]: Bar; } = { };
    private container: HTMLDivElement;

    constructor(
        wGame: any,
        settings: SettingsService,
        translate: TranslateService
    ){
        super(wGame,settings,translate);

        if (this.settings.option.vip.general.health_bar) this.enableHealthBars();
    }

    private enableHealthBars(){
        Logger.info('- enable Health-Bar');

        let healthbarCss = document.createElement('style');
        healthbarCss.id = 'healthbarCss';
        healthbarCss.innerHTML = `

        .lifeBarsContainer {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
        }

        .lifeBarContainer {
            box-sizing: border-box;
            background-color: #222;
            height: 6px;
            width: 80px;
            position: absolute;
            border-radius: 3px;
            overflow: hidden;
            transition-duration: 500ms;
            margin-top: 10px;
        }

        .lifeBar {
            transition-duration: 300ms;
            height: 100%;
            width: 100%;
            background-color: #333;
        }

        .lifePointsText {
            font-size: 12px;
            position: absolute;
            width: 80px;
            color: white;
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.9);
            transition-duration: 500ms;
            margin-top: 16px;
            margin-left: 2px;
        }`;

        this.wGame.document.getElementsByTagName('head')[0].appendChild(healthbarCss);

        this.createHealthBars();
        this.showHealthBars();

        let show = () => { this.createHealthBars(); this.showHealthBars(); }
        this.on(this.wGame.gui,'GameFightOptionStateUpdateMessage',show);
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnStartMessage',show);
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnEndMessage',show);

        let destroy = () => {  this.destoryHealthBars();   }
        this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage',destroy);
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage',destroy);

        this.on(this.wGame.gui, 'GameActionFightDeathMessage', (e: any) => { this.destroyHealthBar(e.targetId); });
    }

    private createHealthBars(){
        if (this.wGame.document.getElementById('lifeBars') != null) return;
        
        this.container = document.createElement('div');
        this.container.id = 'lifeBars';
        this.container.className = 'lifeBarsContainer';
        this.container.style.visibility = '';

        this.wGame.foreground.rootElement.appendChild(this.container);
    }

    private showHealthBars(){
        if (this.container.style.visibility != "visible"){
            this.container.style.visibility = 'visible';
            
            this.createHealthBars();
            this.updateHealthBar();

            let updateData = () => { setTimeout(() => { this.updateHealthBar(); }, 50); }
            this.on(this.wGame.dofus.connectionManager, 'GameFightTurnStartMessage',updateData);
            this.on(this.wGame.dofus.connectionManager, 'GameFightTurnEndMessage',updateData);

            this.on(this.wGame.gui,'GameActionFightLifePointsGainMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightLifePointsLostMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightLifeAndShieldPointsLostMessage',updateData);

            this.on(this.wGame.gui,'GameActionFightExchangePositionsMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightPointsVariationMessage',updateData);
            this.on(this.wGame.gui,'GameFightOptionStateUpdateMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightDeathMessage',updateData);
            this.on(this.wGame.gui,'resize',updateData);
        }
    }

    private updateHealthBar() {
        this.createHealBar();
    }

    private createHealBar(){
        let fighters = this.wGame.gui.fightManager.getFighters();
        for (let index in fighters) {
            let fighter = this.wGame.gui.fightManager.getFighter(fighters[index]);
            if (fighter.data.alive) {
                if (!this.bars[fighter.id]) {
                    this.bars[fighter.id] = new Bar(fighter, this.wGame); 
                    this.addOnResetListener(() => { this.destoryHealthBars(); });
                }
                this.bars[fighter.id].update();
            }
        }
    }

    private destroyHealthBar(fighterId: any){
        if (this.bars[fighterId]) {
            this.bars[fighterId].destroy();
            delete this.bars[fighterId];
        }
    }

    private destoryHealthBars(){
        let lifeBars = this.wGame.document.getElementById('lifeBars');
        if (lifeBars != null) {
            this.bars = { };
            lifeBars.parentElement.removeChild(lifeBars);
        }
    }
}
