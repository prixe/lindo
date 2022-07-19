import { GUIWindow, GUIWindowEvents, DofusWindow, WindowOpenEvent } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { EventManager } from '../helpers'
import { Mod } from '../mod'

export class AutoFocusMod extends Mod {
  private eventManager = new EventManager()
  private focusableWindows: Record<string, string> = {
    ExchangeStartedBidBuyerMessage: '.BidHouseShopWindow .searchBox',
    ObjectItem: '.ItemRecipesWindow .searchBox',
    Item: '.ItemRecipesWindow .searchBox',
    Weapon: '.ItemRecipesWindow .searchBox',
    friends: '.SocialWindow .FriendsWindow',
    bestiary: '.GrimoireWindow .BestiaryWindow',
    achievements: '.GrimoireWindow .AchievementsWindow',
    jobs: '.GrimoireWindow .jobsWindow .RecipeList'
  }

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.start()
  }

  private start(): void {
    const itemRecipes = this._getWindowById('itemRecipes')
    this._onOpen(itemRecipes, (e) => this._focusInput(e.id))

    const bidHouseShop = this._getWindowById('bidHouseShop')
    this._onOpen(bidHouseShop, (e) => this._focusInput(e._messageType))

    const grimoire = this._getWindowById('grimoire')
    this._onOpen(grimoire, (e) => this._focusInput(e.tabId))

    const social = this._getWindowById('social')
    this._onOpen(social, (e) => this._focusInput(e.tabId))
  }

  private _onOpen(window: GUIWindow, listener: (e: WindowOpenEvent) => void) {
    this.eventManager.on<GUIWindowEvents, 'open'>(window, 'open', listener)
  }

  private _getWindowById(id: GUIWindow['id']) {
    const window = this.wGame.gui.windowsContainer.getChildren().find((e) => e.id === id)
    if (!window) {
      throw new Error("Can't find the window id " + id)
    }
    return window
  }

  private _focusInput(id: string): void {
    const noFocusableWindows = ['ornaments', 'guild', 'spells', 'quests', 'alliance', 'alignment']
    if (noFocusableWindows.includes(id)) {
      return
    }
    requestAnimationFrame(() => {
      this.wGame.document.querySelector<HTMLInputElement>(this.focusableWindows[id] + ' .InputBox input')?.focus()
    })
  }

  destroy(): void {
    this.eventManager.close()
  }
}
