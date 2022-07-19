import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { Mod } from '../mod'

export class CssOverloadMod extends Mod {
  private styleTag: HTMLStyleElement

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.styleTag = this.wGame.document.createElement('style')
    this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag)

    // fixes
    this.pageNumberSelection()
    this.menuStyleFix()
  }

  private pageNumberSelection() {
    this.styleTag.innerHTML += `
            .NumberInputBox[readonly=readonly] {
                -webkit-user-select: none;
            }
        `
  }

  private menuStyleFix() {
    this.styleTag.innerHTML += `
            .topBorder {
                max-width: 0;
            }

            .PingBtn .borderBox .emoteBtn::before {
                border-width: 20px;
                border-image-slice: 40;
            }
        `
  }

  public destroy() {
    if (this.styleTag.parentElement) {
      this.styleTag.parentElement.removeChild(this.styleTag)
    }
  }
}
