import {
  ConnectionManagerEvents,
  DofusWindow,
  _GameRolePlayGroupMonsterInformations,
  _MonsterInGroupAlternativeInformations,
  _MonsterInGroupInformations,
  _MonsterInGroupLightInformations,
  PartyFrom
} from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { EventManager, ignoreKeyboardEvent } from '../helpers'
import { Mod } from '../mod'

type TooltipData = {
  id: number
  groupLevel: number
  yellowStarsCount: number
  redStarsCount: number
  soloXp: number
  partyXp: number
  bonusPackActive: boolean
  monsters: Array<_MonsterInGroupInformations | _MonsterInGroupLightInformations>
}

export interface Monster {
  name: string
  level: number
  quantity: number
  isBoss: boolean
}

/*
Original work from : https://github.com/arcln/lindo/blob/master/src/app/core/mods/monsterTooltip/monsterTooltip.ts
*/

// Helper function similar to Math.floor
const toInt = (e: number) => {
  return e | 0
}

export class MonsterTooltipMod extends Mod {
  private visible = false
  private monsterGroups: Array<_GameRolePlayGroupMonsterInformations> = []
  private settingDisposer: () => void
  private shortcutDisposer?: () => void
  private eventManager = new EventManager()

  private static partySizeModifier = {
    1: 1,
    2: 1.1,
    3: 1.5,
    4: 2.3,
    5: 3.1,
    6: 3.6,
    7: 4.2,
    8: 4.7
  }

