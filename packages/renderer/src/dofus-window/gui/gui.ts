import TypedEmitter from 'typed-emitter'
import { Chat } from './chat'
import { FightManager } from './fight-manager'
import { Party } from './party'
import { PlayerData } from './player-data'
import { Scroller } from './scroller'
import { TapBehavior } from './tap-behavior'
import { GUIWindow } from './window'
import { WuiDom } from './wui-dom'

export type SlotEvents = {
  doubletap: () => void
}
export interface Slot extends TypedEmitter<SlotEvents> {
  tap: () => void
}

export interface GUICanvas {
  rootElement: HTMLCanvasElement
}
export interface GUIButton extends WuiDom, TapBehavior {
  id: string
}

export interface GUITableRowContent<T> extends TapBehavior {
  data?: T
}

export interface GUITable<T> extends WuiDom {
  content: {
    _childrenList: Array<GUITableRowContent<T>>
  }
}
export interface GUIDialog extends WuiDom {
  _childrenList: Array<WuiDom>
}
export interface ChallengeIcon {
  description: string
  details: unknown
  icon: {
    rootElement: HTMLDivElement
  }
  iconUrl: string
  name: string
  points: number
  xpBonus: number
}
export interface GameFightTurnStartMessage {
  id: number
  waitTime: number
  _isInitialized: false
  _messageType: 'GameFightTurnStartMessage'
}

export interface ExchangeObjectAddedMessage {
  remote?: unknown
  object: {
    objectUID: number
    quantity: number
  }
}

export type GUIEvents = {
  disconnect: () => void
  resize: () => void
  spellSlotSelected: (spellId: number) => void
  spellSlotDeselected: () => void
  GameActionFightDeathMessage: (event: { targetId: number }) => void
  GameFightTurnStartMessage: (msg: GameFightTurnStartMessage) => void
  GameFightOptionStateUpdateMessage: () => void
  GameActionFightLifePointsLostMessage: () => void
  GameActionFightLifeAndShieldPointsLostMessage: () => void
  GameActionFightPointsVariationMessage: () => void
  ExchangeObjectAddedMessage: (msg: ExchangeObjectAddedMessage) => void
}

export interface GUI extends TypedEmitter<GUIEvents> {
  _resizeUi: () => void
  isConnected: boolean
  loginScreen: {
    _connectMethod: 'manual' | 'lastCharacter' | 'lastServer'
    _login: (login: string, password: string, unknownParam: boolean) => void
  }
  shopFloatingToolbar: {
    hide: () => void
    show: () => void
  }
  notificationBar: {
    _elementIsVisible: boolean
    currentOpenedId: string
    dialogs: Record<string, GUIDialog>
  }
  windowsContainer: {
    _childrenList: Array<GUIWindow>
    getChildren: () => Array<GUIWindow>
  }
  menuBar: {
    _icons: {
      _childrenList: Array<GUIButton>
    }
  }
  challengeIndicator: {
    iconDetailsListByChallengeId: Record<number, ChallengeIcon>
    rootElement: {
      classList: {
        add: (className: string) => void
        remove: (className: string) => void
      }
    }
  }
  shortcutBar: {
    _panels: {
      spell: {
        slotList: Array<Slot>
      }
      item: {
        slotList: Array<Slot>
      }
    }
  }
  playerData: PlayerData
  mainControls: {
    buttonBox: {
      _childrenList: {
        tap: () => void
      }[]
    }
  }
  numberInputPad: {
    _doDigit: (value: number) => void
    isVisible: () => boolean
    _doBackspace: () => void
    _doEnter: () => void
  }
  fightManager: FightManager
  timeline: {
    fightControlButtons: {
      toggleReadyForFight: () => void
    }
    fighterList: {
      rootElement: HTMLDivElement
    }
    fighterListScroller: Scroller
  }
  chat: Chat
  party: Party
}
