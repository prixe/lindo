import { alignmentUIBar } from "./alignmentUIBar";
import { Logger } from "app/core/electron/logger.helper";

export class alignmentUIContainer {

    private wGame: any | Window;
    private container: HTMLDivElement;
    private updateInterval: any;
    private bars: { [fighterId: number]: alignmentUIBar; } = {};

    constructor(wGame: Window | any) {
        this.wGame = wGame;

        this.container = document.createElement('div');
        this.container.id = 'alignmentBars';
        this.container.className = 'alignmentBarsContainer';

        this.wGame.foreground.rootElement.appendChild(this.container);

    }

    public show() {
        this.container.style.visibility = 'visible';

        let player = this.wGame.actorManager.getPlayers();
        for (let index in player) {
            let theplayer =  player[index];
                this.bars[theplayer.data.playerId] = new alignmentUIBar(theplayer, this.wGame);
        }
        this.updateInterval = setInterval(() => {
            this.update();
        }, 400);
    }

    public hide() {
        this.container.style.visibility = '';
        for (let fighterId in this.bars) {
            this.destroyBar(fighterId);
        }
        this.bars = [];
        this.wGame.document.getElementById('alignmentBars').innerHTML = '';
        clearInterval(this.updateInterval);
    }

    private update() {
        for (let index = 0; index < Object.keys(this.bars).length; index++) {
            if (this.bars[Object.keys(this.bars)[index]].update()) {
                this.destroyBar(Object.keys(this.bars)[index]);
            }
        }

    }

    public destroyBar(fighterId: any) {
        // if (this.bars[fighterId]) {
        //     this.bars[fighterId].destroy();
        //     delete this.bars[fighterId];
        // }
    }

    public destroy() {
        this.hide();
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }
}
