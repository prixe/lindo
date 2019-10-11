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
        /*Récupération des datas*/
        let cellId = this.player.cellId;
        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* Création de la barre conteneur */
        this.alignementBarContainer = document.createElement('div');
        this.alignementBarContainer.id = 'playerAlignementBarContainer' + this.player.data.playerId;
        this.alignementBarContainer.className = 'AlignementBarContainer';

        /* Création de la barre en elle même */
        this.alignementBar = document.createElement('div');
        this.alignementBar.id = 'playerAlignementBar' + this.player.data.playerId;
        this.alignementBar.className = 'AlignementBar';

        /*Gestion des couleurs en fonction de l'alignement*/
        let AlignementInfo = this.player.data.alignmentInfos;
        this.setColorByAlignement(AlignementInfo.alignmentSide);


        this.alignementBarContainer.appendChild(this.alignementBar);//Ajoute la barre dans le container 
        this.wGame.document.getElementById('AlignementBars').appendChild(this.alignementBarContainer); // Ajoute le container dans le container principale.

        /*Placement de la barre en fonction de la cellId du joueur*/
        this.alignementBarContainer.style.left = (pos.x - this.alignementBarContainer.offsetWidth / 2) + 'px';
        this.alignementBarContainer.style.top = (pos.y) + 'px';
        this.alignementBarContainer.style.opacity = '';
    }

    public update() {
        let player = this.wGame.actorManager.getPlayers(); // Récuperation des joueurs
        let currentPlayer;
        for (let index = 0; index < player.length; index++) //Je recherche mon joueur dans la liste des joueurs afin d'être sur qu'il existe encore.
            if (player[index].data.playerId == this.player.data.playerId)
                currentPlayer = player[index];

        if (currentPlayer == null)
            return true; // return true -> oui il faut supprimer cette barre, le joueurs n'existe plus.

        if (!this.alignementBar || !this.alignementBarContainer) { // Si je n'ai pas déja créé la barre, je la créer.
            this.createBar();
        }

        this.alignementBar.style.width = '100%'; // La couleur de la barre prends toute la place.
        this.alignementBar.style.right = '';

        let cellId = currentPlayer.cellId; //Je récupère la cellID

        if (cellId) {
            try {
                let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                this.alignementBarContainer.style.left = (pos.x - this.alignementBarContainer.offsetWidth / 2) + 'px';
                this.alignementBarContainer.style.top = (pos.y) + 'px';
                this.alignementBarContainer.style.opacity = '';
            }
            catch (e) {
                Logger.info(cellId);
                Logger.error(e);
            }
        }

    }

    public destroy() { // Remove les 2 élément HTML
        this.alignementBar.parentElement.removeChild(this.alignementBar);
        this.alignementBarContainer.parentElement.removeChild(this.alignementBarContainer);
    }

    private setColorByAlignement(alignmentSide :any){
        switch (alignmentSide) {
            case 1://Le personnage est bontarien
                this.alignementBarContainer.style.borderColor = '#1f8fcb';
                this.alignementBarContainer.style.backgroundColor = '#1f8fcb';

                this.alignementBar.style.borderColor = '#1f8fcb';
                this.alignementBar.style.backgroundColor = '#1f8fcb';
                break;
            case 2://Le personnage est brakmarien
                this.alignementBarContainer.style.borderColor = '#820000';
                this.alignementBarContainer.style.backgroundColor = '#820000';

                this.alignementBar.style.borderColor = '#820000';
                this.alignementBar.style.backgroundColor = '#820000';

                break;
            default: // Le personnage est neutre ou d'un alignement non supporté.
                this.alignementBarContainer.style.borderColor = '#000';
                this.alignementBarContainer.style.backgroundColor = '#000';

                this.alignementBar.style.borderColor = '#000';
                this.alignementBar.style.backgroundColor = '#000';
                break;
        }
    }
}
