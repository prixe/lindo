import { Bar } from "./bar";
import { Logger } from "app/core/electron/logger.helper";

export class BarContainer {
    private wGame: any | Window;
    private container: HTMLDivElement;
    private displayed: boolean = false;
    private enabled: boolean = true;
    private showLifePoints: boolean = true;
    private isInFight = false;
    private updateInterval: any;
    private bars: { [fighterId: number]: Bar; } = { };

    constructor(wGame: Window | any) {
        this.wGame = wGame;

        this.container = document.createElement('div');
        this.container.id = 'lifeBars';
        this.container.className = 'lifeBarsContainer';

        this.wGame.foreground.rootElement.appendChild(this.container);

        if (this.wGame.gui.fightManager.isInBattle()) this.fightStarted();

    }

    public toggle() {
        if (!this.enabled) {
            Logger.info('Show health bar');
            this.enabled = true;
            this.showLifePoints = true;
        }
        else {
            Logger.info('Hide health bar');
            if (this.showLifePoints) this.showLifePoints = false;
            else this.enabled = false;
        }
        if (this.isInFight) {
            if (this.enabled) this.show();
            else this.hide();
        }
    }

    private show() {
        if (!this.displayed) {
            this.displayed = true;
            this.container.style.visibility = 'visible';

            let fighters = this.wGame.gui.fightManager.getFighters();
            for (let index in fighters) {
                let fighter = this.wGame.gui.fightManager.getFighter(fighters[index]);
                if (fighter.data.alive) {
                    this.bars[fighter.id] = new Bar(fighter, this, this.wGame);
                }
            }
            this.updateInterval = setInterval(()=>{
                this.update();
            }, 400);
        }
    }

    public hide() {
        if (this.displayed) {
            this.displayed = false;
            this.container.style.visibility = '';
            for (let fighterId in this.bars) {
                this.destroyBar(fighterId);
            }
            this.bars = [];
            this.wGame.document.getElementById('lifeBars').innerHTML = '';
            clearInterval(this.updateInterval);
        }
    }

    private update() {
        if (this.isInFight) {
            let fighters = this.wGame.gui.fightManager.getFighters();
            for (let index in fighters) {
                let fighter = this.wGame.gui.fightManager.getFighter(fighters[index]);
                if (fighter.data.alive) {
                    if (this.bars[fighter.id]) this.bars[fighter.id].update();
                    else this.bars[fighter.id] = new Bar(fighter, this, this.wGame);
                }
            }
        }
    }

    public destroyBar(fighterId: any) {
        if (this.bars[fighterId]) {
            this.bars[fighterId].destroy();
            delete this.bars[fighterId];
        }
    }


    public fightStarted() {
        this.isInFight = true;
        if (this.enabled) this.show();
    }

    public fightEnded() {
        this.isInFight = false;
        if (this.enabled) this.hide();
    }

    public getShowLifePoints(): any {
        return this.showLifePoints;
    }


    public destroy() {
        this.hide();
        if (this.container && this.container.parentElement) this.container.parentElement.removeChild(this.container);
    }
}
