import { AutoFocusMod } from './auto-focus'
import { ChatHistoryMod } from './chat-history'
import { CssOverloadMod } from './css-overload'
import { HideShopMod } from './hide-shop'
import { InactivityMod } from './inactivity'
import { JsFixesMod } from './js-fixes'
import { KeyboardInputPadMod } from './keyboard-input-pad'
import { ShowPodsMod } from './show-pods'

export * from './auto-focus'
export * from './chat-history'
export * from './css-overload'
export * from './inactivity'
export * from './js-fixes'
export * from './keyboard-input-pad'
export * from './show-pods'
export * from './hide-shop'

export const GENERAL_MODS = [
  AutoFocusMod,
  ChatHistoryMod,
  CssOverloadMod,
  InactivityMod,
  JsFixesMod,
  KeyboardInputPadMod,
  ShowPodsMod,
  HideShopMod
] as const
