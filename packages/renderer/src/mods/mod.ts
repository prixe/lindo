import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'

export abstract class Mod {
  protected readonly wGame: DofusWindow
  protected readonly rootStore: RootStore
  protected readonly LL: TranslationFunctions

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    this.wGame = wGame
    this.rootStore = rootStore
    this.LL = LL
  }

  abstract destroy(): void
}
