import {Mod} from "../mod";
import {HarvestBar} from "./harvest-bar";

export class Harvest extends Mod {
    private harvestBar: HarvestBar;
    private statedElements: Map<number, number> = new Map();
    private isInHarvest: boolean = false;

    startMod(): void {
        this.params = this.settings.option.vip.general;

        if (this.params._harvest_indicator) {

            Logger.info('- enable Harvest indicator');

            const harvestCss = document.createElement('style');
            harvestCss.id = 'harvestCss';
            harvestCss.innerHTML = `
            .harvestBarContainer {
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
            .harvestBar {
                transition-duration: 300ms;
                height: 100%;
                width: 100%;
                background-color: orange;
            }
            .harvestTimeText {
                font-size: 11px;
                font-weight: bold;
                text-align: center;
                position: absolute;
                width: 80px;
                color: white;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.9);
                transition-duration: 500ms;
                margin-top: 4px;
            }`;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(harvestCss);

            this.harvestBar = new HarvestBar(this.wGame);

            this.removeOnFinish();
            this.displayOnStart();
            this.setHarvestStart();
        }
    }

   private setHarvestStart(): void {
        this.on(this.wGame.dofus.connectionManager, 'StatedElementUpdatedMessage', (e: any) => {
            try {
                this.statedElements.set(e.statedElement.elementId, e.statedElement.elementCellId);
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }

   private displayOnStart(): void {
        this.on(this.wGame.dofus.connectionManager, 'InteractiveUsedMessage', (e: any) => {
            try {
                if (this.statedElements.has(e.elemId) && e.entityId == this.wGame.isoEngine.actorManager.userId) {
                    this.harvestBar.harvestStarted(this.statedElements.get(e.elemId), e.duration);
                    this.isInHarvest = true;
                    this.statedElements.clear();
                }
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }

    private removeOnFinish(): void {
        this.on(this.wGame.dofus.connectionManager, 'InteractiveUseEndedMessage', () => {
            try {
                this.isInHarvest = !(this.harvestBar.destroy());
            } catch (ex) {
                Logger.error(ex);
            }
        });
    }


    public reset() {
        super.reset();
        if (this.params.harvest_indicator) {
            if (this.harvestBar) this.harvestBar.destroy();
            const bar = this.wGame.document.getElementById('harvestBarContainer');
            if (bar) bar.remove();
            const time = this.wGame.document.getElementById('harvestTime');
            if (time) time.remove();
            const harvestCss = this.wGame.document.getElementById('harvestCss');
            if (harvestCss && harvestCss.parentElement) harvestCss.parentElement.removeChild(harvestCss);
        }
    }

}
