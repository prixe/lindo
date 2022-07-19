import { ConnectionManagerEvents, DofusWindow, GUIEvents } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { Shortcuts } from 'shortcuts'
import { EventManager, ignoreKeyboardEvent } from '../helpers'
import { Mod } from '../mod'
import { Bar } from './bar'

export class HealthBarMod extends Mod {
  private bars: { [fighterId: number]: Bar } = {}
  private rendered: boolean = true
  private settingDisposer: () => void
  private readonly _shortcuts = new Shortcuts({
    target: this.wGame.document,
    shouldHandleEvent: (event) => {
      // don't apply the shortcut if the user is on a input (like chat)
      if (ignoreKeyboardEvent(event)) {
        return false
      }
      return !event.defaultPrevented
    }
  })

  private _disposers: Array<() => void> = []
  private _eventManager = new EventManager()

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(
      this.rootStore.optionStore.gameFight,
      'healthBar',
      () => {
        if (this.rootStore.optionStore.gameFight.healthBar) this.enableHealthBars()
        else this.destroyHealthBars()
      },
      true
    )
  }

  /**
   * Health bar mod initialization,
   * called only when the mod has been enabled in the settings.
   */
  private enableHealthBars() {
    console.info('- enable Health-Bar')

    this.appendContainerStyle()
    this.appendContainerElement()
    this.listenGameEvents()

    this.updateHealthBars()

    const shortcutDisposer = observe(
      this.rootStore.hotkeyStore.gameMod,
      'toggleHealthBar',
      () => {
        this._shortcuts.reset()
        this._shortcuts.add({
          shortcut: this.rootStore.hotkeyStore.gameMod.toggleHealthBar,
          handler: (e) => {
            e.preventDefault()
            this.toggleRendering()
            return true
          }
        })
      },
      true
    )
    this._disposers.push(shortcutDisposer)
  }

  /**
   * The shortcut can temporarily disable bars rendering for the rest of the
   * current fight.
   * The container stays, but all bars are removed and stop being updated.
   * @example
   * this.toggleRendering() // Toggles current rendering state
   * this.toggleRendering(true) // Forces rendering
   */
  private toggleRendering(rendered = !this.rendered) {
    this.rendered = rendered

    if (this.rendered) {
      this.updateHealthBars()
    } else {
      this.destroyHealthBars()
    }
  }

  /**
   * Appends style tag to the document.
   * Sets the tag to be removed once the mod is reset.
   */
  private appendContainerStyle() {
    const healthBarCss = document.createElement('style')
    healthBarCss.id = 'healthBarCss'
    healthBarCss.innerHTML = `
        .lifeBarContainer {
            box-sizing: border-box;
            background-color: #222;
            height: 6px;
            width: 80px;
            position: absolute;
            border-radius: 3px;
            overflow: hidden;
            margin-top: 10px;
            transition-property: top, left;
            transition-duration: 300ms;
        }

        .lifeBar {
            height: 100%;
            width: 100%;
            background-color: #333;
        }

        .lifePointsText {
            font-size: 12px;
            position: absolute;
            width: 80px;
            color: white;
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.9);
            margin-top: 14px;
            margin-left: 2px;
            transition-property: top, left;
            transition-duration: 300ms;
        }`

    this.wGame.document.getElementsByTagName('head')[0].appendChild(healthBarCss)

    this._disposers.push(() => {
      this.wGame.document.getElementsByTagName('head')[0].removeChild(healthBarCss)
    })
  }

  /**
   * Appends the health bars container element to the document.
   * Sets the element to be removed once the mod is reset.
   */
  private appendContainerElement() {
    const container = document.createElement('div')
    container.id = 'lifeBars'
    container.className = 'lifeBarsContainer'

    this.wGame.foreground.rootElement.appendChild(container)

    this._disposers.push(() => {
      this.wGame.foreground.rootElement.removeChild(container)
    })
  }

  /**
   * Ensures the mod updates the bars when needed
   */
  private listenGameEvents() {
    // The rendering state toggled by the keyboard shortcut is reset when entering a fight
    const ensureRendering = () => {
      this.toggleRendering(true)
    }
    this._eventManager.on<GUIEvents, 'GameFightOptionStateUpdateMessage'>(
      this.wGame.gui,
      'GameFightOptionStateUpdateMessage',
      ensureRendering
    )
    this._eventManager.on<ConnectionManagerEvents, 'GameFightTurnStartMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightTurnStartMessage',
      ensureRendering
    )
    this._eventManager.on<ConnectionManagerEvents, 'GameFightTurnEndMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightTurnEndMessage',
      ensureRendering
    )

    // Update bars during a fight
    const updateData = () => {
      setTimeout(() => {
        this.updateHealthBars()
      }, 50)
    }
    this._eventManager.on<ConnectionManagerEvents, 'GameFightTurnStartMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightTurnStartMessage',
      updateData
    )
    this._eventManager.on<ConnectionManagerEvents, 'GameFightTurnEndMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightTurnEndMessage',
      updateData
    )
    this._eventManager.on<ConnectionManagerEvents, 'GameActionFightLifePointsGainMessage'>(
      this.wGame.gui,
      'GameActionFightLifePointsGainMessage',
      updateData
    )
    this._eventManager.on<GUIEvents, 'GameActionFightLifePointsLostMessage'>(
      this.wGame.gui,
      'GameActionFightLifePointsLostMessage',
      updateData
    )
    this._eventManager.on<GUIEvents, 'GameActionFightLifeAndShieldPointsLostMessage'>(
      this.wGame.gui,
      'GameActionFightLifeAndShieldPointsLostMessage',
      updateData
    )
    this._eventManager.on<GUIEvents, 'GameActionFightPointsVariationMessage'>(
      this.wGame.gui,
      'GameActionFightPointsVariationMessage',
      updateData
    )
    this._eventManager.on<GUIEvents, 'GameFightOptionStateUpdateMessage'>(
      this.wGame.gui,
      'GameFightOptionStateUpdateMessage',
      updateData
    )
    this._eventManager.on<GUIEvents, 'GameActionFightDeathMessage'>(
      this.wGame.gui,
      'GameActionFightDeathMessage',
      updateData
    )
    this._eventManager.on<GUIEvents, 'resize'>(this.wGame.gui, 'resize', updateData)

    this._eventManager.on<GUIEvents, 'GameActionFightDeathMessage'>(
      this.wGame.gui,
      'GameActionFightDeathMessage',
      (e) => {
        this.destroyHealthBar(e.targetId)
      }
    )

    // Remove all bars when the fight ends
    const destroy = () => {
      this.destroyHealthBars()
    }
    this._eventManager.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage', destroy)
    this._eventManager.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', destroy)
  }

  /**
   * This will cycle through all bars and update their display if the
   * fighter is still alive.
   */
  private updateHealthBars() {
    if (!this.rendered) return

    const fighters = this.wGame.gui.fightManager.getFighters()
    for (const index in fighters) {
      const fighter = this.wGame.gui.fightManager.getFighter(fighters[index])
      if (fighter.data.alive) {
        if (!this.bars[fighter.id]) {
          this.bars[fighter.id] = new Bar(fighter, this.wGame)
          this._disposers.push(() => {
            this.destroyHealthBars()
          })
        }
        this.bars[fighter.id].update()
      }
    }
  }

  /**
   * Destroys a single health bar
   */
  private destroyHealthBar(fighterId: number) {
    if (this.bars[fighterId]) {
      this.bars[fighterId].destroy()
      delete this.bars[fighterId]
    }
  }

  /**
   * Destroys all health bars
   */
  private destroyHealthBars() {
    Object.keys(this.bars).forEach((fighterId: string) => {
      this.destroyHealthBar(parseInt(fighterId))
    })
  }

  private stop() {
    for (const disposer of this._disposers) {
      disposer()
    }
    this._disposers = []
    this._eventManager.close()
    this.destroyHealthBars()
  }

  public destroy() {
    this.stop()
    this.settingDisposer()
  }
}
