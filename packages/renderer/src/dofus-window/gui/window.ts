import { GUIButton, GUITable } from './gui'
import TypedEmitter from 'typed-emitter'
import { CharacterDisplay } from './character-display'
import { _CharacterBaseInformations } from '../dofus'
import { StorageViewer } from './storage-viewer'
import { TradeSpace } from './trade-space'
import { WuiDom } from './wui-dom'
import { WorldMap } from './world-map'

export interface WindowOpenEvent {
  id: string
  tabId: string
  itemData: {
    _type: string
  }
  _messageType: string
}
export type GUIWindowEvents = {
  open: (event: WindowOpenEvent) => void
  opened: () => void
}
export type WindowID =
  | 'itemRecipes'
  | 'bidHouseShop'
  | 'grimoire'
  | 'social'
  | 'equipment'
  | 'characterSelection'
  | 'recaptcha'
  | 'exchangeInventory'
  | 'exchangeStorage'
  | 'tradeWithPlayerAndNPCInventory'
  | 'tradeWithNPC'
  | 'tradeWithPlayer'
  | 'worldMap'
export interface GUIWindowSchema extends WuiDom {
  id: WindowID
  isVisible: () => boolean
  close: () => void
  openState: boolean
}

export interface GenericWindow extends GUIWindowSchema, TypedEmitter<GUIWindowEvents> {
  id: 'itemRecipes' | 'bidHouseShop' | 'grimoire' | 'social' | 'recaptcha'
}

export type StorageViewEvents = {
  'slot-doubletap': (slot: StorageViewer, x: number, y: number) => void
}

export interface TradeWithPlayerAndNPCInventoryWindow
  extends GUIWindowSchema,
    TypedEmitter<GUIWindowEvents & StorageViewEvents> {
  id: 'tradeWithPlayerAndNPCInventory'
}

export interface ExchangeStorageWindow extends GUIWindowSchema, TypedEmitter<GUIWindowEvents & StorageViewEvents> {
  id: 'exchangeStorage'
  closeMinMaxSelector: () => void
}

export interface ExchangeInventoryWindow extends GUIWindowSchema, TypedEmitter<GUIWindowEvents & StorageViewEvents> {
  id: 'exchangeInventory'
  closeMinMaxSelector: () => void
}

export interface TradeWithNPCWindow extends GUIWindowSchema, TypedEmitter<GUIWindowEvents & StorageViewEvents> {
  id: 'tradeWithNPC'
  _myTradeSpace: TradeSpace
}

export interface TradeWithPlayerWindow extends GUIWindowSchema, TypedEmitter<GUIWindowEvents & StorageViewEvents> {
  id: 'tradeWithPlayer'
  _myTradeSpace: TradeSpace
}

export interface EquipmentWindow extends GUIWindowSchema, TypedEmitter<GUIWindowEvents> {
  id: 'equipment'
  storageBox: WuiDom
}

export interface CharacterSelection extends GUIWindowSchema, TypedEmitter<GUIWindowEvents> {
  id: 'characterSelection'
  characterDisplay: CharacterDisplay
  btnCreate: GUIButton
  btnDelete: GUIButton
  btnPlay: GUIButton
  selectedCharacter?: _CharacterBaseInformations
  charactersTable: GUITable<_CharacterBaseInformations>
}

export interface WorldMapWindow extends GUIWindowSchema, TypedEmitter<GUIWindowEvents> {
  id: 'worldMap'
  _worldMap: WorldMap
}

export type GUIWindow =
  | EquipmentWindow
  | GenericWindow
  | CharacterSelection
  | TradeWithPlayerAndNPCInventoryWindow
  | ExchangeStorageWindow
  | ExchangeInventoryWindow
  | TradeWithNPCWindow
  | TradeWithPlayerWindow
  | WorldMapWindow
