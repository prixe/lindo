import {Mods} from "../mods";
import { Logger } from "app/core/electron/logger.helper";

export class Mover extends Mods {

    constructor(wGame: any) {
        super(wGame);
    }

    public move(direction: string, success: any, fail: any): void {
        if (this.wGame.gui.fightManager.fightState < 0) {
                let cells = null;
                switch(direction) {
                case "top":
                    cells = this.getTopCells();
                    break;
                case "bottom":
                    cells = this.getBottomCells();
                    break;
                case "left":
                    cells = this.getLeftCells();
                    break;
                case "right":
                    cells = this.getRightCells();
                    break;
                default:
                    fail('The given direction is wrong.');
                    return;
                }

                let cell = this.getRandomAvailableCell(cells, direction);

                if (cell == -1) {
                	console.log("No Cell Found.");
                	return;
                }

                let doMove = () => {
                    let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cell);
                    let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                    this.wGame.isoEngine.gotoNeighbourMap(direction, cell, Math.floor(pos.x), Math.floor(pos.y));
                };
                this.onMapChange(success, fail);
                if (this.wGame.isoEngine.actorManager.userActor.moving) this.wGame.isoEngine.actorManager.userActor.cancelMovement(doMove);
                else doMove();
        }
        else {
            fail('character in fight');
        }
    }

    private onMapChange(callback: any, fail: any = null): void {
        let previousMap = this.wGame.isoEngine.mapRenderer.mapId;
        let changeTimeout = setTimeout(() => {
            if (fail) fail('Map change timeout');
        }, 15000);
        let onChange = (e: any) => {
            this.wGame.dofus.connectionManager.removeListener("MapComplementaryInformationsWithCoordsMessage", onChange);
            this.wGame.dofus.connectionManager.removeListener("MapComplementaryInformationsDataMessage", onChange);
            clearTimeout(changeTimeout);
            let changeMapRetry = () => {
                if (this.wGame.isoEngine.actorManager.getActor(this.wGame.isoEngine.actorManager.userId).moving || previousMap == this.wGame.isoEngine.mapRenderer.mapId) {
                    setTimeout(changeMapRetry, 300);
                }
                else {
                    setTimeout(callback, 100 + Math.random() * 700);
                }
            }
            setTimeout(changeMapRetry, 1200);
        };
        this.once(this.wGame.dofus.connectionManager, "MapComplementaryInformationsWithCoordsMessage", onChange);
        this.once(this.wGame.dofus.connectionManager, "MapComplementaryInformationsDataMessage", onChange);
    };

    private getTopCells(): any {
        return [1, 15, 2, 16, 3, 17, 4, 18, 5, 19, 6, 20, 7, 21, 8, 22, 9, 23, 10, 24, 11, 25, 12, 26, 13];
    }

    private getBottomCells(): any {
        return [533, 547, 534, 548, 535, 549, 536, 550, 537, 551, 538, 552, 539, 553, 540, 554, 541, 555, 542, 556, 543, 557, 544, 558, 545, 559];
    }

    private getLeftCells(): any {
        return [0, 14, 28, 42, 56, 70, 84, 98, 112, 126, 140, 154, 168, 182, 196, 210, 224, 238, 252, 266, 280, 294, 308, 322, 336, 350, 364, 378, 392, 406, 420, 434, 448, 462, 476, 490, 504, 518, 532, 546];
    }

    private getRightCells(): any {
        return [13, 27, 41, 55, 69, 83, 97, 111, 125, 139, 153, 167, 181, 195, 209, 223, 251, 279, 307, 321, 335, 349, 363, 377, 391, 405, 419, 433, 447, 475, 489, 503, 517, 531, 545, 559];
    }

    private getRandomAvailableCell(cells: Array<number>, direction: string): number {
        let occupiedCells = this.getMonsterGroupBossCells();
        let availableCells = cells.filter( cell => !occupiedCells.includes(cell) 
        	&& this.isCellOnMap(cell) 
        	&& this.isCellWalkable(cell) 
        	&& this.isCellChangesMapToDirection(cell, direction)).sort(() => Math.random() - 0.5);

        if (availableCells.length > 0) {
        	return availableCells[0];
        } else {
        	return -1;
        }
    }

    private getMonsterGroupBossCells(): Array<number> {
        let cells = [];
        let actors = this.wGame.isoEngine.actorManager.getIndexedVisibleActors();
        for (var id in actors) {
            if (actors[id].data.type == "GameRolePlayGroupMonsterInformations" && actors[id].groupBoss == null) {
                cells.push(actors[id].cellId);
            }
        }
        return cells;
    }

    private isCellOnMap(cell: number): boolean {
    	return this.wGame.isoEngine.mapRenderer.map.cells[cell];
    }

    private isCellWalkable(cell: number): boolean {
    	return this.wGame.isoEngine.mapRenderer.isWalkable(cell);
    }

    private isCellChangesMapToDirection(cell: number, direction: string): boolean {
    	return this.wGame.isoEngine.mapRenderer.getChangeMapFlags(cell)[direction];
    }
}
