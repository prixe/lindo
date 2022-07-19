import {
  DofusWindow,
  ExchangeInventoryWindow,
  ExchangeStorageWindow,
  GUIEvents,
  GUIWindow,
  ItemInstance,
  StorageViewer,
  StorageViewEvents,
  TradeWithPlayerAndNPCInventoryWindow,
  WindowID
} from '@/dofus-window'
import { TranslationFunctions } from '@lindo/i18n'
import { RootStore } from '@/store'
import { Mod } from '../mod'
import { EventManager } from '../helpers'

/**
 * Allow the user to hold "control" key and double click
 * items slots in the bank to quickly move items
 */
export class RapidExchangeMod extends Mod {
  // Character's inventory in bank exchange view
  private exchangeInventory?: ExchangeInventoryWindow

  // Bank's inventory in bank exchange view
  private exchangeStorage?: ExchangeStorageWindow

  // Character's inventory in trade view
  private tradeWithPlayerAndNPCInventory?: TradeWithPlayerAndNPCInventoryWindow

  // Does the "ctrl" key is pressed ?
  private keyPressed: boolean = false

  private _disposers: Array<() => void> = []
  private readonly eventManager = new EventManager()

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    // Retrieve window from the gui
    const windows = this.wGame.gui.windowsContainer.getChildren()

    windows.forEach((window) => {
      switch (window.id) {
        case 'exchangeInventory':
          this.exchangeInventory = window
          break
        case 'exchangeStorage':
          this.exchangeStorage = window
          break
        case 'tradeWithPlayerAndNPCInventory':
          this.tradeWithPlayerAndNPCInventory = window
          break
      }
    })

    this.setKeyListener()
    this.setInventoryEventListener()
  }

  // events
  private exchangeInventoryEvent(slot: StorageViewer) {
    console.log(slot)
    this.moveItem(slot.itemInstance, 'exchangeInventory', false)
  }

  private exchangeStorageEvent(slot: StorageViewer) {
    console.log(slot)
    this.moveItem(slot.itemInstance, 'exchangeStorage', true)
  }

  private tradeWithPlayerAndNPCInventoryEvent(slot: StorageViewer) {
    console.log(slot)
    this.moveItem(slot.itemInstance, 'tradeWithPlayerAndNPCInventory', false)
  }

  // Listen to the "ctrl" key, and remember it's state
  private setKeyListener() {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Meta' || event.key === 'Ctrl') {
        this.keyPressed = true
      }
    }
    const keyup = (event: KeyboardEvent) => {
      if (event.key === 'Meta' || event.key === 'Ctrl') {
        this.keyPressed = false
      }
    }

    this.wGame.addEventListener('keydown', keydown, true)
    this.wGame.addEventListener('keyup', keyup, true)

    this._disposers.push(() => {
      this.wGame.removeEventListener('keydown', keydown)
      this.wGame.removeEventListener('keyup', keyup)
    })
  }

  // Listen "slot-doubletap" events on window and when it occurs, call the moveItem function
  private setInventoryEventListener() {
    if (this.exchangeInventory) {
      this.eventManager.on<StorageViewEvents, 'slot-doubletap'>(
        this.exchangeInventory,
        'slot-doubletap',
        this.exchangeInventoryEvent.bind(this)
      )
    }

    if (this.exchangeStorage) {
      this.eventManager.on<StorageViewEvents, 'slot-doubletap'>(
        this.exchangeStorage,
        'slot-doubletap',
        this.exchangeStorageEvent.bind(this)
      )
    }

    if (this.tradeWithPlayerAndNPCInventory) {
      this.eventManager.on<StorageViewEvents, 'slot-doubletap'>(
        this.tradeWithPlayerAndNPCInventory,
        'slot-doubletap',
        this.tradeWithPlayerAndNPCInventoryEvent.bind(this)
      )
    }

    // Special Event for the "common" trade window
    // When a slot is added, add a listener on it, tha will call the move item icon
    this.eventManager.on<GUIEvents, 'ExchangeObjectAddedMessage'>(
      this.wGame.gui,
      'ExchangeObjectAddedMessage',
      (msg) => {
        // If the event come from the remote character
        if (msg.remote) return

        const UID = msg.object.objectUID
        const quantity = msg.object.quantity

        const remove = () => {
          this.moveItem({ objectUID: UID, quantity }, 'tradeWithPlayer', true)
        }

        // Retrieve the trade space window
        const tradeWithPlayer = this.getWindow('tradeWithPlayer')

        if (!tradeWithPlayer || tradeWithPlayer.id !== 'tradeWithPlayer') {
          return
        }

        // Sometimes the slot is not added instantly
        // So wait to avoid error
        setTimeout(() => {
          tradeWithPlayer._myTradeSpace._allSlots.getChild('slot' + UID).on('doubletap', remove)
        }, 500)
      }
    )
  }

  // Move the item from a window to another
  // And Hide the MinMax selector
  private moveItem(itemInstance: ItemInstance, inventoryId: WindowID, toStorage: boolean) {
    if (itemInstance.quantity > 1 && this.keyPressed) {
      this.wGame.dofus.sendMessage('ExchangeObjectMoveMessage', {
        objectUID: itemInstance.objectUID,
        quantity: toStorage ? -itemInstance.quantity : itemInstance.quantity
      })

      this.hideMinMaxSelector(inventoryId)
    }
  }

  // Return the window that match the id
  private getWindow(id: WindowID) {
    // Get all window
    const windows = this.wGame.gui.windowsContainer.getChildren()

    let window: GUIWindow | undefined

    // Loop through them
    for (const i in windows) {
      // If we hit the matching window, save it and break the loop
      if (windows[i].id === id) {
        window = windows[i]
        break
      }
    }

    // If everithing is ok, return the matching window
    return window
  }

  // Hide the Minmax selector
  private hideMinMaxSelector(id: WindowID) {
    const window = this.getWindow(id)

    if (!window) {
      return
    }

    const container = window.id === 'tradeWithPlayer' ? window._myTradeSpace : window

    switch (window.id) {
      // Simplest case, that get the function in their prototype
      case 'exchangeInventory':
      case 'exchangeStorage':
        window.closeMinMaxSelector()
        break

      // For these, fond the MinMax selector in children of the window and call the hide function
      case 'tradeWithPlayerAndNPCInventory':
      case 'tradeWithPlayer':
        for (const i in container._childrenList) {
          if (
            window._childrenList[i].rootElement &&
            window._childrenList[i].rootElement.className === 'minMaxSelector'
          ) {
            window._childrenList[i].hide()
          }
        }
    }
  }

  destroy(): void {
    for (const disposer of this._disposers) {
      disposer()
    }
    this.eventManager.close()
  }
}
