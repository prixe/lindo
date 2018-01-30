import {DamageContainer} from "./damagecontainer";
import { Mods } from "../mods";
import { ShortcutsHelper } from "app/core/helpers/shortcuts.helper";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";

export class DamageEstimator extends Mods{

    private params: Option.VIP.General
    private shortcutsHelper: ShortcutsHelper;
    private damageContainer: DamageContainer;

    constructor(wGame: any, params: Option.VIP.General) {
        super(wGame);
        this.params = params;

        if (this.params.estimator) {

            Logger.info('- enable Damage-Estimator');

            this.shortcutsHelper = new ShortcutsHelper(this.wGame);
            this.damageContainer = new DamageContainer(this.wGame);

            //this.removeOnDeath();
            this.setSpellSelected();
            this.setSpellSlotDeselected();
            //this.stopOnFightEnd();

            this.damageContainer.toggle();
        }
    }


    private removeOnDeath(): void {;
        this.on(this.wGame.gui, 'GameActionFightDeathMessage', (e: any) => {
            try {
                this.damageContainer.destroyEstimator(e.targetId);
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private setSpellSlotDeselected(): void {
        this.on(this.wGame.gui, 'spellSlotDeselected', () => {
            try {
                Logger.info('onSpellSlotDeselected');
                this.damageContainer.destroyEstimators();
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private setSpellSelected(): void {
        this.on(this.wGame.gui, 'spellSlotSelected', (spellId: number) => {
            try {
                Logger.info('onSpellSelected');
                let spell = this.wGame.gui.playerData.characters.mainCharacter.spellData.spells[spellId];
                this.damageContainer.display(spell);
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private stopOnFightEnd(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', (e: any) => {
            try {
                this.damageContainer.fightEnded();
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }


    public reset() {
        super.reset();
        if (this.params.estimator) {
            this.shortcutsHelper.unBindAll();
            this.damageContainer.destroy();
        }
    }

}
