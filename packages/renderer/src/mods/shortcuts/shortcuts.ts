import { DofusWindow, GUIButton } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { GameInterfaceHotkey } from '@lindo/shared'
import { IArrayDidChange, IObjectDidChange, Lambda, observe } from 'mobx'
import { IAnyType, IMSTArray } from 'mobx-state-tree'
import { Shortcuts } from 'shortcuts'
import { ignoreKeyboardEvent } from '../helpers'
import { Mod } from '../mod'
import { Mover } from './mover'

const lowerCaseFirstLetter = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

interface ValueDidChange {
  value: string
  oldValue: string
}
export class ShortcutsMod extends Mod {
  private readonly _disposers: Array<Lambda> = []
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

  private readonly _mover: Mover

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this._mover = new Mover(wGame)
    this._bindAll()
  }

  private _addShortcut<S extends object, K extends keyof S>(
    store: S,
    shortcutProp: K,
    handler: (event: KeyboardEvent) => boolean | void
  ) {
    const addShortcut = (shortcut: string) => {
      if (shortcut !== '') {
        this._shortcuts.add({ shortcut, handler })
      }
    }
    const disposer = observe(store, (change: IObjectDidChange<ValueDidChange>) => {
      if (change.name !== shortcutProp) {
        return
      }
      console.log(change)
      if (change.type === 'update') {
        const newShortcut = change.newValue.value
        this._shortcuts.remove({ shortcut: change.oldValue.value, handler })
        if (newShortcut !== '') {
          addShortcut(newShortcut)
        }
      }
    })
    this._disposers.push(disposer)
    addShortcut(store[shortcutProp] as never)
  }

  private _addShortcutFromArray<S extends IAnyType>(
    store: IMSTArray<S>,
    index: number,
    handler: (event: KeyboardEvent) => boolean | void
  ) {
    const addShortcut = (shortcut: string) => {
      if (shortcut !== '') {
        this._shortcuts.add({ shortcut, handler })
      }
    }
    const disposer = observe(store, (change: IArrayDidChange<ValueDidChange>) => {
      if (change.index !== index) {
        return
      }
      if (change.type === 'update') {
        const newShortcut = change.newValue.value
        this._shortcuts.remove({ shortcut: change.oldValue.value, handler })
        if (newShortcut !== '') {
          addShortcut(newShortcut)
        }
      }
    })
    this._disposers.push(disposer)
    addShortcut(store[index])
  }

  private _bindAll() {
    const gameActionHotkey = this.rootStore.hotkeyStore.gameAction

    // End turn
    this._addShortcut(gameActionHotkey, 'endTurn', () => {
      if (this.wGame.gui.fightManager.fightState === 0) {
        this.wGame.gui.timeline.fightControlButtons.toggleReadyForFight()
      } else if (this.wGame.gui.fightManager.fightState === 1) {
        this.wGame.gui.fightManager.finishTurn()
      }
    })

    // go to top map
    this._addShortcut(gameActionHotkey, 'goUp', () => {
      this._mover.move(
        'top',
        () => {
          console.debug('Move to Up OK')
        },
        (reason: string = '') => {
          console.debug('Move to Up Failed... (' + reason + ')')
        }
      )
    })

    // go to bottom map
    this._addShortcut(gameActionHotkey, 'goDown', () => {
      this._mover.move(
        'bottom',
        () => {
          console.debug('Move to Bottom OK')
        },
        (reason: string = '') => {
          console.debug('Move to Bottom Failed... (' + reason + ')')
        }
      )
    })

    this._addShortcut(gameActionHotkey, 'goLeft', () => {
      this._mover.move(
        'left',
        () => {
          console.debug('Move to Left OK')
        },
        (reason: string = '') => {
          console.debug('Move to Left Failed... (' + reason + ')')
        }
      )
    })

    this._addShortcut(gameActionHotkey, 'goRight', () => {
      this._mover.move(
        'right',
        () => {
          console.debug('Move to Right OK')
        },
        (reason: string = '') => {
          console.debug('Move to Right Failed... (' + reason + ')')
        }
      )
    })

    // Open chat
    this._addShortcut(gameActionHotkey, 'openChat', () => {
      if (!this.wGame.gui.numberInputPad.isVisible()) {
        console.log('open chat')
        this.wGame.gui.chat.activate()
      }
    })

    // Open menu
    this._addShortcut(gameActionHotkey, 'openMenu', () => {
      this.wGame.gui.mainControls.buttonBox._childrenList[15].tap()
    })

    const gameInterfaceHotkey = this.rootStore.hotkeyStore.gameInterface

    // Spells
    gameInterfaceHotkey.spells.forEach((_, index) => {
      const selectedSpell = this.wGame.gui.shortcutBar._panels.spell.slotList[index]

      this._addShortcutFromArray(gameInterfaceHotkey.spells, index, () => {
        console.log('use spell ' + index)
        selectedSpell.tap()
        // return true to prevent spell cast multiple times
        return true
      })

      const handleDoubleTap = () => {
        // TODO:  (HoPollo) : Allow double shortcut tap to work as well (currently only mouseclick works)
        if (this.wGame.gui.fightManager.fightState === 0) {
          return
        }

        selectedSpell.tap()

        setTimeout(() => {
          this.wGame.isoEngine._castSpellImmediately(this.wGame.isoEngine.actorManager.userActor.cellId)
        }, 150)
      }

      selectedSpell.on('doubletap', handleDoubleTap)
      this._disposers.push(() => {
        selectedSpell.removeListener('doubletap', handleDoubleTap)
      })
    })

    // Skills
    gameInterfaceHotkey.items.forEach((_, index) => {
      const selectedItem = this.wGame.gui.shortcutBar._panels.item.slotList[index]

      this._addShortcutFromArray(gameInterfaceHotkey.items, index, () => {
        console.log('use item ' + index)
        selectedItem.tap()
        // return true to prevent spell cast multiple times
        return true
      })
    })

    this.wGame.gui.menuBar._icons._childrenList.forEach((child, index) => {
      const propName = lowerCaseFirstLetter(child.id)
      const hasPropName = Object.hasOwn(gameInterfaceHotkey, propName)

      if (hasPropName) {
        this._addShortcut(gameInterfaceHotkey, propName as keyof GameInterfaceHotkey, () => {
          console.log(propName)
          this.wGame.gui.menuBar._icons._childrenList[index].tap()
          return true
        })
      } else {
        console.log('no hotkey for ' + propName)
      }
    })

    // Close window on escape
    const escapeListener = (e: KeyboardEvent) => {
      if (e.key.toLocaleLowerCase() !== 'escape') {
        return
      }
      if (this.wGame.gui.chat.active) {
        this.wGame.gui.chat.deactivate()
      } else {
        let winClosed = 0
        for (let i = this.wGame.gui.windowsContainer._childrenList.length - 1; i >= 0; i--) {
          const win = this.wGame.gui.windowsContainer._childrenList[i]
          if (win.isVisible() && win.id !== 'recaptcha') {
            win.close()
            winClosed++
            break
          }
        }
        if (this.wGame.gui.notificationBar._elementIsVisible) {
          const dialogName = this.wGame.gui.notificationBar.currentOpenedId
          // If notifiaction is openened, allow to close it with ESC
          // TODO: find better typing solution for the guibutton
          const notification = this.wGame.gui.notificationBar.dialogs[dialogName]._childrenList[0]
            ._childrenList[1] as GUIButton
          notification.tap()
          winClosed++
        }
        if (this.rootStore.optionStore.gameGeneral.activeOpenMenu && !winClosed) {
          // If no window closed open menu
          this.wGame.gui.mainControls.buttonBox._childrenList[15].tap()
        }
      }
    }

    this.wGame.addEventListener('keydown', escapeListener)
    this._disposers.push(() => this.wGame.removeEventListener('keydown', escapeListener))
  }

  destroy() {
    this._shortcuts.reset()
    for (const disposer of this._disposers) {
      disposer()
    }
    this._mover.close()
  }
}
