import { Logger } from "app/core/electron/logger.helper";

export class alignmentUIBar {

    private player: any; // Le joueur qui détiens la barre de couleur en fct de son alignment
    private wGame: any;

    private alignmentBarContainer: HTMLDivElement; // Parent de la barre
    private alignmentBar: HTMLDivElement; // La barre en elle-même

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
        let alignmentInfo = this.player.data.alignmentInfos;

        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* Create bar container */
        this.alignmentBarContainer = document.createElement('div');
        this.alignmentBarContainer.id = 'playerAlignmentBarContainer' + this.player.data.playerId;
        this.alignmentBarContainer.className = 'alignmentBarContainer';

        /* Create bar */
        this.alignmentBar = document.createElement('div');
        this.alignmentBar.id = 'playerAlignmentBar' + this.player.data.playerId;
        this.alignmentBar.className = 'alignmentBar';

        /* Color */
        this.setColorByAlignment(alignmentInfo.alignmentSide);

        this.alignmentBarContainer.appendChild(this.alignmentBar); // Add bar in barContainer
        this.wGame.document.getElementById('alignmentBars').appendChild(this.alignmentBarContainer);

        /* Set x and y to for the barContainer */
        this.alignmentBarContainer.style.left = (pos.x - this.alignmentBarContainer.offsetWidth / 2) + 'px';
        this.alignmentBarContainer.style.top = (pos.y) + 'px';
        this.alignmentBarContainer.style.opacity = '';
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

        if (!this.alignmentBar || !this.alignmentBarContainer) {
            this.createBar();
        }

        this.alignmentBar.style.width = '100%';
        this.alignmentBar.style.right = '';

        let cellId = currentPlayer.cellId;

        if (cellId) {
            try {
                let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                this.alignmentBarContainer.style.left = (pos.x - this.alignmentBarContainer.offsetWidth / 2) + 'px';
                this.alignmentBarContainer.style.top = (pos.y) + 'px';
                this.alignmentBarContainer.style.opacity = '';
            } catch (e) {
                Logger.info(cellId);
                Logger.error(e);
            }
        }

    }

    public destroy() {
        // this.alignmentBar.parentElement.removeChild(this.alignmentBar);
        // this.alignmentBarContainer.parentElement.removeChild(this.alignmentBarContainer);
    }

    private setColorByAlignment(alignmentSide) {
        switch (alignmentSide) {
            case 1:
                // Bonta
                this.alignmentBarContainer.style.borderColor = '#1f8fcb';
                this.alignmentBarContainer.style.backgroundColor = '#1f8fcb';

                this.alignmentBar.style.borderColor = '#1f8fcb';
                this.alignmentBar.style.backgroundColor = '#1f8fcb';
                break;
            case 2:
                // Brak
                this.alignmentBarContainer.style.borderColor = '#820000';
                this.alignmentBarContainer.style.backgroundColor = '#820000';

                this.alignmentBar.style.borderColor = '#820000';
                this.alignmentBar.style.backgroundColor = '#820000';

                break;
            default:
                // Neutral
                this.alignmentBarContainer.style.borderColor = '#000';
                this.alignmentBarContainer.style.backgroundColor = '#000';

                this.alignmentBar.style.borderColor = '#000';
                this.alignmentBar.style.backgroundColor = '#000';
                break;
        }
    }
}
