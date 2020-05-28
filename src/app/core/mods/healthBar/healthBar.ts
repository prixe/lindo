import { ShortcutsHelper } from "app/core/helpers/shortcuts.helper";
import { Logger } from "app/core/electron/logger.helper";

import { Mod } from "../mod";
import { BarContainer } from "./barContainer";

export class HealthBar extends Mod {
    private shortcutsHelper: ShortcutsHelper;
    private barContainer: BarContainer;
    private fightJustStarted: boolean = false;

    startMod(): void {
        this.params = this.settings.option.vip.general;

        if (this.params.health_bar) {

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
                visibility: hidden;
            }

            .lifeBarContainer {
                box-sizing: border-box;
                border: 1px gray solid;
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
                width: 0%;
                background-color: #333;
            }

            .shieldBar {
                transition-duration: 300ms;
                height: 100%;
                width: 0%;
                margin-left: 50%;
                background-color: #944ae0;
                position: absolute;
                top: 0;
            }

            .lifePointsText {
                font-size: 12px;
                position: absolute;
                width: 80px;
                color: white;
                text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.9);
                transition-duration: 500ms;
                margin-top: 16px;
                margin-left: 2px;
            }`;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(healthbarCss);

            this.shortcutsHelper = new ShortcutsHelper(this.wGame);
            this.barContainer = new BarContainer(this.wGame);


            this.removeOnDeath();
            this.setFightStart();
            this.displayOnStart();
            this.stopOnFightEnd();
            this.stopOnFightStop();


            this.shortcutsHelper.bind(this.params.health_bar_shortcut, () => {
                this.barContainer.toggle();
            });
        }
    }


    private removeOnDeath(): void {
        this.on(this.wGame.gui, 'GameActionFightDeathMessage', (e: any) => {
            try {
                this.barContainer.destroyBar(e.targetId);
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private setFightStart(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', (e: any) => {
            try {
                this.fightJustStarted = true;
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private displayOnStart(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightNewRoundMessage', (e: any) => {
            try {
                if (this.fightJustStarted) {
                    this.fightJustStarted = false;
                    this.barContainer.fightStarted();
                }
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private stopOnFightEnd(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', (e: any) => {
            try {
                this.barContainer.fightEnded();
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private stopOnFightStop(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage', (e: any) => {
            try {
                this.barContainer.fightEnded();
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }


    public reset() {
        super.reset();
        if (this.params.health_bar) {
            if (this.shortcutsHelper) this.shortcutsHelper.unBindAll();
            if (this.barContainer) this.barContainer.destroy();
            let healthbarCss = this.wGame.document.getElementById('healthbarCss');
            if (healthbarCss && healthbarCss.parentElement) healthbarCss.parentElement.removeChild(healthbarCss);
        }
    }

}
