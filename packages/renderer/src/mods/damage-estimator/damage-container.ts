import { DofusWindow, Spell } from '@/dofus-window'
import { Estimator } from './estimator'

export class DamageContainer {
  private readonly wGame: DofusWindow
  private readonly container: HTMLDivElement
  private displayed: boolean = false
  private enabled: boolean = true
  private isInFight = false
  private estimators: { [fighterId: number]: Estimator } = {}

  constructor(wGame: DofusWindow) {
    this.wGame = wGame
    this.container = this.createContainer()

    this.wGame.foreground.rootElement.appendChild(this.container)
  }

  private createContainer() {
    const container = document.createElement('div')
    container.id = 'damage-estimator'
    container.style.position = 'absolute'
    container.style.cssText =
      'top: 0; left: 0; z-index: 1; width: 100%; height: 100%; pointerEvents: none; visibility: hidden'
    return container
  }

  public toggle() {
    this.enabled = !this.enabled
  }

  private show(spell: Spell) {
    this.displayed = true
    this.container.style.visibility = 'visible'
    const fighters = this.wGame.gui.fightManager.getFighters()

    for (const key in fighters) {
      const fighter = this.wGame.gui.fightManager.getFighter(fighters[key])

      if (fighter.data.alive && fighter.id !== this.wGame.gui.playerData.characters.mainCharacterId) {
        this.estimators[fighter.id] = new Estimator(fighter, spell, this.wGame)
      }
    }
  }

  public hide() {
    if (this.displayed) {
      this.displayed = false
      this.container.style.visibility = 'hidden'

      for (const fighterId in this.estimators) {
        this.destroyEstimator(parseFloat(fighterId))
      }
      this.estimators = []
      this.wGame.document.getElementById(this.container.id)!.innerHTML = ''
    }
  }

  private update(spell: Spell) {
    if (!this.isInFight) {
      return
    }
    const fighters = this.wGame.gui.fightManager.getFighters()

    for (const id of fighters) {
      const fighter = this.wGame.gui.fightManager.getFighter(fighters[id])

      if (fighter.data.alive && fighter.id !== this.wGame.gui.playerData.characters.mainCharacterId) {
        if (this.estimators[fighter.id]) {
          this.estimators[fighter.id].update(spell)
        } else {
          this.estimators[fighter.id] = new Estimator(fighter, spell, this.wGame)
        }
      }
    }
  }

  public destroyEstimators() {
    this.estimators = []
    this.container.innerHTML = ''
  }

  public destroyEstimator(fighterId: number) {
    if (this.estimators[fighterId]) {
      this.estimators[fighterId].destroy()
      delete this.estimators[fighterId]
    }
  }

  public display(spell: Spell) {
    this.isInFight = true
    // if (this.enabled)
    this.show(spell)
  }

  public fightEnded() {
    this.isInFight = false

    if (this.enabled) {
      this.hide()
    }
  }

  public destroy() {
    this.estimators = []

    if (this.container.parentElement) {
      this.container.parentElement.removeChild(this.container)
    }
  }
}
