import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { Shortcuts } from 'shortcuts'
import { Mod } from '../mod'

export class ChatHistoryMod extends Mod {
  private readonly _input: HTMLInputElement
  private readonly _shortcuts: Shortcuts

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this._input = this.wGame.document.getElementsByClassName('inputChat')[0]! as HTMLInputElement
    this._shortcuts = new Shortcuts({ target: this._input })
    this.start()
  }

  private start(): void {
    // up & down for chat history
    this._shortcuts.add([
      {
        shortcut: 'ArrowUp',
        handler: (event) => {
          event.preventDefault()
          event.stopPropagation()
          this.wGame.gui.chat.chatInput.sentMessageHistory.goBack()
          this.wGame.gui.chat.chatInput.inputChat.setValue(
            this.wGame.gui.chat.chatInput.sentMessageHistory.getCurrentEntry().message
          )
          return true
        }
      },
      {
        shortcut: 'ArrowDown',
        handler: (event) => {
          event.preventDefault()
          event.stopPropagation()
          this.wGame.gui.chat.chatInput.sentMessageHistory.goForward()
          this.wGame.gui.chat.chatInput.inputChat.setValue(
            this.wGame.gui.chat.chatInput.sentMessageHistory.getCurrentEntry().message
          )
          return false
        }
      }
    ])
  }

  public destroy() {
    this._shortcuts.reset()
  }
}
