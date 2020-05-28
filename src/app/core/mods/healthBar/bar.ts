import { BarContainer } from "./barContainer";
import { Logger } from "app/core/electron/logger.helper";
export class Bar {

    private fighter: any;
    private wGame: any;

    private lifeBarContainer : HTMLDivElement;
    private lifeBar : HTMLDivElement;
    private shieldBar : HTMLDivElement;
    private lifePointsText : HTMLDivElement;
    private container : BarContainer;

    constructor(fighter: any, container: BarContainer, wGame: any | Window){
        this.fighter = fighter;
        this.wGame = wGame;
        this.container = container;

        this.createBar();

    }

    public getId(){
        return this.fighter.id;
    }

    public update(){
        let fighter = this.wGame.gui.fightManager.getFighter(this.fighter.id);

        if (this.wGame.gui.fightManager.isInBattle()) {

            if (fighter.data.alive) {
                if (!this.lifeBar || !this.lifeBarContainer || !this.lifePointsText) {
                    this.createBar();
                }

                let life = fighter.data.stats.lifePoints / fighter.data.stats.maxLifePoints;
                let shield = fighter.data.stats.shieldPoints / fighter.data.stats.maxLifePoints;
                this.lifeBar.style.width = Math.round(life * (shield > 0 ? 50 : 100)) + '%';
                this.shieldBar.style.width = Math.round(shield * 50) + '%';
                this.lifePointsText.innerHTML = fighter.data.stats.lifePoints + fighter.data.stats.shieldPoints;

                if (shield > 0) {
                    this.lifeBar.style.right = '50%';
                }
                else {
                    this.lifeBar.style.right = '';
                }

                let invisible = false;
                for (let idB in fighter.buffs) {
                  if (fighter.buffs[idB].effect.effectId == 150) invisible = true;
                }

                let cellId = fighter.data.disposition.cellId;

                if (cellId && (!invisible || this.wGame.gui.fightManager.isFighterOnUsersTeam(fighter.id))) {
                    try {
                        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                        this.lifeBarContainer.style.left = (pos.x - this.lifeBarContainer.offsetWidth / 2) + 'px';
                        this.lifeBarContainer.style.top = (pos.y) + 'px';
                        this.lifeBarContainer.style.opacity = '';
                        this.lifePointsText.style.opacity = '';
                        if (this.container.getShowLifePoints()) {
                            this.lifePointsText.style.display = '';
                            this.lifePointsText.style.left = (pos.x - this.lifeBarContainer.offsetWidth / 2) + 'px';
                            this.lifePointsText.style.top = (pos.y) + 'px';
                        }
                        else {
                            this.lifePointsText.style.display = 'none';
                        }
                    }
                    catch(e) {
                        Logger.info(cellId);
                        Logger.error(e);
                    }
                }
                else if (invisible) {
                    this.lifeBarContainer.style.opacity = '0.5';
                    this.lifePointsText.style.opacity = '0.5';
                }
            }
        }
    }

    private createBar(){
        /* retrieve data */
        let life = this.fighter.data.stats.lifePoints / this.fighter.data.stats.maxLifePoints;
        let cellId = this.fighter.data.disposition.cellId;
        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* lifeBarContainer */
        this.lifeBarContainer = document.createElement('div');
        this.lifeBarContainer.id = 'fighterLifeBarContainer' + this.fighter.id;
        this.lifeBarContainer.className = 'lifeBarContainer';

        if (this.fighter.data.teamId == 0) this.lifeBarContainer.style.borderColor = 'red';
        else this.lifeBarContainer.style.borderColor = '#3ad';

        /* lifeBar */
        this.lifeBar = document.createElement('div');
        this.lifeBar.id = 'fighterLifeBar' + this.fighter.id;
        this.lifeBar.className = 'lifeBar';

        if (this.fighter.data.teamId == 0) this.lifeBar.style.backgroundColor = 'red';
        else this.lifeBar.style.backgroundColor = '#3ad';
        this.lifeBarContainer.appendChild(this.lifeBar);

        /* shieldBar */
        this.shieldBar = document.createElement('div');
        this.shieldBar.id = 'fighterShieldBar' + this.fighter.id;
        this.shieldBar.className = 'shieldBar';

        this.lifeBarContainer.appendChild(this.shieldBar);

        /* lifePointsText */
        this.lifePointsText = document.createElement('div');
        this.lifePointsText.id = 'fighterLifePoints' + this.fighter.id;
        this.lifePointsText.className = 'lifePointsText';

        this.wGame.document.getElementById('lifeBars').appendChild(this.lifeBarContainer);
        this.wGame.document.getElementById('lifeBars').appendChild(this.lifePointsText);
    }

    public destroy(){
        this.lifePointsText.parentElement.removeChild(this.lifePointsText);
        this.lifeBar.parentElement.removeChild(this.lifeBar);
        this.lifeBarContainer.parentElement.removeChild(this.lifeBarContainer);
    }
}
