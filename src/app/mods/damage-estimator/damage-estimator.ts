import {Mod} from "../mod";
import {DamageContainer} from "./damage-container";
import {ShortcutsHelper} from "@helpers/shortcuts.helper";

export class DamageEstimator extends Mod {
    private shortcutsHelper: ShortcutsHelper;
    private damageContainer: DamageContainer;

    startMod(): void {
        this.params = this.settings.option.vip.general.estimator;
        if (this.params) {
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


    private removeOnDeath(): void {

        this.on(this.wGame.gui, 'GameActionFightDeathMessage', (e: any) => {
            try {
                this.damageContainer.destroyEstimator(e.targetId);
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }

    private setSpellSlotDeselected(): void {
        this.on(this.wGame.gui, 'spellSlotDeselected', () => {
            try {
                Logger.info('onSpellSlotDeselected');
                this.damageContainer.destroyEstimators();
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }

    private setSpellSelected(): void {
        this.on(this.wGame.gui, 'spellSlotSelected', (spellId: number) => {
            try {
                Logger.info('onSpellSelected');
                const spell = this.wGame.gui.playerData.characters.mainCharacter.spellData.spells[spellId];
                this.damageContainer.display(spell);
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }

    private stopOnFightEnd(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', () => {
            try {
                this.damageContainer.fightEnded();
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }


    public reset() {
        super.reset();
        if (this.params) {
            this.shortcutsHelper.unBindAll();
            this.damageContainer.destroy();
        }
    }

}
