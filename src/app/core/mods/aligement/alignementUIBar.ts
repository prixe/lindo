import { alignementUIContainer } from "./alignementUIContainer";
import { Logger } from "app/core/electron/logger.helper";
export class alignementUIBar {

    private fighter: any;
    private wGame: any;

    private lifeBarContainer : HTMLDivElement;
    private lifeBar : HTMLDivElement;
    private container : alignementUIContainer;

    constructor(fighter: any, container: alignementUIContainer, wGame: any | Window){
        this.fighter = fighter;
        this.wGame = wGame;
        this.container = container;

        this.createBar();

    }

    public getId(){
        return this.fighter.data.playerId;
    }

   

    private createBar(){
        /* retrieve data */
        let life = 1;
        let cellId = this.fighter.cellId;
        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* lifeBarContainer */
        this.lifeBarContainer = document.createElement('div');
        this.lifeBarContainer.id = 'fighterAlignementBarContainer' + this.fighter.data.playerId;
        this.lifeBarContainer.className = 'AlignementBarContainer';


 
       
        /* lifeBar */
        this.lifeBar = document.createElement('div');
        this.lifeBar.id = 'fighterAlignementBar' +this.fighter.data.playerId;
        this.lifeBar.className = 'AlignementBar';

        let AlignementInfo = this.fighter.data.alignmentInfos;
        switch (AlignementInfo.alignmentSide) {
            case 0:
        this.lifeBarContainer.style.borderColor = '#000';
        this.lifeBarContainer.style.backgroundColor = '#000';
                
        this.lifeBar.style.borderColor = '#000';
        this.lifeBar.style.backgroundColor = '#000';
                break;
                case 1:
        this.lifeBarContainer.style.borderColor = '#0000FF';
        this.lifeBarContainer.style.backgroundColor = '#0000FF';

        this.lifeBar.style.borderColor = '#0000FF';
        this.lifeBar.style.backgroundColor = '#0000FF';
                break;
                case 2:
        this.lifeBarContainer.style.borderColor = '#FF0000';
        this.lifeBarContainer.style.backgroundColor = '#FF0000';

        this.lifeBar.style.borderColor = '#FF0000';
        this.lifeBar.style.backgroundColor = '#FF0000';

                break;
            default:
                break;
        }





        this.lifeBarContainer.appendChild(this.lifeBar);
        this.wGame.document.getElementById('AlignementBars').appendChild(this.lifeBarContainer);

        this.lifeBarContainer.style.left = (pos.x - this.lifeBarContainer.offsetWidth / 2) + 'px';
        this.lifeBarContainer.style.top = (pos.y) + 'px';
        this.lifeBarContainer.style.opacity = '';
    }

    public update(){
     //   this.wGame.document.getElementById('fighterLifeBarContainer' + this.fighter.data.playerId).style.
     let fighters = this.wGame.actorManager.getPlayers();
     let TheFighter;
     for (let index = 0; index < fighters.length; index++) {
         if(fighters[index].data.playerId == this.fighter.data.playerId)
         TheFighter = fighters[index];
         
     }

       if(TheFighter == null)
       return true;
            if (!this.lifeBar || !this.lifeBarContainer ) {
                this.createBar();
            }

            let life = 1;
            this.lifeBar.style.width = Math.round(life *100) + '%';
            this.lifeBar.style.right = '';

            let invisible = false;

            let cellId = TheFighter.cellId;

            if (cellId) {
                try {
                    let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                    let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                    this.lifeBarContainer.style.left = (pos.x - this.lifeBarContainer.offsetWidth / 2) + 'px';
                    this.lifeBarContainer.style.top = (pos.y) + 'px';
                    this.lifeBarContainer.style.opacity = '';
                }
                catch(e) {
                    Logger.info(cellId);
                    Logger.error(e);
                }
            }
           
    }

    public destroy(){
        this.lifeBar.parentElement.removeChild(this.lifeBar);
        this.lifeBarContainer.parentElement.removeChild(this.lifeBarContainer);
    }
}
