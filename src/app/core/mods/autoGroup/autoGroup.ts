//background.toggleDebugMode()

import { IpcRendererService } from "app/core/electron/ipcrenderer.service";
import { SettingsService } from "app/core/service/settings.service";
import { TranslateService } from "@ngx-translate/core";

import { EventEmitter } from 'eventemitter3';
import { Logger } from "app/core/electron/logger.helper";

import { Mod } from "../mod";

type Direction = "top" | "bottom" | "left" | "right" | false;

export class AutoGroup extends Mod {
    private lock: boolean = false;
    private followProgress: number = 0;
    private idle: boolean = true;
    private skipNextMapChange: boolean = false;
    private path: any = [];
    private leaderId: number = null;
    private lastType: string = null;
    private movedOnRandomCell: boolean = true;

    constructor(
        wGame: any,
        settings: SettingsService,
        translate: TranslateService,
        private ipcRendererService: IpcRendererService
    ) {
        super(wGame, settings, translate);
        this.ipcRendererService = ipcRendererService;

        this.params = this.settings.option.vip.autogroup;

        if (this.params.active) {
            Logger.info('- Auto-Group enable');

            // le leader invite les membres
            this.autoMasterParty();

            // acceptation de l'invitation automatiquement
            this.autoAcceptPartyInvitation();
        }

        // suit le leader automatiquement
        if (this.params.follow_leader) {
            this.followLeader(this.wGame.gui.isConnected);
        }

        // entre en combat automatiquement
        if (this.params.fight) {
            this.autoEnterFight(this.wGame.gui.isConnected);
        }
    }

    startMod(): void {
        return;
    }

    public autoMasterParty(skipLogin: boolean = false) {
        try {
            setTimeout(() => {
                if (this.params.leader == this.wGame.gui.playerData.characterBaseInformations.name && this.params.members) {
                    Logger.info('start master party');

                    let idInt = setInterval(() => {
                        this.masterParty(this.params.members.split(';'));
                    }, this.getRandomTime(5, 7));

                    this.addOnResetListener(() => {
                        clearInterval(idInt);
                    });
                }
            }, this.getRandomTime(2, 3));
        } catch (e) {
            Logger.info(e);
        }

    }

    private inviteToParty(name: string): void {
        this.wGame.dofus.sendMessage("PartyInvitationRequestMessage", { name: name });
    }

    private acceptPartyInvitation(partyId: number): void {
        this.wGame.dofus.sendMessage("PartyAcceptInvitationMessage", { partyId: partyId });
    }

    public autoAcceptPartyInvitation(): void {
        try {
            setTimeout(() => {
                this.on(this.wGame.dofus.connectionManager, 'PartyInvitationMessage', (msg: any) => {
                    if (this.params.leader === msg.fromName) {
                        this.acceptPartyInvitation(msg.partyId);
                    }
                });
            }, this.getRandomTime(1, 2));
        } catch (e) {
            Logger.info(e);
        }
    }

    public getPartyMembers(): Array<string> {
        let party = [];
        //si dans un groupe
        if (Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0) {
            //recup des membres du grp
            let partyMembers = this.wGame.gui.playerData.partyData._partyFromId[Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]]._members;
            //mise en forme
            for (let player in partyMembers) {
                party.push(partyMembers[player].name);
            }
        }

