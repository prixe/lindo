import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { Shortcuts } from 'shortcuts'
import { Mod } from '../mod'

export class KeyboardInputPadMod extends Mod {
  private readonly _shortcuts = new Shortcuts({ target: this.wGame.document })

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.setKeyListener()
  }

  private setKeyListener() {
    // listen for digits
    this._shortcuts.add(
      Array.from({ length: 10 }, (_, k) => k).map((digit) => ({
        shortcut: digit.toString(),
        handler: (e) => {
          if (!this.wGame.gui.numberInputPad.isVisible()) {
            return false
          }
          e.preventDefault()
          e.stopPropagation()

          this.wGame.gui.numberInputPad._doDigit(digit)

          return true
        }
      }))
    )

    this._shortcuts.add([
      {
        shortcut: 'Backspace',
        handler: (e) => {
          if (!this.wGame.gui.numberInputPad.isVisible()) {
            return false
          }
          e.preventDefault()
          e.stopPropagation()

          this.wGame.gui.numberInputPad._doBackspace()
        }
      }
    ])

    this._shortcuts.add([
      {
        shortcut: 'Enter',
        handler: (e) => {
          if (!this.wGame.gui.numberInputPad.isVisible()) {
            return false
          }
          e.preventDefault()
          e.stopPropagation()

          this.wGame.gui.numberInputPad._doEnter()
        }
      }
    ])
  }

  destroy(): void {
    this._shortcuts.reset()
  }
}
