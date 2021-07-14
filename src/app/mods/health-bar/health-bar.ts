import {Mod} from "../mod";
import {Bar} from "./bar";
import { TranslateService } from "@ngx-translate/core";
import {SettingsService} from "@services/settings.service";
import { ShortcutsHelper } from "@helpers/shortcuts.helper";

export class HealthBar extends Mod {

    private shortcutsHelper: ShortcutsHelper;
    private bars: { [fighterId: number]: Bar; } = { };
    private container: HTMLDivElement;
    private visibleBars:boolean = true;

    startMod(): void {}

    constructor(
        wGame: any,
        settings: SettingsService,
        translate: TranslateService
    ){
        super(wGame,settings,translate);
        this.shortcutsHelper = new ShortcutsHelper(this.wGame);

        if (this.settings.option.vip.general.health_bar) this.enableHealthBars();
    }

    private enableHealthBars(){
        Logger.info('- enable Health-Bar');

        const healthbarCss = document.createElement('style');
        healthbarCss.id = 'healthbarCss';
        healthbarCss.innerHTML = `

        .lifeBarContainer {
            box-sizing: border-box;
            background-color: #222;
            height: 6px;
            width: 80px;
            position: absolute;
            border-radius: 3px;
            overflow: hidden;
            margin-top: 10px;
            transition-property: top, left;
            transition-duration: 300ms;
        }

        .lifeBar {
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
            margin-top: 14px;
            margin-left: 2px;
            transition-property: top, left;
            transition-duration: 300ms;
        }`;

        this.wGame.document.getElementsByTagName('head')[0].appendChild(healthbarCss);

        this.standardHealthBars();

        const show = () => { this.standardHealthBars(); }
        this.on(this.wGame.gui,'GameFightOptionStateUpdateMessage',show);
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnStartMessage',show);
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnEndMessage',show);

        const destroy = () => { this.destroyHealthBars(); }
        this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage',destroy);
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage',destroy);

        this.shortcutsHelper.bind(this.settings.option.vip.general.health_bar_shortcut, () => this.toggleHealthBars());

        this.on(this.wGame.gui, 'GameActionFightDeathMessage', (e: any) => { this.destroyHealthBar(e.targetId); });
    }

    private standardHealthBars(){
        this.createHealthBars();
        this.showHealthBars();
    }

    private toggleHealthBars(){
        if (this.visibleBars) {this.container.style.visibility = ""; this.destroyHealthBars(); this.visibleBars = false; }
        else { this.visibleBars = true; this.createHealthBars(); this.updateHealthBar(); }
    }

    private createHealthBars(){
        if (this.wGame.document.getElementById('lifeBars')) return;
        
        this.container = document.createElement('div');
        this.container.id = 'lifeBars';
        this.container.className = 'lifeBarsContainer';

        this.wGame.foreground.rootElement.appendChild(this.container);
    }

    private showHealthBars(){
        if (this.container.style.visibility != "visible" && this.visibleBars){
            this.container.style.visibility = 'visible';
            
            this.updateHealthBar();

            const updateData = () => { setTimeout(() => { this.updateHealthBar(); }, 50); }
            this.on(this.wGame.dofus.connectionManager, 'GameFightTurnStartMessage',updateData);
            this.on(this.wGame.dofus.connectionManager, 'GameFightTurnEndMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightLifePointsGainMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightLifePointsLostMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightLifeAndShieldPointsLostMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightPointsVariationMessage',updateData);
            this.on(this.wGame.gui,'GameFightOptionStateUpdateMessage',updateData);
            this.on(this.wGame.gui,'GameActionFightDeathMessage',updateData);
            this.on(this.wGame.gui,'resize',updateData);
        }
    }

    private updateHealthBar() {
        if (!this.visibleBars) return;

        const fighters = this.wGame.gui.fightManager.getFighters();
        for (const index in fighters) {
            const fighter = this.wGame.gui.fightManager.getFighter(fighters[index]);
            if (fighter.data.alive) {
                if (!this.bars[fighter.id]) {
                    this.bars[fighter.id] = new Bar(fighter, this.wGame); 
                    this.addOnResetListener(() => { this.destroyHealthBars(); });
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

    private destroyHealthBars(){
        const lifeBars = this.wGame.document.getElementById('lifeBars');
        if (lifeBars != null) {
            this.bars = { };
            lifeBars.parentElement.removeChild(lifeBars);
        }
    }
}
