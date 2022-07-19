import { CharacterStats, DofusWindow, EffectCategory, Fighter, Spell } from '@/dofus-window'

const SpellColor = {
  5: '#ba87dd', // Do Pou
  91: '#668cff', // Vol de vie eau
  92: '#cc8800', // Vol de vie terre
  93: '#00e68a', // Vol de vie air
  94: '#ff5c33', // Vol de vie feu
  96: '#668cff', // Dommages Eau
  97: '#cc8800', // Dommages Terre
  98: '#00e68a', // Dommages Air
  99: '#ff5c33', // Dommages Feu
  108: '#cc0080', // Soins
  1109: '#cc0080' // Percent healths
}

const ESTIMATOR_CONTAINER_ID = 'estimatorContainer'

export class Estimator {
  private readonly actorId: number
  private spell: Spell
  private readonly wGame: DofusWindow

  private estimatorContainer: HTMLDivElement

  constructor(actor: Fighter, spell: Spell, wGame: DofusWindow) {
    this.actorId = actor.id
    this.wGame = wGame
    this.spell = spell

    const container = this.wGame.document.getElementById(ESTIMATOR_CONTAINER_ID + this.actorId)
    if (container) {
      this.estimatorContainer = container as HTMLDivElement
    } else {
      this.estimatorContainer = document.createElement('div')
      this.estimatorContainer.id = ESTIMATOR_CONTAINER_ID + this.actorId
    }

    this.createEstimator()
  }

