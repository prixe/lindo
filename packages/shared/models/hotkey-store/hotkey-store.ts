import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { GameActionHotkeyModel } from './game-action-hotkey'
import { GameInterfaceHotkeyModel } from './game-interface-hotkey'
import { GameModHotkeyModel } from './game-mod-hotkey'
import { WindowHotkeyModel } from './window-hotkey'

/**
 * Model description here for TypeScript hints.
 */
export const HotkeyStoreModel = types.model('HotkeyStore').props({
  window: types.optional(WindowHotkeyModel, {}),
  gameAction: types.optional(GameActionHotkeyModel, {}),
  gameInterface: types.optional(GameInterfaceHotkeyModel, {}),
  gameMod: types.optional(GameModHotkeyModel, {})
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type HotkeyStoreType = Instance<typeof HotkeyStoreModel>

export interface HotkeyStore extends HotkeyStoreType {}

type HotkeyStoreSnapshotType = SnapshotOut<typeof HotkeyStoreModel>

export interface HotkeyStoreSnapshot extends HotkeyStoreSnapshotType {}
