import { ConnectionManagerEvents, DofusWindow, GUIEvents } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { EventManager } from '../helpers'
import { Mod } from '../mod'
import { DamageContainer } from './damage-container'

export class DamageEstimatorMod extends Mod {
  private readonly damageContainer: DamageContainer
  private readonly _eventManager = new EventManager()
  private settingDisposer: () => void

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.damageContainer = new DamageContainer(this.wGame)

    this.settingDisposer = observe(
      this.rootStore.optionStore.gameFight,
      'damageEstimator',
      () => {
        if (this.rootStore.optionStore.gameFight.damageEstimator) {
          this.start()
        } else {
          this.stop()
        }
      },
      true
    )
  }

  private start(): void {
    console.info('- enable Damage-Estimator')
    // this.removeOnDeath();
    this.setSpellSelected()
    this.setSpellSlotDeselected()
    // this.stopOnFightEnd();
    this.damageContainer.toggle()
  }

  private removeOnDeath(): void {
    this._eventManager.on<GUIEvents, 'GameActionFightDeathMessage'>(
      this.wGame.gui,
      'GameActionFightDeathMessage',
      (e) => {
        try {
          this.damageContainer.destroyEstimator(e.targetId)
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private setSpellSlotDeselected(): void {
    this._eventManager.on<GUIEvents, 'spellSlotDeselected'>(this.wGame.gui, 'spellSlotDeselected', () => {
      try {
        console.info('onSpellSlotDeselected')
        this.damageContainer.destroyEstimators()
      } catch (ex) {
        console.error(ex)
      }
    })
  }

  private setSpellSelected(): void {
    this._eventManager.on<GUIEvents, 'spellSlotSelected'>(this.wGame.gui, 'spellSlotSelected', (spellId: number) => {
      try {
        console.info('onSpellSelected')
        const spell = this.wGame.gui.playerData.characters.mainCharacter.spellData.spells[spellId]
        if (this.rootStore.optionStore.gameFight.damageEstimator) this.damageContainer.display(spell)
      } catch (ex) {
        console.error(ex)
      }
    })
  }

  private stopOnFightEnd(): void {
    this._eventManager.on<ConnectionManagerEvents, 'GameFightEndMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightEndMessage',
      () => {
        try {
          this.damageContainer.fightEnded()
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private stop() {
    this.damageContainer.destroy()
    this.damageContainer.destroy()
    this._eventManager.close()
  }

  public destroy() {
    this.stop()
    this.settingDisposer()
  }
}