  public update(spell: Spell) {
    this.spell = spell
    const actor = this.getActor()

    if (!this.wGame.isoEngine.mapRenderer.isFightMode || !actor.data.alive || !this.isActorVisible(actor)) {
      return
    }
    if (!this.estimatorContainer) {
      this.createEstimator()
    }
    const cellId = actor.data.disposition.cellId

    if (cellId) {
      const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId)
      const pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y)
      this.estimatorContainer.style.left = pos.x - this.estimatorContainer.clientWidth / 2 + 'px'
      this.estimatorContainer.style.top = pos.y - 80 + 'px'
    }
  }

  private createEstimator() {
    // retrieve data
    const actor = this.getActor()

    if (!this.isActorVisible(actor)) {
      return
    }
    const cellId = actor.data.disposition.cellId
    const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId)
    const pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y)

    // estimatorContainer
    const container = this.wGame.document.getElementById(ESTIMATOR_CONTAINER_ID + this.actorId)
    if (container) {
      this.estimatorContainer = container as HTMLDivElement
    } else {
      this.estimatorContainer = document.createElement('div')
      this.estimatorContainer.id = ESTIMATOR_CONTAINER_ID + this.actorId
    }

    this.estimatorContainer.style.cssText =
      'padding:3px; box-sizing: border-box; border: 1px gray solid; background-color: #222;color: white; position: absolute; border-radius: 3px; overflow: hidden; transition-duration: 500ms;'
    this.estimatorContainer.innerHTML = ''

    const estimations = this.spell.isItem
      ? this.getWeaponEstimations(this.spell, actor)
      : this.getEstimations(this.spell, actor)

    for (const [effectId, min, criticalMin, max, criticalMax] of estimations) {
      const damage = document.createElement('div')
      damage.textContent = (min || max) + ''
      damage.style.color = SpellColor[effectId as never] || ''
      damage.style.fontSize = '0.9em'

      if (min > 0 && max > 0) {
        damage.textContent += ` - ${max}`
      }
      if (criticalMin > 0 || criticalMax > 0) {
        const criticalDamage = document.createElement('span')
        const p1 = document.createElement('span')
        const p2 = document.createElement('span')
        p1.textContent = ' ('
        p1.style.color = 'white'
        p2.textContent = ')'
        p2.style.color = 'white'
        criticalDamage.textContent = (criticalMin || criticalMax) + ''

        if (criticalMin > 0 && criticalMax > 0) {
          criticalDamage.textContent += ` - ${criticalMax}`
        }
        damage.appendChild(p1)
        damage.appendChild(criticalDamage)
        damage.appendChild(p2)
      }
      this.estimatorContainer.appendChild(damage)
    }
    this.wGame.document.getElementById('damage-estimator')!.appendChild(this.estimatorContainer)
    this.estimatorContainer.style.left = pos.x - this.estimatorContainer.clientWidth / 2 + 'px'
    this.estimatorContainer.style.top = pos.y - 80 + 'px'
  }

  public destroy() {
    this.estimatorContainer.parentElement!.removeChild(this.estimatorContainer)
  }

  // -------------------------------------------------------------------------------------------------

  private getWeaponEstimations(spell: Spell, actor: Fighter) {
    const estimations = []

    for (const key in spell.effectInstances) {
      const { effect, effectId, min, max } = spell.effectInstances[key]
      const criticalHitBonus = spell._item.item.criticalHitBonus
      const estimation = [effectId, 0, 0, 0, 0] as [number, number, number, number, number]

      if (effect.category !== EffectCategory.damage) {
        continue
      }
      if (this.isActorInvincible(actor)) {
        estimations.push(estimation)
        continue
      }
      if (!this.isValidEffectId(effectId)) {
        continue
      }
      if (!this.isActorBuff(actor, 410)) {
        estimation[1] = Math.max(0, this.getSpellEstimation(effectId, actor, min))
        estimation[2] = Math.max(0, this.getSpellEstimation(effectId, actor, min + criticalHitBonus, true))
      }
      if (!this.isActorBuff(actor, 416)) {
        estimation[3] = Math.max(0, this.getSpellEstimation(effectId, actor, max))
        estimation[4] = Math.max(0, this.getSpellEstimation(effectId, actor, max + criticalHitBonus, true))
      }
      estimations.push(estimation)
    }
    return estimations
  }

  private getEstimations(spell: Spell, actor: Fighter) {
    const estimations = []

    for (let i = 0; i < spell.spellLevel.effects.length; i++) {
      const { effectId, diceNum, diceSide } = spell.spellLevel.effects[i]
      const criticalEffect = spell.spellLevel.criticalEffect[i]
      const estimation = [effectId, 0, 0, 0, 0] as [number, number, number, number, number]

      if (this.isActorInvincible(actor)) {
        estimations.push(estimation)
        continue
      }
      if (effectId === 5) {
        /** 
            NOTE: Push damage effects on critical doesn't seem to push further
            Formula: (8 + (random * level) / 50) * diceNum + totalPushDamage

            Push damages doesn't have damage variations like spells so we
            have a random number between 0 and 8 to do that
        */
        const self = this.getUserActor()
        const bonus = this.getCharacterStat('pushDamageBonus') - actor.data.stats.pushDamageFixedResist
        estimation[1] = Math.trunc(Math.max(0, (8 + (0 * self.level) / 50) * diceNum + bonus))
        estimation[3] = Math.trunc(Math.max(0, (8 + (8 * self.level) / 50) * diceNum + bonus))
        estimations.push(estimation)
        continue
      }
      if (!this.isValidEffectId(effectId)) {
        continue
      }
      if (!this.isActorBuff(actor, 410)) {
        estimation[1] = Math.max(0, this.getSpellEstimation(effectId, actor, diceNum))
        if (criticalEffect !== undefined) {
          estimation[2] = Math.max(0, this.getSpellEstimation(effectId, actor, criticalEffect.diceNum, true))
        }
      }
      if (!this.isActorBuff(actor, 416) && diceSide > diceNum) {
        estimation[3] = Math.max(0, this.getSpellEstimation(effectId, actor, diceSide))
        if (criticalEffect !== undefined && criticalEffect.diceSide > criticalEffect.diceNum) {
          estimation[4] = Math.max(0, this.getSpellEstimation(effectId, actor, criticalEffect.diceSide, true))
        }
      }
      estimations.push(estimation)
    }
    return estimations
  }

  private isValidEffectId(id: number) {
    return [96, 91, 100, 97, 92, 98, 93, 99, 94, 82, 108, 1109, 672].includes(id)
  }

  private getSpellEstimation(effectId: number, actor: Fighter, spellDice: number, isCritical = false) {
    switch (effectId) {
      case 96: // Dommages Eau
      case 91: // Vol de vie eau
        return this.computeSpellEstimation(
          spellDice,
          isCritical,
          this.getCharacterBaseStat('chance'),
          this.getCharacterStat('waterDamageBonus'),
          this.getSpellDamageModifier(actor),
          actor.data.stats.waterElementReduction,
          actor.data.stats.criticalDamageFixedResist,
          this.getElementResistPercent(actor, 'waterElementResistPercent')
        )
      case 100: // Dommages Neutre
        return this.computeSpellEstimation(
          spellDice,
          isCritical,
          this.getCharacterBaseStat('strength'),
          this.getCharacterStat('neutralDamageBonus'),
          this.getSpellDamageModifier(actor),
          actor.data.stats.neutralElementReduction,
          actor.data.stats.criticalDamageFixedResist,
          this.getElementResistPercent(actor, 'neutralElementResistPercent')
        )
      case 97: // Dommages Terre
      case 92: // Vol de vie terre
        return this.computeSpellEstimation(
          spellDice,
          isCritical,
          this.getCharacterBaseStat('strength'),
          this.getCharacterStat('earthDamageBonus'),
          this.getSpellDamageModifier(actor),
          actor.data.stats.earthElementReduction,
          actor.data.stats.criticalDamageFixedResist,
          this.getElementResistPercent(actor, 'earthElementResistPercent')
        )
      case 98: // Dommages Air
      case 93: // Vol de vie air
        return this.computeSpellEstimation(
          spellDice,
          isCritical,
          this.getCharacterBaseStat('agility'),
          this.getCharacterStat('airDamageBonus'),
          this.getSpellDamageModifier(actor),
          actor.data.stats.airElementReduction,
          actor.data.stats.criticalDamageFixedResist,
          this.getElementResistPercent(actor, 'airElementResistPercent')
        )
      case 99: // Dommages Feu
      case 94: // Vol de vie feu
        return this.computeSpellEstimation(
          spellDice,
          isCritical,
          this.getCharacterBaseStat('intelligence'),
          this.getCharacterStat('fireDamageBonus'),
          this.getSpellDamageModifier(actor),
          actor.data.stats.fireElementReduction,
          actor.data.stats.criticalDamageFixedResist,
          this.getElementResistPercent(actor, 'fireElementResistPercent')
        )
      case 82: // Fixed neutral life steal
        return Math.trunc(
          ((spellDice - actor.data.stats.neutralElementReduction) *
            (100 - this.getElementResistPercent(actor, 'neutralElementResistPercent'))) /
            100
        )
      case 108: // Soins
        return Math.trunc(
          (spellDice * (100 + this.getCharacterBaseStat('intelligence'))) / 100 + this.getCharacterStat('healBonus')
        )
      case 1109: // Percent healths
        return Math.trunc(spellDice * (actor.data.stats.maxLifePoints / 100))
      case 672: {
        // Punition du Sacrieur
        const self = this.getUserActor()
        const maxHealth = this.getCharacterStat('vitality') + (50 + self.level * 5)
        const percentMax = self.data.stats.lifePoints / self.data.stats.maxLifePoints
        const possibleDamage =
          (((spellDice / 100) * Math.pow(Math.cos(2 * Math.PI * (percentMax - 0.5)) + 1, 2)) / 4) * maxHealth
        return Math.trunc(
          ((possibleDamage - actor.data.stats.neutralElementReduction) *
            (100 - this.getElementResistPercent(actor, 'neutralElementResistPercent'))) /
            100
        )
      }
      default:
        console.info('effectId not handled:' + effectId)
        return 0
    }
  }

  /**
   * TODO: prévisu dégâts sort de zone éloigné
   * Dégâts subis = (((Puissance + Caractéristique + 100) / 100) - Résistances fixes) * (100 - % Résistances) / 100
   */
  private computeSpellEstimation(
    baseSpellDamage: number,
    isCritical: boolean,
    baseStat: number,
    fixDamages: number,
    spellDamageModifier: [number, number, number, number],
    fixResistances: number,
    criticalDamageFixedResist: number,
    percentResistances: number
  ) {
    const [baseStatModifier, baseSpellDamageModifier, fixedDamageModifier, damageMultiplicator] = spellDamageModifier
    const power = this.getCharacterStat('damagesBonusPercent')
    let possibleDamages =
      ((power * 0.8 + baseStatModifier + baseStat + 100) / 100) * (baseSpellDamage + baseSpellDamageModifier) +
      this.getCharacterStat('allDamagesBonus') +
      fixDamages

    if (isCritical) {
      possibleDamages += this.getCharacterStat('criticalDamageBonus') - criticalDamageFixedResist
    }
    return Math.trunc(
      ((possibleDamages - fixResistances + fixedDamageModifier) * damageMultiplicator * (100 - percentResistances)) /
        100
    )
  }

  private isActorInvincible(actor: Fighter) {
    for (const buff of actor.buffs) {
      // array = Dérobade, Corruption, Puissance Sylvestre
      if ([444, 4694, 197].includes(buff.castingSpell.spell.id)) {
        return true
      }
    }
    return false
  }

  // TODO: Incomplete spell list
  private getSpellDamageModifier(actor: Fighter) {
    let damageMultiplicator = 1
    let baseSpellDamageModifier = 0
    let fixedDamageModifier = 0
    let baseStatModifier = 0

    for (const buff of this.getUserActor().buffs) {
      switch (buff.castingSpell.spell.id) {
        case 159: // Colère de Iop
        case 146: // Epée du destin
        case 167: // Flèche d'Expiation
        case 171: // Flèche Punitive
          if (this.spell.id === buff.castingSpell.spell.id && !buff.effect.trigger) {
            if (buff.stack != null) {
              for (const _buff of buff.stack) {
                baseSpellDamageModifier += _buff.effect.value
              }
            } else {
              baseSpellDamageModifier += buff.effect.value
            }
          }
          break
        case 166: // Powerful Shooting
          if (!this.spell.isItem) {
            baseStatModifier += buff.effect.diceNum
          }
          break
        case 3506: // Maîtrise d'Arme
          if (this.spell.isItem) {
            baseStatModifier += buff.effect.diceNum
          }
          break
      }
    }
    for (const buff of actor.buffs) {
      if (buff.effect.effect.characteristic !== 16) {
        continue
      }
      switch (buff.castingSpell.spell.id) {
        case 7: // Bouclier Féca
        case 2031: // Bouclier Féca du doepul
        case 1503: // Glyphe Agressif
        case 1504: // Glyphe Agressif
        case 2037: // Glyphe Agressif du dopeul
        case 4511: // Glyphe Agressif
        case 4696: // Glyphe Agressif
        case 4684: // Flèche Analgésique
          damageMultiplicator *= buff.effect.diceNum / 100
          break
        case 4: // Barricade
        case 2030: // Barricade du dopeul
          if (this.isCellIdNextToMe(actor.data.disposition.cellId)) {
            fixedDamageModifier -= buff.effect.diceNum
          }
          break
        case 20: // Bastion
        case 2039: // Bastion du dopeul
          if (!this.isCellIdNextToMe(actor.data.disposition.cellId)) {
            fixedDamageModifier -= buff.effect.diceNum
          }
          break
        case 4690: // Chance d'Ecaflip
          damageMultiplicator *= buff.duration === 1 ? 1.5 : 0.5
          break
        case 6: // Rempart
        case 4698: // Rempart
        case 5: // Trêve
        case 127: // Mot de prévention
        case 2093: {
          // Mot de prévention du doepul
          const caster = this.wGame.gui.fightManager.getFighter(buff.source)
          fixedDamageModifier -= (buff.effect.value * (100 + 5 * caster.level)) / 100
          break
        }
        default:
          console.info(
            `effectId: ${buff.effect.effectId}, category: ${buff.effect.effect.category} spellId: ${buff.castingSpell.spell.id} | ${buff.effect.description}`
          )
          break
      }
    }
    return [baseStatModifier, baseSpellDamageModifier, fixedDamageModifier, damageMultiplicator] as [
      number,
      number,
      number,
      number
    ]
  }

  // TODO: Might not work when controlling a summon
  private isCellIdNextToMe(actorCellId: number) {
    const currentCellId = this.getUserActor().data.disposition.cellId
    const actorPos = this.wGame.isoEngine.mapRenderer.grid.getCoordinateGridFromCellId(actorCellId)
    const currentPos = this.wGame.isoEngine.mapRenderer.grid.getCoordinateGridFromCellId(currentCellId)
    const neighbours = [
      [currentPos.i, currentPos.j + 1],
      [currentPos.i, currentPos.j - 1],
      [currentPos.i + 1, currentPos.j],
      [currentPos.i - 1, currentPos.j],
      [currentPos.i + 1, currentPos.j + 1],
      [currentPos.i - 1, currentPos.j - 1],
      [currentPos.i + 1, currentPos.j - 1],
      [currentPos.i - 1, currentPos.j + 1]
    ]
    for (const [x, y] of neighbours) {
      if (actorPos.i === x && actorPos.j === y) {
        return true
      }
    }
    return false
  }

  private getCharacterBaseStat(key: keyof CharacterStats) {
    return Math.max(0, this.getCharacterStat(key))
  }

  private getCharacterStat(key: keyof CharacterStats) {
    return this.wGame.gui.playerData.characters.mainCharacter.characteristics[key].getTotalStat()
  }

  private getElementResistPercent(actor: Fighter, key: keyof CharacterStats) {
    return !actor.isCreature && actor.data.stats[key] > 50 ? 50 : actor.data.stats[key]
  }

  private isActorBuff(actor: Fighter, spellId: number): boolean {
    for (const buff of actor.buffs) {
      if (buff.castingSpell.spell.id === spellId) {
        return true
      }
    }
    return false
  }

  private getUserActor(): Fighter {
    return this.wGame.gui.fightManager.getFighter(this.wGame.gui.playerData.id)
  }

  private getActor(): Fighter {
    return this.wGame.gui.fightManager.getFighter(this.actorId)
  }

  private isActorVisible(actor: Fighter) {
    for (const key in actor.buffs) {
      // 150 = Rend le personnage invisible
      if (actor.buffs[key].effect.effectId === 150) {
        return false
      }
    }
    return true
  }
}
