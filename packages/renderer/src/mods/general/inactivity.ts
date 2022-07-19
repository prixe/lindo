import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { Mod } from '../mod'

/**
 * This mod add the possibility to hide the floating shop button
 */
export class InactivityMod extends Mod {
  private readonly settingDisposer: () => void
  private interval?: number

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(
      this.rootStore.optionStore.gameGeneral,
      'preventInactivityDisconnect',
      () => {
        if (this.rootStore.optionStore.gameGeneral.preventInactivityDisconnect) this.start()
        else this.stop()
      },
      true
    )
  }

  // That function shows or hides the shop button
  // depending on the variable "hidden_shop"
  private start(): void {
    this.interval = window.setInterval(() => {
      this.wGame.d.recordActivity()
    }, 60 * 60 * 3)
  }

  private stop() {
    window.clearInterval(this.interval)
  }

  destroy(): void {
    this.stop()
    this.settingDisposer()
  }
}
