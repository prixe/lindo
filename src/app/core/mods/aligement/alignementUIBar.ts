import { Logger } from "app/core/electron/logger.helper";

export class alignementUIBar {

    private player: any; //Le joueur qui détiens la barre de couleur en fct de son alignement
    private wGame: any;

    private alignementBarContainer: HTMLDivElement; //Parent de la barre
    private alignementBar: HTMLDivElement; //La barre en elle-même

    constructor(player: any, wGame: any | Window) {
        this.player = player;
        this.wGame = wGame;
        this.createBar();
    }

    public getId() {
        return this.player.data.playerId;
    }

    private createBar() {
        /* Get data */
        let cellId = this.player.cellId;
        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* Create bar container */
        this.alignementBarContainer = document.createElement('div');
        this.alignementBarContainer.id = 'playerAlignementBarContainer' + this.player.data.playerId;
        this.alignementBarContainer.className = 'AlignementBarContainer';

        /* Create bar */
        this.alignementBar = document.createElement('div');
        this.alignementBar.id = 'playerAlignementBar' + this.player.data.playerId;
        this.alignementBar.className = 'AlignementBar';

        /* Color */
        let alignementInfo = this.player.data.alignmentInfos;
        this.setColorByAlignement(alignementInfo.alignmentSide);

        this.alignementBarContainer.appendChild(this.alignementBar); // Add bar in barContainer
        this.wGame.document.getElementById('AlignementBars').appendChild(this.alignementBarContainer);

        /* Set x and y to for the barContainer */
        this.alignementBarContainer.style.left = (pos.x - this.alignementBarContainer.offsetWidth / 2) + 'px';
        this.alignementBarContainer.style.top = (pos.y) + 'px';
        this.alignementBarContainer.style.opacity = '';
    }

    public update() {
        let player = this.wGame.actorManager.getPlayers();
        let currentPlayer;
        for (let index = 0; index < player.length; index++) {
            // Check player doesn't desapear
            if (player[index].data.playerId == this.player.data.playerId) {
                currentPlayer = player[index];
            }
        }

        if (currentPlayer == null) {
            // player desapear
            return true;
        }

        if (!this.alignementBar || !this.alignementBarContainer) {
            this.createBar();
        }

        this.alignementBar.style.width = '100%';
        this.alignementBar.style.right = '';

        let cellId = currentPlayer.cellId;

        if (cellId) {
            try {
                let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                this.alignementBarContainer.style.left = (pos.x - this.alignementBarContainer.offsetWidth / 2) + 'px';
                this.alignementBarContainer.style.top = (pos.y) + 'px';
                this.alignementBarContainer.style.opacity = '';
            } catch (e) {
                Logger.info(cellId);
                Logger.error(e);
            }
        }

    }

    public destroy() {
        this.alignementBar.parentElement.removeChild(this.alignementBar);
        this.alignementBarContainer.parentElement.removeChild(this.alignementBarContainer);
    }

    private setColorByAlignement(alignmentSide :any) {
        switch (alignmentSide) {
            case 1:
                // Bonta
                this.alignementBarContainer.style.borderColor = '#1f8fcb';
                this.alignementBarContainer.style.backgroundColor = '#1f8fcb';

                this.alignementBar.style.borderColor = '#1f8fcb';
                this.alignementBar.style.backgroundColor = '#1f8fcb';
                break;
            case 2:
                // Brak
                this.alignementBarContainer.style.borderColor = '#820000';
                this.alignementBarContainer.style.backgroundColor = '#820000';

                this.alignementBar.style.borderColor = '#820000';
                this.alignementBar.style.backgroundColor = '#820000';

                break;
            default:
                // Neutral
                this.alignementBarContainer.style.borderColor = '#000';
                this.alignementBarContainer.style.backgroundColor = '#000';

                this.alignementBar.style.borderColor = '#000';
                this.alignementBar.style.backgroundColor = '#000';
                break;
        }
    }
}
