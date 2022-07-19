import { ConnectionManagerEvents, DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { EventManager } from '../helpers'
import { Mod } from '../mod'

/**
 * This mod add the possibility to display a chronometer while fighting,
 * useful for PVE to always know if the combat is still decent in time for xp
 */
export class FightChronometerMod extends Mod {
  private chronometerInitialized: boolean = false
  private eventManager = new EventManager()
  private settingDisposer: () => void
  private chronometerInterval?: number
  private chronometerContainer?: HTMLDivElement

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(
      this.rootStore.optionStore.gameFight,
      'fightChronometer',
      () => {
        if (this.rootStore.optionStore.gameFight.fightChronometer) this.start()
        else this.stop()
      },
      true
    )
  }

  private start(): void {
    console.info('- enable Fight-Chronometer')

    this.chronometerInitialized = this.wGame.document.querySelector('#chronometerContainer') !== null
    this.create()

    this.eventManager.on<ConnectionManagerEvents, 'GameFightStartMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightStartMessage',
      this.update.bind(this)
    )
    this.eventManager.on<ConnectionManagerEvents, 'GameFightEndMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightEndMessage',
      this.clear.bind(this)
    )
    this.eventManager.on<ConnectionManagerEvents, 'GameFightLeaveMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightLeaveMessage',
      this.clear.bind(this)
    )
  }

  private create() {
    try {
      if (this.chronometerInitialized) {
        return
      }

      const container = this.wGame.document.querySelector('.infoContainer')
      if (!container) {
        return
      }

      // Makes some room for the chronometer
      const turnsContainer = this.wGame.document.querySelector<HTMLDivElement>('.turnCountLabel')!
      turnsContainer.setAttribute('style', 'margin-top: -5px')

      this.chronometerContainer = this.wGame.document.createElement('div')
      this.chronometerContainer.id = 'chronometerContainer'
      this.chronometerContainer.setAttribute(
        'style',
        `
            margin-top: -9px;
            color: white;
            text-align: center;
      `
      )

      this.chronometerContainer.innerHTML = '00:00:00'

      container.insertBefore(this.chronometerContainer, this.wGame.document.querySelector('.fightControlButtons'))
      this.chronometerInitialized = true
    } catch (ex) {
      console.error(ex)
    }
  }

  private update() {
    if (!this.chronometerInitialized) {
      this.create()
    }
    let chronometerTime = 0
    /** TODO: Improvement : use "this.wGame.gui.fightManager.timeCreationStarted" for accuracy
     * & to allow chronometer to count if activated mid game (missing start event)
     * */
    try {
      this.chronometerInterval = window.setInterval(() => {
        if (this.wGame.gui.fightManager.fightState !== 1) {
          return window.clearInterval(this.chronometerInterval)
        }

        if (this.chronometerContainer)
          this.chronometerContainer.innerHTML = new Date(chronometerTime++ * 1000).toISOString().substr(11, 8)
      }, 1000)
    } catch (ex) {
      console.error(ex)
    }
  }

  private clear() {
    try {
      window.clearInterval(this.chronometerInterval)
      if (this.chronometerContainer) this.chronometerContainer.innerHTML = '00:00:00'
    } catch (ex) {
      console.error(ex)
    }
  }

  private stop() {
    this.chronometerInitialized = false
    this.eventManager.close()
    if (this.chronometerContainer) {
      this.chronometerContainer.remove()
      clearInterval(this.chronometerInterval)
    }
  }

  public destroy() {
    this.stop()
    this.settingDisposer()
  }
}
