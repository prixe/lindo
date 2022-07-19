import { ItemSlot } from './item-slot'
import { WuiDom } from './wui-dom'

export interface TradeSpace extends WuiDom {
  _allSlots: {
    getChild(slot: string): ItemSlot
  }
}
