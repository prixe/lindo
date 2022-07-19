import {
  ConnectionManagerEvents,
  DofusWindow,
  GameMapMovementMessage,
  InteractiveUsedMessage,
  MapComplementaryInformationsDataMessage,
  MapComplementaryInformationsWithCoordsMessage,
  MapDirection,
  PartyMemberInFightMessage,
  PlayerDataEvents
} from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { FollowInstruction } from '@lindo/shared'
import { EventManager, PathFinder } from '../helpers'
import { Mod } from '../mod'

export class AutoGroupMod extends Mod {
  private idle: boolean = true
  private skipNextMapChange: boolean = false

  private path: Array<FollowInstruction> = []
  private leaderId?: number
  private lastType?: string
  private movedOnRandomCell: boolean = true

  private readonly settingDisposer: () => void
  private _disposers: Array<() => void> = []
  private readonly pathFinder = new PathFinder()
  private readonly eventManager = new EventManager()

  private get _options() {
    return this.rootStore.optionStore.gameGroup
  }

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(this.rootStore.optionStore.gameGroup, (change) => {
      if (change.name === 'autoGrouping' || change.name === 'followLeader' || change.name === 'enterGroupFight') {
        this._stop()
        this._start()
      }
    })
    this._start()
  }

  private _start() {
    if (this._options.autoGrouping) {
      console.info('- Auto-Group enable')
      // le leader invite les membres
      this.autoMasterParty()

      // acceptation de l'invitation automatiquement
      this.autoAcceptPartyInvitation()
    }

    // suit le leader automatiquement
    if (this._options.followLeader) {
      this.followLeader(this.wGame.gui.isConnected)
    }

    // entre en combat automatiquement
    if (this._options.enterGroupFight) {
      this.autoEnterFight()
    }
  }

  public autoMasterParty() {
    try {
      setTimeout(() => {
        if (
          this._options.autoGroupLeaderName === this.wGame.gui.playerData.characterBaseInformations.name &&
          this._options.autoGroupMembersName.length > 0
        ) {
          console.info('start master party')

          const idInt = setInterval(() => {
            this.masterParty(this._options.autoGroupMembersName)
          }, this.getRandomTime(5, 7))

          this._disposers.push(() => {
            clearInterval(idInt)
          })
        }
      }, this.getRandomTime(2, 3))
    } catch (e) {
      console.error(e)
    }
  }

  private inviteToParty(name: string): void {
    this.wGame.dofus.sendMessage('PartyInvitationRequestMessage', { name })
  }

  private acceptPartyInvitation(partyId: number): void {
    this.wGame.dofus.sendMessage('PartyAcceptInvitationMessage', { partyId })
  }

  public autoAcceptPartyInvitation(): void {
    try {
      setTimeout(() => {
        this.eventManager.on<ConnectionManagerEvents, 'PartyInvitationMessage'>(
          this.wGame.dofus.connectionManager,
          'PartyInvitationMessage',
          (msg) => {
            if (this._options.autoGroupLeaderName === msg.fromName) {
              this.acceptPartyInvitation(msg.partyId)
            }
          }
        )
      }, this.getRandomTime(1, 2))
    } catch (e) {
      console.error(e)
    }
  }

  public getPartyMembers(): Array<string> {
    const party = []
    // si dans un groupe
    if (
      this.wGame.gui.playerData.partyData &&
      Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0
    ) {
      // recup des membres du grp
      const partyMembers =
        this.wGame.gui.playerData.partyData._partyFromId[
          Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]
        ]._members
      // mise en forme
      for (const player in partyMembers) {
        party.push(partyMembers[player].name)
      }
    }

    return party
  }

  private masterParty(nameList: Array<string>) {
    const partyMembers = this.getPartyMembers()
    nameList.forEach((name) => {
      if (!partyMembers.includes(name)) {
        this.wGame.dofus.sendMessage('BasicWhoIsRequestMessage', {
          search: name,
          verbose: true
        })

        this.eventManager.once<ConnectionManagerEvents, 'BasicWhoIsMessage'>(
          this.wGame.dofus.connectionManager,
          'BasicWhoIsMessage',
          (msg) => {
            // si perso pas dans le groupe
            if (msg.playerState === 1) {
              this.inviteToParty(name)
            }
          }
        )
      }
    })
  }

  private static isBorder(cellId: number): MapDirection | undefined {
    if ((cellId >= 1 && cellId <= 13) || (cellId >= 15 && cellId <= 26)) {
      return 'top'
    }

    if ((cellId >= 547 && cellId <= 559) || (cellId >= 533 && cellId <= 545)) {
      return 'bottom'
    }

    if (cellId % 28 === 0 || cellId % 28 === 14) {
      return 'left'
    }
    if (cellId % 28 === 27 || cellId % 28 === 13) {
      return 'right'
    }
  }

  private static getTopCells(): Array<number> {
    return [1, 15, 2, 16, 3, 17, 4, 18, 5, 19, 6, 20, 7, 21, 8, 22, 9, 23, 10, 24, 11, 25, 12, 26, 13]
  }

  private static getBottomCells(): Array<number> {
    return [
      533, 547, 534, 548, 535, 549, 536, 550, 537, 551, 538, 552, 539, 553, 540, 554, 541, 555, 542, 556, 543, 557, 544,
      558, 545, 559
    ]
  }

  private static getLeftCells(): Array<number> {
    return [
      0, 14, 28, 42, 56, 70, 84, 98, 112, 126, 140, 154, 168, 182, 196, 210, 224, 238, 252, 266, 280, 294, 308, 322,
      336, 350, 364, 378, 392, 406, 420, 434, 448, 462, 476, 490, 504, 518, 532, 546
    ]
  }

  private static getRightCells(): Array<number> {
    return [
      13, 27, 41, 55, 69, 83, 97, 111, 125, 139, 153, 167, 181, 195, 209, 223, 251, 279, 307, 321, 335, 349, 363, 377,
      391, 405, 419, 433, 447, 475, 489, 503, 517, 531, 545, 559
    ]
  }

  private onMapChange(callback: () => void, fail: (error: string) => void): void {
    const previousMap = this.wGame.isoEngine.mapRenderer.mapId
    const changeTimeout = setTimeout(() => {
      if (fail) fail('Map change timeout')
    }, 15000)
    const onChange = () => {
      this.wGame.dofus.connectionManager.removeListener('MapComplementaryInformationsWithCoordsMessage', onChange)
      this.wGame.dofus.connectionManager.removeListener('MapComplementaryInformationsDataMessage', onChange)
      clearTimeout(changeTimeout)
      const changeMapRetry = () => {
        if (
          this.wGame.isoEngine.actorManager.getActor(this.wGame.isoEngine.actorManager.userId).moving ||
          previousMap === this.wGame.isoEngine.mapRenderer.mapId
        ) {
          setTimeout(changeMapRetry, 300)
        } else {
          setTimeout(callback, 100 + Math.random() * 700)
        }
      }
      setTimeout(changeMapRetry, 1200)
    }
    this.eventManager.once<ConnectionManagerEvents, 'MapComplementaryInformationsWithCoordsMessage'>(
      this.wGame.dofus.connectionManager,
      'MapComplementaryInformationsWithCoordsMessage',
      onChange
    )
    this.eventManager.once<ConnectionManagerEvents, 'MapComplementaryInformationsDataMessage'>(
      this.wGame.dofus.connectionManager,
      'MapComplementaryInformationsDataMessage',
      onChange
    )
  }

  private isPartyLeader(): boolean {
    if (
      this.wGame.gui.playerData.partyData &&
      Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0
    ) {
      const party =
        this.wGame.gui.playerData.partyData._partyFromId[
          Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]
        ]
      if (party._leaderId === this.wGame.gui.playerData.id) {
        return true
      }
    }
    return false
  }

  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private checkFollow(): void {
    if (this.leaderId && this.didLeaderChange()) {
      this.path = []
      this.checkFollow()
    } else {
      if (!this.isPartyLeader()) {
        if (this.path.length > 0) {
          this.skipCellFollowAfterMapChanged()
          this.log('⚡ ' + this.path[0].type + ' on ' + this.path[0].mapId + ' (' + (this.path.length - 1) + ' left)')
          this.processFollow(
            this.path[0],
            () => {
              if (!this.idle) {
                this.log('OK')
                this.lastType = this.path[0].type
                this.log('CLEAR (success) ' + AutoGroupMod.objectToString(this.path.shift()!))
                if (this.lastType !== 'cell') this.movedOnRandomCell = false
                if (this.path.length > 0) {
                  setTimeout(() => {
                    this.checkFollow()
                  }, 900 / (this.path.length + 1) + Math.random() * 400)
                } else this.turnIdle()
              }
            },
            (reason: string = '') => {
              this.log('Nope... (' + reason + ')')
              this.turnIdle()
            }
          )
        } else this.turnIdle()
      } else this.turnIdle()
    }
  }

  private turnIdle(): void {
    this.idle = true
    this.lastType = undefined
    this.path = []
    if (!this.isPartyLeader() && !this._options.followLeaderOnMap) {
      setTimeout(() => {
        if (!this.movedOnRandomCell && this.idle && this.wGame.gui.fightManager.fightState < 0) {
          this.movedOnRandomCell = true
          if (Math.random() > 0.2) this.moveToRandomCellOnMap()
        }
      }, this.getRandomTime(2, 5))
    }
  }

  private moveToRandomCellOnMap(): void {
    const width = this.wGame.isoEngine.mapRenderer.grid.grid.length
    const height = this.wGame.isoEngine.mapRenderer.grid.grid[0].length
    let x = null
    let y = null
    let flags = null
    let cellId: number | null = null
    let count = 0
    while (cellId == null) {
      if (count++ > 100) return
      x = Math.floor(Math.random() * (width - 20)) + 10
      y = Math.floor(Math.random() * (height - 20)) + 10
      cellId = this.wGame.isoEngine.mapRenderer.grid.grid[x][y].cellId || null
      flags = this.wGame.isoEngine.mapRenderer.getChangeMapFlags(cellId)
      if (
        this.wGame.isoEngine.actorManager.getOccupiedCells(cellId) ||
        flags.bottom ||
        flags.top ||
        flags.right ||
        flags.left ||
        !this.wGame.isoEngine.mapRenderer.isWalkable(cellId)
      )
        cellId = null
    }
    if (cellId) {
      this.path.push({
        type: 'cell',
        mapId: this.wGame.isoEngine.mapRenderer.mapId,
        cellId
      })
      this.checkFollow()
    }
  }

  private didLeaderChange(): boolean {
    if (
      this.wGame.gui.playerData.partyData &&
      Object.keys(this.wGame.gui.playerData.partyData._partyFromId).length !== 0
    ) {
      const party =
        this.wGame.gui.playerData.partyData._partyFromId[
          Object.keys(this.wGame.gui.playerData.partyData._partyFromId)[0]
        ]
      if (party._leaderId !== this.leaderId) {
        this.leaderId = party._leaderId
        return true
      } else return false
    }
    this.leaderId = undefined
    return true
  }

  private getClosestCellToChangeMapRandomized(
    cells: Array<number>,
    cellIdFollowInstruction: number,
    direc: MapDirection
  ): number | undefined {
    // a quoi sert réellement cellIdFollowInstruction ????
    const occupiedCells = this.wGame.isoEngine.actorManager._occupiedCells
    const currentCellId = this.wGame.isoEngine.actorManager.userActor.cellId
    if (!currentCellId) {
      return undefined
    }
    const canMoveDiagonally = this.wGame.isoEngine.actorManager.userActor.canMoveDiagonally

    const tableau: Array<[Array<number>, number]> = []

    for (let i = 0; i < cells.length; i++) {
      const cellId = cells[i]
      if (!this.wGame.isoEngine.mapRenderer.getChangeMapFlags(cellId)[direc]) {
        continue
      }
      if (this.isMobOnCell(cellId) || !this.isCellOnMap(cellId) || !this.isCellWalkable(cellId)) {
        continue
      }
      this.pathFinder.resetPath()
      this.pathFinder.fillPathGrid(this.wGame.isoEngine.mapRenderer.map)
      const path = this.pathFinder.getPath(currentCellId, cellId, occupiedCells, canMoveDiagonally, false)

      if (
        path[path.length - 1] === cellId /* && (!finalPath || (path.length < finalPath.length && path.length > 1)) */
      ) {
        tableau.push([path, path[path.length - 1]])
      }
    }
    if (tableau.length === 0) {
      console.error("No way, I can't go there")
      return undefined
    }
    tableau.sort((a, b) => {
      const aa = a[0].length
      const bb = b[0].length
      return aa - bb
    })
    if (tableau.length > 5) {
      return tableau[AutoGroupMod.getRandomInt(0, 5)][1]
    } else {
      return tableau[AutoGroupMod.getRandomInt(0, tableau.length - 1)][1]
    }
  }

  private processFollow(followInstruction: FollowInstruction, success: () => void, fail: (err: string) => void): void {
    this.idle = false
    if (
      followInstruction.mapId === this.wGame.isoEngine.mapRenderer.mapId &&
      this.wGame.gui.fightManager.fightState < 0
    ) {
      if (followInstruction.type === 'map') {
        let cell = followInstruction.cellId
        const dir = AutoGroupMod.isBorder(followInstruction.cellId)
        if (!this._options.followStrictMove) {
          let cells = null
          switch (dir) {
            case 'top':
              cells = AutoGroupMod.getTopCells()
              break
            case 'bottom':
              cells = AutoGroupMod.getBottomCells()
              break
            case 'left':
              cells = AutoGroupMod.getLeftCells()
              break
            case 'right':
              cells = AutoGroupMod.getRightCells()
              break
            default:
              fail('The given cellId is not a border cell')
              console.info('Failed to change map with cellId ' + followInstruction.cellId)
              return
          }
          cell = this.getClosestCellToChangeMapRandomized(cells, followInstruction.cellId, dir)!
        }
        const move = () => {
          const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cell)
          const pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y)
          if (dir) this.wGame.isoEngine.gotoNeighbourMap(dir, cell, Math.floor(pos.x), Math.floor(pos.y))
        }
        this.onMapChange(success, fail)
        if (this.wGame.isoEngine.actorManager.userActor.moving)
          this.wGame.isoEngine.actorManager.userActor.cancelMovement(move)
        else move()
      } else if (followInstruction.type === 'cell' || followInstruction.type === 'sun') {
        const cell =
          !this._options.followStrictMove && followInstruction.type !== 'sun'
            ? this.pickNeighborCell(followInstruction.cellId)
            : followInstruction.cellId
        let moveSuccess = false
        const checkMovement = () => {
          if (this.wGame.isoEngine.actorManager.userActor.moving) {
            setTimeout(checkMovement, 1000)
          } else if (!moveSuccess) fail('Move to cell timeout')
        }
        setTimeout(checkMovement, 3000)
        const move = () => {
          this.wGame.isoEngine._movePlayerOnMap(cell, false, () => {
            moveSuccess = true
            if (followInstruction.type === 'sun') {
              this.onMapChange(success, fail)
            } else success()
          })
        }
        if (this.wGame.isoEngine.actorManager.userActor.moving)
          this.wGame.isoEngine.actorManager.userActor.cancelMovement(move)
        else move()
      } else if (followInstruction.type === 'interactive') {
        let moveSuccess = false
        const checkMovement = () => {
          if (this.wGame.isoEngine.actorManager.userActor.moving) {
            setTimeout(checkMovement, 1000)
          } else if (!moveSuccess) fail('Use interactive timeout')
        }
        setTimeout(checkMovement, 3000)
        this.eventManager.once<ConnectionManagerEvents, 'InteractiveUsedMessage'>(
          this.wGame.dofus.connectionManager,
          'InteractiveUsedMessage',
          (msg) => {
            if (msg.elemId === followInstruction.elemId && msg.entityId === this.wGame.gui.playerData.id) {
              moveSuccess = true
              this.onMapChange(success, fail)
            }
          }
        )
        this.wGame.isoEngine.useInteractive(followInstruction.elemId!, followInstruction.skillInstanceUid)
      } else {
        fail('Unknown follow type')
      }
    } else {
      this.log(followInstruction.mapId + ' != ' + this.wGame.isoEngine.mapRenderer.mapId)
      fail('Mapid not matching or character in fight')
    }
  }

  private isCellOnMap(cell: number): boolean {
    return !!this.wGame.isoEngine.mapRenderer.map.cells[cell]
  }

  private isCellWalkable(cell: number): boolean {
    return this.wGame.isoEngine.mapRenderer.isWalkable(cell)
  }

  private isMobOnCell(cellId: number) {
    const occupiedCells = this.wGame.isoEngine.actorManager._occupiedCells
    if (occupiedCells[cellId]) {
      for (let j = 0; j < occupiedCells[cellId].length; j++) {
        if (occupiedCells[cellId][j].actorId < 0) {
          return true
        }
      }
    }
    return false
  }

  private pickNeighborCell(cellId: number): number {
    let pickedCell: number | undefined
    const steps = [-15, -1, 13, 28, 14, 1, -14, -28]
    let step = null
    const occupiedCells = this.getMonsterGroupBossCells()
    do {
      if (pickedCell && step) steps.splice(steps.indexOf(step), 1)
      step = steps.length > 0 ? steps[AutoGroupMod.getRandomInt(0, steps.length - 1)] : null
      pickedCell = steps.length > 0 ? cellId + steps[AutoGroupMod.getRandomInt(0, steps.length - 1)] : undefined
    } while (
      steps.length > 0 &&
      ((pickedCell && !this.wGame.isoEngine.mapRenderer.map.cells[pickedCell]) ||
        (pickedCell && !this.wGame.isoEngine.mapRenderer.isWalkable(pickedCell)) ||
        occupiedCells.indexOf(pickedCell!) !== -1)
    )
    return pickedCell ?? cellId
  }

  private pushMapPath(): void {
    if (this.isPartyLeader()) {
      if (this.skipNextMapChange) {
        this.skipNextMapChange = false
      } else {
        if (AutoGroupMod.isBorder(this.wGame.isoEngine.actorManager.userActor.cellId)) {
          this.addToPath({
            type: 'map',
            mapId: this.wGame.isoEngine.mapRenderer.mapId,
            cellId: this.wGame.isoEngine.actorManager.userActor.cellId
          })
        } else {
          this.addToPath({
            type: 'sun',
            mapId: this.wGame.isoEngine.mapRenderer.mapId,
            cellId: this.wGame.isoEngine.actorManager.userActor.cellId
          })
        }
      }
    }
  }

  private pushCellPath(msg: GameMapMovementMessage): void {
    if (this.isPartyLeader() && msg.actorId === this.wGame.gui.playerData.id) {
      const destinationCellId = msg.keyMovements[msg.keyMovements.length - 1]
      const direction = AutoGroupMod.isBorder(destinationCellId)
      if (!direction) {
        this.addToPath({
          type: 'cell',
          mapId: this.wGame.isoEngine.mapRenderer.mapId,
          cellId: destinationCellId
        })
      }
    }
  }

  private pushInteractivePath(msg: InteractiveUsedMessage): void {
    if (this.isPartyLeader() && msg.entityId === this.wGame.gui.playerData.id) {
      const interactive = this.wGame.isoEngine.mapRenderer.interactiveElements[msg.elemId]
      const skillId = msg.skillId
      if (skillId === 184) {
        let skillInstanceUid
        for (const id in interactive.enabledSkills) {
          if (interactive.enabledSkills[id].skillId === skillId) {
            skillInstanceUid = interactive.enabledSkills[id].skillInstanceUid
            break
          }
        }
        if (skillInstanceUid && msg.elemId) {
          this.skipNextMapChange = true
          this.addToPath({
            type: 'interactive',
            mapId: this.wGame.isoEngine.mapRenderer.mapId,
            elemId: msg.elemId,
            skillInstanceUid
          })
        }
      }
    }
  }

  private addToPath(followInstruction: FollowInstruction): void {
    this.log(AutoGroupMod.objectToString(followInstruction))
    window.lindoAPI.sendAutoGroupPathInstruction(followInstruction)
  }

  private skipCellFollowAfterMapChanged(): void {
    if (this.lastType !== 'cell') {
      // Skip every cellFollow
      while (this.path.length > 1 && this.path[0].type === 'cell') {
        this.log('CLEAR (skip) ' + AutoGroupMod.objectToString(this.path.shift()!))
      }
    }
  }

  private getMonsterGroupBossCells() {
    const cells = []
    const actors = this.wGame.isoEngine.actorManager.getIndexedVisibleActors()
    for (const id in actors) {
      const actor = actors[id].data
      if (actor.type === 'GameRolePlayGroupMonsterInformations' && !actor.groupBoss) {
        cells.push(actors[id].cellId)
      }
    }
    return cells
  }

  public followLeader(skipLogin: boolean = false): void {
    const onCharacterSelectedSuccess = () => {
      try {
        this.turnIdle()
        const disposer = window.lindoAPI.subscribeToAutoGroupPathInstruction((followInstruction: FollowInstruction) => {
          this.log('Got event! ' + followInstruction.type + ' on ' + followInstruction.mapId)
          if (followInstruction.type !== 'cell' || this._options.followLeaderOnMap) {
            if (this.didLeaderChange()) this.turnIdle()
            this.path.push(followInstruction)
            setTimeout(() => {
              if (this.idle) this.checkFollow()
            }, this.getRandomTime(1, 2))
          }
        })
        this._disposers.push(disposer)

        const onGameMapMovementMessage = (msg: GameMapMovementMessage) => {
          this.pushCellPath(msg)
        }

        const onInteractiveUsedMessage = (msg: InteractiveUsedMessage) => {
          this.pushInteractivePath(msg)
        }

        const onCurrentMapMessage = () => {
          this.pushMapPath()
        }

        const onGameFightStartingMessage = () => {
          this.turnIdle()
        }

        const onGameFightEndMessage = () => {
          this.skipNextMapChange = true
        }

        setTimeout(() => {
          this.eventManager.on<ConnectionManagerEvents, 'GameMapMovementMessage'>(
            this.wGame.dofus.connectionManager,
            'GameMapMovementMessage',
            onGameMapMovementMessage
          )
          this.eventManager.on<ConnectionManagerEvents, 'InteractiveUsedMessage'>(
            this.wGame.dofus.connectionManager,
            'InteractiveUsedMessage',
            onInteractiveUsedMessage
          )
          this.eventManager.on<ConnectionManagerEvents, 'CurrentMapMessage'>(
            this.wGame.dofus.connectionManager,
            'CurrentMapMessage',
            onCurrentMapMessage
          )
          this.eventManager.on<ConnectionManagerEvents, 'GameFightStartingMessage'>(
            this.wGame.dofus.connectionManager,
            'GameFightStartingMessage',
            onGameFightStartingMessage
          )
          this.eventManager.on<ConnectionManagerEvents, 'GameFightEndMessage'>(
            this.wGame.dofus.connectionManager,
            'GameFightEndMessage',
            onGameFightEndMessage
          )
        }, this.getRandomTime(1, 2))
      } catch (e) {
        console.error(e)
      }
    }

    if (skipLogin) {
      onCharacterSelectedSuccess()
    }

    this.eventManager.on<PlayerDataEvents, 'characterSelectedSuccess'>(
      this.wGame.gui.playerData,
      'characterSelectedSuccess',
      onCharacterSelectedSuccess
    )
  }

  public autoEnterFight() {
    try {
      const joinFight = (fightId: number, fighterId: number) => {
        if (this.isPvMFight(fightId)) {
          this.turnIdle()
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              this.wGame.dofus.sendMessage('GameFightJoinRequestMessage', { fightId, fighterId })
              setTimeout(() => {
                resolve()
              }, 1500)
            }, this.getRandomTime(1, 3))
          })
        } else {
          this.wGame.gui.chat.logMsg("You can't join a PvP fight automatically")
          return Promise.resolve()
        }
      }

      const ready = () => {
        return new Promise<void>((resolve) => {
          if (this.wGame.gui.fightManager.fightState === 0) {
            setTimeout(() => {
              this.wGame.dofus.sendMessage('GameFightReadyMessage', { isReady: true })
              setTimeout(() => {
                resolve()
              }, 200)
            }, this.getRandomTime(1, 4))
          }
        })
      }

      const onPartyMemberInFightMessage = (msg: PartyMemberInFightMessage) => {
        if (this.wGame.isoEngine.mapRenderer.mapId === msg.fightMap.mapId) {
          joinFight(msg.fightId, msg.memberId).then(() => {
            if (this._options.skipReadyInFight) return ready()
          })
        }
      }

      const onMapComplementaryInformationsDataMessage = (
        msg: MapComplementaryInformationsDataMessage | MapComplementaryInformationsWithCoordsMessage
      ) => {
        this.didLeaderChange()
        for (const idF in msg.fights) {
          for (const idT in msg.fights[idF].fightTeams) {
            if (msg.fights[idF].fightTeams[idT].leaderId === this.leaderId) {
              this.turnIdle()
              setTimeout(() => {
                joinFight(msg.fights[idF].fightId, msg.fights[idF].fightTeams[idT].leaderId).then(() => {
                  if (this._options.skipReadyInFight) return ready()
                })
              }, this.getRandomTime(1, 2))
              return
            }
          }
        }
      }

      setTimeout(() => {
        this.eventManager.on<ConnectionManagerEvents, 'PartyMemberInFightMessage'>(
          this.wGame.dofus.connectionManager,
          'PartyMemberInFightMessage',
          onPartyMemberInFightMessage
        )
        this.eventManager.on<ConnectionManagerEvents, 'MapComplementaryInformationsDataMessage'>(
          this.wGame.dofus.connectionManager,
          'MapComplementaryInformationsDataMessage',
          onMapComplementaryInformationsDataMessage
        )
        this.eventManager.on<ConnectionManagerEvents, 'MapComplementaryInformationsWithCoordsMessage'>(
          this.wGame.dofus.connectionManager,
          'MapComplementaryInformationsWithCoordsMessage',
          onMapComplementaryInformationsDataMessage
        )
      }, this.getRandomTime(1, 2))
    } catch (e) {
      console.error(e)
    }
  }

  private isPvMFight(fightId: number): boolean {
    const fight0 = this.wGame.isoEngine.actorManager.actors['fight:' + fightId + ':0']
    const fight1 = this.wGame.isoEngine.actorManager.actors['fight:' + fightId + ':1']
    if (fight0.data.type === 'FightTeamInformations' && fight1.data.type === 'FightTeamInformations') {
      return fight0.data.teamTypeId === 1 || fight1.data.teamTypeId === 1
    } else return false
  }

  private log(msg: string): void {
    console.log(msg)
    // Logger.info(this.wGame.gui.playerData.characterBaseInformations.name + ': ' + msg);
  }

  protected getRandomTime(min: number, max: number): number {
    if (this._options.disableTimer) {
      return 0
    } else {
      return Math.random() * (max * 1000 - min * 1000) + min * 1000
    }
  }

  private static objectToString<T extends object>(obj: T): string {
    let str = '{ '
    for (const id in obj) {
      str += id + ': ' + obj[id] + ', '
    }
    str = str.substr(0, str.length - 2) + ' }'
    return str
  }

  private _stop() {
    for (const disposer of this._disposers) {
      disposer()
    }
    this._disposers = []
    this.eventManager.close()
  }

  destroy(): void {
    this._stop()
    this.settingDisposer()
  }
}