        return party;
    }

    private masterParty(nameList: Array<string>) {
        let partyMembers = this.getPartyMembers();
        nameList.forEach((name) => {
            if (!partyMembers.includes(name)) {
                this.wGame.dofus.sendMessage('BasicWhoIsRequestMessage', {
                    search: name,
                    verbose: true
                });

                this.once(this.wGame.dofus.connectionManager, 'BasicWhoIsMessage', (msg: any) => {
                    //si perso pas dans le groupe
                    if (msg.playerState == 1) {
                        this.inviteToParty(name);
                    }
                });
            }
        });
    }

    private isBorder(cellId: number): Direction {
        if (1 <= cellId && cellId <= 13 ||
            15 <= cellId && cellId <= 26) {
            return "top";
        }

        if (547 <= cellId && cellId <= 559 ||
            533 <= cellId && cellId <= 545) {
            return "bottom";
        }

        if (cellId % 28 == 0 ||
            cellId % 28 == 14) {
            return "left";
        }
        if (cellId % 28 == 27 ||
            cellId % 28 == 13) {
            return "right"
        }

        return false;
    }

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
                } else {
                    setTimeout(callback, 100 + Math.random() * 700);
                }
            }
            setTimeout(changeMapRetry, 1200);
        };
        this.once(this.wGame.dofus.connectionManager, "MapComplementaryInformationsWithCoordsMessage", onChange);
        this.once(this.wGame.dofus.connectionManager, "MapComplementaryInformationsDataMessage", onChange);
    };

    private isPartyLeader(): boolean {
        if (Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0) {
            let party = this.wGame.gui.playerData.partyData._partyFromId[Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]];
            if (party._leaderId === this.wGame.gui.playerData.id) {
                return true;
            }
        }
        return false;
    }

    private getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private checkFollow(): void {
        if (this.leaderId && this.didLeaderChange()) {
            this.path = [];
            this.checkFollow();
        }
        else {
            if (!this.isPartyLeader()) {
                if (this.path.length > 0) {
                    this.skipCellFollowAfterMapChanged();
                    this.log('⚡ ' + this.path[0].type + ' on ' + this.path[0].mapId + ' (' + (this.path.length - 1) + ' left)');
                    this.processFollow(this.path[0], () => {
                        if (!this.idle) {
                            this.log('OK');
                            this.lastType = this.path[0].type;
                            this.log('CLEAR (success) ' + this.objectToString(this.path.shift()));
                            if (this.lastType != 'cell') this.movedOnRandomCell = false;
                            if (this.path.length > 0) {
                                setTimeout(() => {
                                    this.checkFollow();
                                }, 900 / ((this.path.length) + 1) + Math.random() * 400);
                            }
                            else this.turnIdle();
                        }
                    }, (reason: string = '') => {
                        this.log('Nope... (' + reason + ')');
                        this.turnIdle();
                    });
                }
                else this.turnIdle();
            }
            else this.turnIdle();
        }
    }

    private turnIdle(): void {
        this.idle = true;
        this.lastType = null;
        this.path = [];
        if (!this.isPartyLeader() && !this.params.follow_on_map) {
            setTimeout(() => {
                if (!this.movedOnRandomCell && this.idle && this.wGame.gui.fightManager.fightState < 0) {
                    this.movedOnRandomCell = true;
                    if (Math.random() > 0.2) this.moveToRandomCellOnMap();
                }
            }, this.getRandomTime(2, 5));
        }
    }

    private moveToRandomCellOnMap(): void {
        let width = this.wGame.isoEngine.mapRenderer.grid.grid.length;
        let height = this.wGame.isoEngine.mapRenderer.grid.grid[0].length;
        let x = null;
        let y = null;
        let flags = null;
        let cellId = null;
        let count = 0;
        while (cellId == null) {
            if (count++ > 100) return;
            x = Math.floor(Math.random() * (width - 20)) + 10;
            y = Math.floor(Math.random() * (height - 20)) + 10;
            cellId = this.wGame.isoEngine.mapRenderer.grid.grid[x][y].cellId || null;
            flags = this.wGame.isoEngine.mapRenderer.getChangeMapFlags(cellId);
            if (this.wGame.isoEngine.actorManager.getOccupiedCells(cellId)
                || flags["bottom"] || flags["top"] || flags["right"] || flags["left"]
                || !this.wGame.isoEngine.mapRenderer.isWalkable(cellId)) cellId = null;
        }
        if (cellId) {
            this.path.push({
                type: 'cell',
                mapId: this.wGame.isoEngine.mapRenderer.mapId,
                cellId: cellId
            });
            this.checkFollow();
        }
    }

    private didLeaderChange(): boolean {
        let hasChanged = false;
        if (Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0) {
            let party = this.wGame.gui.playerData.partyData._partyFromId[Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]];
            if (party._leaderId !== this.leaderId) {
                this.leaderId = party._leaderId;
                return true;
            }
            else return false;
        }
        this.leaderId = null;
        return true;
    }

    private processFollow(followInstruction: any, success: any, fail: any): void {
        this.idle = false;
        if (followInstruction.mapId == this.wGame.isoEngine.mapRenderer.mapId && this.wGame.gui.fightManager.fightState < 0) {
            if ('map' == followInstruction.type) {
                let cell = followInstruction.cellId;
                let dir = this.isBorder(followInstruction.cellId);
                if (!this.params.strict_move) {
                    let cells = null;
                    switch(dir) {
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
                        fail('The given cellId is not a border cell');
                        Logger.info('Failed to change map with cellId ' + followInstruction.cellId);
                        return;
                    }
                    cell = this.pickNeighbourBorderCell(cells, followInstruction.cellId);
                }
                let move = () => {
                    let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cell);
                    let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                    this.wGame.isoEngine.gotoNeighbourMap(dir, cell, Math.floor(pos.x), Math.floor(pos.y));
                };
                this.onMapChange(success, fail);
                if (this.wGame.isoEngine.actorManager.userActor.moving) this.wGame.isoEngine.actorManager.userActor.cancelMovement(move);
                else move();
            } else if ('cell' == followInstruction.type || 'sun' == followInstruction.type) {
                let cell = (!this.params.strict_move && followInstruction.type != 'sun') ? this.pickNeighbourCell(followInstruction.cellId) : followInstruction.cellId;
                let moveSuccess = false;
                let checkMovement = () => {
                    if (this.wGame.isoEngine.actorManager.userActor.moving) {
                        setTimeout(checkMovement, 1000);
                    }
                    else if (!moveSuccess) fail('Move to cell timeout');
                };
                setTimeout(checkMovement, 3000);
                let move = () => {
                    this.wGame.isoEngine._movePlayerOnMap(cell, false, () => {
                        moveSuccess = true;
                        if (followInstruction.type == 'sun') {
                            this.onMapChange(success, fail);
                        }
                        else success();
                    });
                };
                if (this.wGame.isoEngine.actorManager.userActor.moving) this.wGame.isoEngine.actorManager.userActor.cancelMovement(move);
                else move();
            } else if ('interactive' == followInstruction.type) {
                let moveSuccess = false;
                let checkMovement = () => {
                    if (this.wGame.isoEngine.actorManager.userActor.moving) {
                        setTimeout(checkMovement, 1000);
                    }
                    else if (!moveSuccess) fail('Use interactive timeout');
                };
                setTimeout(checkMovement, 3000);
                this.once(this.wGame.dofus.connectionManager, 'InteractiveUsedMessage', (msg) => {
                    if (msg.elemId == followInstruction.elemId && msg.entityId == this.wGame.gui.playerData.id) {
                        moveSuccess = true;
                        this.onMapChange(success, fail);
                    }
                });
                this.wGame.isoEngine.useInteractive(followInstruction.elemId, followInstruction.skillInstanceUid);
            } else {
                fail('Unknown follow type');
            }
        }
        else {
            this.log(followInstruction.mapId + ' != ' + this.wGame.isoEngine.mapRenderer.mapId);
            fail('Mapid not matching or character in fight');
        }
    }

    private pickNeighbourCell(cellId: number): number {
        let pickedCell = null;
        let steps = [-15, -1, 13, 28, 14, 1, -14, -28];
        let step = null;
        let occupiedCells = this.getMonsterGroupBossCells();
        do {
            if (pickedCell && step) steps.splice(steps.indexOf(step), 1);
            step = (steps.length > 0) ? steps[this.getRandomInt(0, steps.length - 1)] : null;
            pickedCell = (steps.length > 0) ? cellId + steps[this.getRandomInt(0, steps.length - 1)] : null;
        } while(steps.length > 0 && (!this.wGame.isoEngine.mapRenderer.map.cells[pickedCell] || !this.wGame.isoEngine.mapRenderer.isWalkable(pickedCell) || occupiedCells.indexOf(pickedCell) !== -1))
        return (pickedCell !== null) ? pickedCell : cellId;
    }

    private pickNeighbourBorderCell(cells: any, cellId: number): number {
        let ind = cells.indexOf(cellId);
        let occupiedCells = this.getMonsterGroupBossCells();
        if (ind) {
            let slice = cells.slice(Math.max(0, ind - 4), Math.min(ind + 5, cells.length));
            let pickedCell = null;
            do {
                if (pickedCell) slice.splice(slice.indexOf(pickedCell), 1);
                pickedCell = (slice.length > 0) ? slice[this.getRandomInt(0, slice.length - 1)] : null;
            } while(slice.length > 0 && (!this.wGame.isoEngine.mapRenderer.map.cells[pickedCell] || !this.wGame.isoEngine.mapRenderer.isWalkable(pickedCell) || occupiedCells.indexOf(pickedCell) !== -1))
            return (slice.length > 0) ? pickedCell : cellId;
        }
        else return cellId;
    }

    private pushMapPath(msg: any): void {
        if (this.isPartyLeader()) {
            if (this.skipNextMapChange) {
                this.skipNextMapChange = false;
            }
            else {
                if (this.isBorder(this.wGame.isoEngine.actorManager.userActor.cellId)) {
                    this.addToPath({
                        type: 'map',
                        mapId: this.wGame.isoEngine.mapRenderer.mapId,
                        cellId: this.wGame.isoEngine.actorManager.userActor.cellId
                    });
                }
                else {
                    this.addToPath({
                        type: 'sun',
                        mapId: this.wGame.isoEngine.mapRenderer.mapId,
                        cellId: this.wGame.isoEngine.actorManager.userActor.cellId
                    });
                }
            }
        }
    }

    private pushCellPath(msg: any): void {
        if (this.isPartyLeader() && msg.actorId == this.wGame.gui.playerData.id) {
            let destinationCellId = msg.keyMovements[msg.keyMovements.length - 1];
            let direction = this.isBorder(destinationCellId);
            if (!direction) {
                this.addToPath({
                    type: 'cell',
                    mapId: this.wGame.isoEngine.mapRenderer.mapId,
                    cellId: destinationCellId
                });
            }
        }
    }

    private pushInteractivePath(msg: any): void {
        if (this.isPartyLeader() && msg.entityId == this.wGame.gui.playerData.id) {
            let interactive = this.wGame.isoEngine.mapRenderer.interactiveElements[msg.elemId];
            let skillId = msg.skillId;
            if (skillId == 184) {
                let skillInstanceUid: any = null;
                for (let id in interactive.enabledSkills) {
                    if (interactive.enabledSkills[id].skillId == skillId) {
                        skillInstanceUid = interactive.enabledSkills[id].skillInstanceUid;
                        break;
                    }
                }
                if (skillInstanceUid && msg.elemId) {
                    this.skipNextMapChange = true;
                    this.addToPath({
                        type: 'interactive',
                        mapId: this.wGame.isoEngine.mapRenderer.mapId,
                        elemId: msg.elemId,
                        skillInstanceUid: skillInstanceUid
                    });
                }
            }
        }
    }

    private addToPath(followInstruction: any): void {
        this.log(this.objectToString(followInstruction));
        this.ipcRendererService.send('auto-group-push-path', followInstruction);
    }

    private skipCellFollowAfterMapChanged(): void {
        if (this.lastType !== 'cell') {
            // Skip every cellFollow
            while (this.path.length > 1 && this.path[0].type === 'cell') {
                this.log('CLEAR (skip) ' + this.objectToString(this.path.shift()));
            }
        }
    }

    private getMonsterGroupBossCells(): any {
        let cells = [];
        let actors = this.wGame.isoEngine.actorManager.getIndexedVisibleActors();
        for (var id in actors) {
            if (actors[id].data.type == "GameRolePlayGroupMonsterInformations" && actors[id].groupBoss == null) {
                cells.push(actors[id].cellId);
            }
        }
        return cells;
    }

    public followLeader(skipLogin: boolean = false): void {
        let onCharacterSelectedSuccess = () => {
            try {
                this.turnIdle();
                this.on(this.ipcRendererService, 'auto-group-push-path', (event: Event, followInstruction: any) => {
                    this.log('Got event! ' + followInstruction.type + ' on ' + followInstruction.mapId);
                     if (followInstruction.type != 'cell' || this.params.follow_on_map) {
                        if (this.didLeaderChange()) this.turnIdle();
                        this.path.push(followInstruction);
                        setTimeout(() => {
                            if (this.idle) this.checkFollow();
                        }, this.getRandomTime(1, 2));
                    }
                });

                let onGameMapMovementMessage = (msg: any) => {
                    this.pushCellPath(msg);
                };

                let onInteractiveUsedMessage = (msg: any) => {
                    this.pushInteractivePath(msg);
                };

                let onCurrentMapMessage = (msg: any) => {
                    this.pushMapPath(msg);
                };

                let onGameFightStartingMessage = (msg: any) => {
                    this.turnIdle();
                };

                let onGameFightEndMessage = (msg: any) => {
                    this.skipNextMapChange = true;
                };

                setTimeout(() => {
                    this.on(this.wGame.dofus.connectionManager, 'GameMapMovementMessage', onGameMapMovementMessage);
                    this.on(this.wGame.dofus.connectionManager, 'InteractiveUsedMessage', onInteractiveUsedMessage);
                    this.on(this.wGame.dofus.connectionManager, 'CurrentMapMessage', onCurrentMapMessage);
                    this.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', onGameFightStartingMessage);
                    this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', onGameFightEndMessage);
                }, this.getRandomTime(1, 2));
            } catch (e) {
                Logger.info(e);
            }
        };

        if (skipLogin) {
            onCharacterSelectedSuccess();
        }

        this.on(this.wGame.gui.playerData, "characterSelectedSuccess", onCharacterSelectedSuccess);
    }

    public autoEnterFight(skipLogin: boolean = false) {
        try {
            let joinFight = (fightId: number, fighterId: number) => {
                if (this.isPvMFight(fightId)) {
                    this.turnIdle();
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            this.wGame.dofus.sendMessage("GameFightJoinRequestMessage", { fightId, fighterId });
                            setTimeout(() => {
                                resolve();
                            }, 1500);
                        }, this.getRandomTime(1, 3));
                    });
                } else {
                    this.wGame.gui.chat.logMsg(this.translate.instant('app.option.vip.auto-group.pvp-warning'));
                }
            };

            let ready = () => {
                return new Promise((resolve, reject) => {
                    if (this.wGame.gui.fightManager.fightState == 0) {
                        setTimeout(() => {
                            this.wGame.dofus.sendMessage("GameFightReadyMessage", { isReady: true });
                            setTimeout(() => {
                                resolve();
                            }, 200);
                        }, this.getRandomTime(1, 4));
                    }
                });
            };

            let onPartyMemberInFightMessage = (msg: any) => {
                if (this.wGame.isoEngine.mapRenderer.mapId === msg.fightMap.mapId) {
                    joinFight(msg.fightId, msg.memberId)
                        .then(() => {
                            if (this.params.ready)
                                return ready();
                            else
                                return;
                        });
                }
            };

            let onMapComplementaryInformationsDataMessage = (msg: any) => {
                this.didLeaderChange();
                for (var idF in msg.fights) {
                    for (var idT in msg.fights[idF].fightTeams) {
                        if (msg.fights[idF].fightTeams[idT].leaderId == this.leaderId) {
                            this.turnIdle();
                            setTimeout(() => {
                                joinFight(msg.fights[idF].fightId, msg.fights[idF].fightTeams[idT].leaderId)
                                    .then(() => {
                                        if (this.params.ready)
                                            return ready();
                                        else
                                            return;
                                    });
                            }, this.getRandomTime(1, 2));
                            return;
                        }
                    }
                }
            };

            setTimeout(() => {
                this.on(this.wGame.dofus.connectionManager, "PartyMemberInFightMessage", onPartyMemberInFightMessage);
                this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', onMapComplementaryInformationsDataMessage);
                this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsWithCoordsMessage', onMapComplementaryInformationsDataMessage);
            }, this.getRandomTime(1, 2));
        } catch (e) {
            Logger.info(e);
        }
    }

    private isPvMFight(fightId: number): boolean {
        let fight0 = this.wGame.isoEngine.actorManager.actors['fight:' + fightId + ':0'];
        let fight1 = this.wGame.isoEngine.actorManager.actors['fight:' + fightId + ':1'];
        if (fight0 && fight1) {
            return fight0.data.teamTypeId == 1 || fight1.data.teamTypeId == 1;
        }
        else return false;
    }

    private log(msg: string): void {
        // Logger.info(this.wGame.gui.playerData.characterBaseInformations.name + ': ' + msg);
    }

    private objectToString(obj: any): string {
        let str = '{ ';
        for (var id in obj) {
            str += id + ': ' + obj[id] + ', ';
        }
        str = str.substr(0, str.length - 2) + ' }';
        return str;
    }
}
