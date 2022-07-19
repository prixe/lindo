import { DofusWindow, FightManagerEvents } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { EventManager } from '../helpers'
import { Mod } from '../mod'

/**
 * This mod add the possibility to hide the floating shop button
 */
export class HideShopMod extends Mod {
  private readonly settingDisposer: () => void
  private readonly eventManager = new EventManager()

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(
      this.rootStore.optionStore.gameGeneral,
      'hiddenShop',
      () => {
        this.toggle()
      },
      true
    )
    // At the begining, toggle the shop button
    this.eventManager.on<FightManagerEvents, 'fightEnd'>(this.wGame.gui.fightManager, 'fightEnd', () => this.toggle())
  }

  private toggle() {
    if (this.rootStore.optionStore.gameGeneral.hiddenShop) this.start()
    else this.stop()
  }

  // That function shows or hides the shop button
  // depending on the variable "hidden_shop"
  private start(): void {
    this.wGame.gui.shopFloatingToolbar.hide()
  }

  private stop() {
    this.wGame.gui.shopFloatingToolbar.show()
  }

  destroy(): void {
    this.stop()
    this.eventManager.close()
    this.settingDisposer()
  }
}