  private static alternativeModifier = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 5,
    6: 6,
    7: 7,
    8: 8
  }

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(
      this.rootStore.optionStore.gameFight,
      'monsterTooltip',
      () => {
        if (this.rootStore.optionStore.gameFight.monsterTooltip) this.start()
        else this.stop()
      },
      true
    )
  }

  private start(): void {
    console.info('- Enabled MonsterTooltip')

    const onKeyEvent = (event: KeyboardEvent) => {
      this.onKeyEvent(event)
    }

    this.wGame.addEventListener('keydown', onKeyEvent)
    this.wGame.addEventListener('keyup', onKeyEvent)

    this.shortcutDisposer = () => {
      this.wGame.removeEventListener('keydown', onKeyEvent)
      this.wGame.removeEventListener('keyup', onKeyEvent)
    }

    const monsterTooltipCss = document.createElement('style')
    monsterTooltipCss.id = 'monsterTooltipCss'
    monsterTooltipCss.innerHTML = `
                .mtt-bossLine {
                    color: #A69FFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mtt-bossIcon {
                    background-image: url('./assets/ui/bossIcon.png');
                    background-size: 17px 12px;
                    width: 17px;
                    height: 12px;
                }
            `
    this.wGame.document.getElementsByTagName('head')[0].appendChild(monsterTooltipCss)

    this.eventManager.on<ConnectionManagerEvents, 'MapComplementaryInformationsDataMessage'>(
      this.wGame.dofus.connectionManager,
      'MapComplementaryInformationsDataMessage',
      ({ actors }) => {
        this.monsterGroups = actors.filter(
          (actor) => actor._type === 'GameRolePlayGroupMonsterInformations'
        ) as Array<_GameRolePlayGroupMonsterInformations>
        this.update()
      }
    )

    this.eventManager.on<ConnectionManagerEvents, 'GameMapMovementMessage'>(
      this.wGame.dofus.connectionManager,
      'GameMapMovementMessage',
      ({ actorId, keyMovements }) => {
        const group = this.monsterGroups.find((group) => group.contextualId === actorId)
        if (group) {
          group.disposition.cellId = keyMovements[keyMovements.length - 1]
          this.update()
        }
      }
    )

    this.eventManager.on<ConnectionManagerEvents, 'GameContextRemoveElementMessage'>(
      this.wGame.dofus.connectionManager,
      'GameContextRemoveElementMessage',
      ({ id }) => {
        const groupIndex = this.monsterGroups.findIndex((group) => group.contextualId === id)
        if (groupIndex > -1) {
          this.monsterGroups.splice(groupIndex, 1)
          this.update()
        }
      }
    )

    this.eventManager.on<ConnectionManagerEvents, 'GameRolePlayShowActorMessage'>(
      this.wGame.dofus.connectionManager,
      'GameRolePlayShowActorMessage',
      ({ informations }) => {
        if (informations._type === 'GameRolePlayGroupMonsterInformations') {
          this.monsterGroups.push(informations)
          this.update()
        }
      }
    )

    this.eventManager.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', () => this.hide())
  }

  private show() {
    if (this.visible || this.wGame.gui.fightManager.fightState !== -1) return

    const padding = 10
    const { clientWidth, clientHeight } = this.wGame.document.body
    for (const group of this.monsterGroups) {
      const tooltip = this.injectTooltip(this.getTooltipData(group))
      const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(group.disposition.cellId)
      const pixelPos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y)

      pixelPos.x -= tooltip.clientWidth / 2
      pixelPos.y -= tooltip.clientHeight + 40

      if (pixelPos.x < padding) pixelPos.x = padding
      if (pixelPos.y < padding) pixelPos.y = padding

      const maxX = clientWidth - tooltip.clientWidth - padding
      if (pixelPos.x > maxX) pixelPos.x = maxX

      const maxY = clientHeight - tooltip.clientHeight - padding
      if (pixelPos.y > maxY) pixelPos.y = maxY

      tooltip.setAttribute('style', `left: ${pixelPos.x}px; top: ${pixelPos.y}px`)
    }

    this.visible = true
  }

  private hide() {
    if (!this.visible) return

    const tooltips = this.wGame.document.getElementsByClassName('lindo__TooltipBox')
    while (tooltips.length > 0) {
      tooltips[0].parentNode?.removeChild(tooltips[0])
    }

    this.visible = false
  }

  private injectTooltip(data: TooltipData): HTMLElement {
    const target = this.wGame.document.getElementsByClassName('foreground')[0]
    const levelLabel = this.LL.mod.monsterTooltip.level()
    const groupLabel = this.LL.mod.monsterTooltip.group()

    // Stuff needs to be one lined, otherwise the game will display spaces and newlines
    let tooltip = `<div id="lindo__TooltipBox${data.id}" class="TooltipBox lindo__TooltipBox"><div class="content" style="position: relative"><div class="sceneTooltip monsterInfoTooltip"><div class="level">${levelLabel} ${data.groupLevel}</div><div class="StarCounter" style="width: 100% !important; min-width: 100px">`

    let starIndex = 0
    for (; starIndex < data.redStarsCount; starIndex += 1) {
      tooltip += '<div class="star level2"></div>'
    }
    for (; starIndex < data.redStarsCount + data.yellowStarsCount; starIndex += 1) {
      tooltip += '<div class="star level1"></div>'
    }
    for (; starIndex < 5; starIndex += 1) {
      tooltip += '<div class="star"></div>'
    }

    if (data.bonusPackActive) {
      tooltip +=
        '<div class="bonusContainer bonusPackActive"><div class="bonusContainerPlus">+</div><div class="bonusStar star1"></div><div class="bonusStar star2"></div><div class="bonusStar star3"></div><div class="linkToShop Button"></div></div>'
    } else {
      tooltip +=
        '<div class="bonusContainer"><div class="bonusContainerPlus">+</div><div class="bonusStar star1"></div><div class="bonusStar star2"></div><div class="bonusStar star3"></div><div class="linkToShop Button"></div></div>'
    }

    tooltip += `</div><div class="xpPreview"><div>${this.formatNumber(data.soloXp)} XP</div>`
    if (data.partyXp > -1) {
      tooltip += `<div>${this.formatNumber(data.partyXp)} XP (${groupLabel})</div>`
    }
    tooltip += '</div>'

    for (const monster of this.getReduceAndSortMonsters(data.monsters)) {
      if (monster.isBoss) {
        tooltip += `<div class="mtt-bossLine"> <div class="mtt-bossIcon"></div> ${monster.name} (${monster.level})</div>`
      } else {
        tooltip +=
          `<div>${monster.name} (${monster.level}) ` + (monster.quantity > 1 ? `x${monster.quantity}` : '') + '</div>'
      }
    }

    tooltip += '</div></div></div></div>'
    target.insertAdjacentHTML('beforeend', tooltip)
    return this.wGame.document.getElementById(`lindo__TooltipBox${data.id}`)!
  }

  private getReduceAndSortMonsters(
    monsters: Array<_MonsterInGroupInformations | _MonsterInGroupLightInformations>
  ): Monster[] {
    const result: Monster[] = []

    monsters.forEach((monster) => {
      const m: Monster = {
        name: monster.staticInfos.nameId,
        level: monster.staticInfos.level,
        quantity: 1,
        isBoss: monster.staticInfos.isBoss
      }
      const monsterFind: Monster = result.find((r) => r.name === m.name && r.level === m.level)!

      if (monsterFind != null) monsterFind.quantity += 1
      else result.push(m)
    })

    result.sort((a, b) => b.level - a.level)

    return result
  }

  // FIXME Problems with formula
  private getTooltipData(group: _GameRolePlayGroupMonsterInformations): TooltipData {
    // General data
    const { partyData, characterBaseInformations } = this.wGame.gui.playerData
    const allMonsters = [group.staticInfos.mainCreatureLightInfos, ...group.staticInfos.underlings]
    const starsCount = Math.min(Math.round(group.ageBonus / 20), 10)
    const redStarsCount = Math.max(starsCount - 5, 0)
    const yellowStarsCount = Math.min(starsCount, 5) - redStarsCount
    const alternatives: Map<number, _MonsterInGroupAlternativeInformations> = new Map()
    let monsters: Array<_MonsterInGroupInformations | _MonsterInGroupLightInformations> = []
    let playerCount: number = 1
    // Party data
    let party: PartyFrom
    let partyLevels, partyLevel, partySizeExcludingLowLevels, partySizeModifier
    let partyXp = -1

    // Update party data if player has party
    if (partyData && Object.keys(partyData._partyFromId).length > 0) {
      party = partyData._partyFromId[Object.keys(partyData._partyFromId)[0]]
      partyLevels = [
        characterBaseInformations.level,
        ...Object.keys(party._members).map((id) => party._members[id].level)
      ]
      partyLevel = partyLevels.reduce((total, level) => total + level)
      const highestPartyLevel: number = partyLevels
        .slice()
        .sort((a, b) => (a < b ? -1 : 1))
        .pop()!
      partySizeExcludingLowLevels = partyLevels.filter((level) => level >= highestPartyLevel / 3).length
      partySizeModifier = MonsterTooltipMod.partySizeModifier[partySizeExcludingLowLevels as never]
      playerCount = partyLevels.length
    }

    // Get alternatives
    if (group.staticInfos.alternatives != null) {
      group.staticInfos.alternatives.forEach((alternative) => alternatives.set(alternative.playerCount, alternative))

      const alternativesMonster = alternatives.get(
        MonsterTooltipMod.alternativeModifier[playerCount as never]
      )!.monsters
      alternativesMonster.forEach((monster) => {
        const tempMonster = allMonsters.find((m) => m.creatureGenericId === monster.creatureGenericId)!
        allMonsters.splice(allMonsters.indexOf(tempMonster), 1)
        monsters.push(tempMonster)
      })
    } else {
      monsters = allMonsters
    }

    const groupLevel = monsters.reduce((level, monster) => level + monster.staticInfos.level, 0)
    const monstersXp = monsters.reduce((xp, monster) => xp + monster.staticInfos.xp, 0)

    // const highestMonsterLevel = monsters
    //   .slice()
    //   .sort((a, b) => a.staticInfos.level - b.staticInfos.level)
    //   .pop()!

    // Get mount, alliance and guild xp modifiers
    const {
      playerData: { guild, id, alliance, position, ...rest }
    } = this.wGame.gui
    const guildInformation = guild.getGuildMemberInfo(id) || {}
    const xpAlliancePrismBonusPercent = alliance.getPrismBonusPercent(position.subAreaId)
    const xpRatioMount = rest.isRiding ? rest.mountXpRatio || 0 : 0
    const xpGuildGivenPercent = guildInformation.experienceGivenPercent || 0

    if (partyData && Object.keys(partyData._partyFromId).length > 0) {
      partyXp = this.calculateXp(
        monstersXp,
        characterBaseInformations.level,
        partyLevel,
        groupLevel,
        group.ageBonus,
        partySizeModifier,
        xpAlliancePrismBonusPercent,
        xpRatioMount,
        xpGuildGivenPercent
      )
    }

    const soloXp = this.calculateXp(
      monstersXp,
      characterBaseInformations.level,
      characterBaseInformations.level,
      groupLevel,
      group.ageBonus,
      1,
      xpAlliancePrismBonusPercent,
      xpRatioMount,
      xpGuildGivenPercent
    )

    const bonusPackActive = (this.wGame.gui.playerData.identification.subscriptionEndDate ?? 0) > Date.now()
    return {
      id: group.contextualId,
      monsters,
      groupLevel,
      yellowStarsCount,
      redStarsCount,
      soloXp,
      partyXp,
      bonusPackActive
    }
  }

  private calculateXp(
    monstersXp: number,
    playerLevel: number,
    partyLevel: number = 0,
    groupLevel: number,
    ageBonus: number,
    partySizeModifier: number = 1,
    xpAlliancePrismBonusPercent: number = 0,
    xpRatioMount: number = 0,
    xpGuildGivenPercent: number = 0
  ): number {
    let modifier = 1
    if (groupLevel > partyLevel + 10) {
      modifier = (partyLevel + 10) / groupLevel
    } else if (partyLevel > groupLevel + 5) {
      modifier = groupLevel / partyLevel
    }

    const wisdom = this.wGame.gui.playerData.characters.mainCharacter.characteristics.wisdom.getTotalStat()
    const wisdomModifier = 1 + wisdom / 100
    const ageModifier = ageBonus <= 0 ? 1 : 1 + ageBonus / 100
    const bonusModifier = 1 + this.wGame.gui.playerData.experienceFactor / 100
    const contributionModifier = Math.min(playerLevel, toInt(2.5 * groupLevel)) / partyLevel

    const xpPool = toInt(toInt(toInt(monstersXp * modifier) * partySizeModifier) * ageModifier)
    const allianceMultiplier = xpAlliancePrismBonusPercent > 0 ? 1 + xpAlliancePrismBonusPercent / 100 : 1
    if (xpPool <= 0) return 0

    const playerXp = toInt(toInt(xpPool * contributionModifier) * wisdomModifier) * allianceMultiplier
    // Mount and guild xp given
    let givenXPModifier = 100 - xpRatioMount - ((100 - xpRatioMount) * xpGuildGivenPercent) / 100
    givenXPModifier /= 100

    return toInt(toInt(playerXp * givenXPModifier) * bonusModifier)
  }

  private update() {
    if (!this.visible) return

    this.hide()
    this.show()
  }

  private onKeyEvent(event: KeyboardEvent) {
    if (ignoreKeyboardEvent(event)) {
      return
    }
    if (event.key.toUpperCase() === this.rootStore.hotkeyStore.gameMod.monsterTooltip.toUpperCase()) {
      if (event.type === 'keydown') this.show()
      else if (event.type === 'keyup') this.hide()
    }
  }

  private formatNumber(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  private stop() {
    this.hide()
    if (this.shortcutDisposer) this.shortcutDisposer()
  }

  public destroy() {
    this.stop()
    this.settingDisposer()
  }
}
