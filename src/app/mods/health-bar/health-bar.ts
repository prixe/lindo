import {Mod} from "../mod";
import {Bar} from "./bar";
import { TranslateService } from "@ngx-translate/core";
import {SettingsService} from "@services/settings.service";
import { ShortcutsHelper } from "@helpers/shortcuts.helper";

export class HealthBar extends Mod {

    private shortcutsHelper: ShortcutsHelper;
    private bars: { [fighterId: number]: Bar; } = { };
    private rendered: boolean = true;

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

    /**
     * Health bar mod initialization,
     * called only when the mod has been enabled in the settings.
     */
    private enableHealthBars(){
        Logger.info('- enable Health-Bar');

        this.appendContainerStyle();
        this.appendContainerElement();
        this.listenGameEvents();

        this.updateHealthBars();

        this.shortcutsHelper.bind(this.settings.option.vip.general.health_bar_shortcut, () => this.toggleRendering());
    }

    /**
     * The shortcut can temporarily disable bars rendering for the rest of the
     * current fight.
     * The container stays, but all bars are removed and stop being updated.
     * @example
     * this.toggleRendering() // Toggles current renderging state
     * this.toggleRendering(true) // Forces rendering
     */
    private toggleRendering(rendered = !this.rendered){
        this.rendered = rendered;

        if (this.rendered) {
            this.updateHealthBars();
        }
        else {
            this.destroyHealthBars();
        }
    }

    /**
     * Appends style tag to the document.
     * Sets the tag to be removed once the mod is reset.
     */
    private appendContainerStyle(){
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

        this.addOnResetListener(() => {
            this.wGame.document.getElementsByTagName('head')[0].removeChild(healthbarCss);
        });
    }

    /**
     * Appends the health bars container element to the document.
     * Sets the element to be removed once the mod is reset.
     */
    private appendContainerElement(){
        const container = document.createElement('div');
        container.id = 'lifeBars';
        container.className = 'lifeBarsContainer';

        this.wGame.foreground.rootElement.appendChild(container);

        this.addOnResetListener(() => {
            this.wGame.foreground.rootElement.removeChild(container);
        })
    }

    /**
     * Ensures the mod updates the bars when needed
     */
    private listenGameEvents(){
        // The rendering state toggled by the keyboard shortcut is reset when entering a fight
        const ensureRendering = () => { this.toggleRendering(true); }
        this.on(this.wGame.gui,'GameFightOptionStateUpdateMessage', ensureRendering);
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnStartMessage', ensureRendering);
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnEndMessage', ensureRendering);

        // Update bars during a fight
        const updateData = () => { setTimeout(() => { this.updateHealthBars(); }, 50); }
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnStartMessage', updateData);
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnEndMessage', updateData);
        this.on(this.wGame.gui,'GameActionFightLifePointsGainMessage', updateData);
        this.on(this.wGame.gui,'GameActionFightLifePointsLostMessage', updateData);
        this.on(this.wGame.gui,'GameActionFightLifeAndShieldPointsLostMessage', updateData);
        this.on(this.wGame.gui,'GameActionFightPointsVariationMessage', updateData);
        this.on(this.wGame.gui,'GameFightOptionStateUpdateMessage', updateData);
        this.on(this.wGame.gui,'GameActionFightDeathMessage', updateData);
        this.on(this.wGame.gui,'resize', updateData);

        this.on(this.wGame.gui, 'GameActionFightDeathMessage', (e: any) => { this.destroyHealthBar(e.targetId); });

        // Remove all bars when the fight ends
        const destroy = () => { this.destroyHealthBars(); }
        this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage', destroy);
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', destroy);
    }

    /**
     * This will cycle through all bars and update their display if the
     * fighter is still alive.
     */
    private updateHealthBars() {
        if (!this.rendered) return;

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

    /**
     * Destroys a single health bar
     */
    private destroyHealthBar(fighterId: number){
        if (this.bars[fighterId]) {
            this.bars[fighterId].destroy();
            delete this.bars[fighterId];
        }
    }

    /**
     * Destroys all health bars
     */
    private destroyHealthBars(){
        Object.keys(this.bars).forEach((fighterId: string) => {
            this.destroyHealthBar(parseInt(fighterId));
        })
    }

    public reset(){
        super.reset()
        this.destroyHealthBars();
    }
}
