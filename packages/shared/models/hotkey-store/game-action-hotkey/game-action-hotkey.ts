import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const GameActionHotkeyModel = types
  .model('GameActionHotkey')
  .props({
    endTurn: types.optional(types.string, 'Backspace'),
    openChat: types.optional(types.string, 'Return'),
    openMenu: types.optional(types.string, ''),
    goUp: types.optional(types.string, 'CmdOrCtrl+Up'),
    goDown: types.optional(types.string, 'CmdOrCtrl+Down'),
    goLeft: types.optional(types.string, 'CmdOrCtrl+Left'),
    goRight: types.optional(types.string, 'CmdOrCtrl+Right')
  })
  .actions((self) => ({
    setEndTurn(hotkey: string) {
      self.endTurn = hotkey
    },
    setOpenChat(hotkey: string) {
      self.openChat = hotkey
    },
    setOpenMenu(hotkey: string) {
      self.openMenu = hotkey
    },
    setGoUp(hotkey: string) {
      self.goUp = hotkey
    },
    setGoDown(hotkey: string) {
      self.goDown = hotkey
    },
    setGoLeft(hotkey: string) {
      self.goLeft = hotkey
    },
    setGoRight(hotkey: string) {
      self.goRight = hotkey
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameActionHotkeyType = Instance<typeof GameActionHotkeyModel>

export interface GameActionHotkey extends GameActionHotkeyType {}

type GameActionHotkeySnapshotType = SnapshotOut<typeof GameActionHotkeyModel>

export interface GameActionHotkeySnapshot extends GameActionHotkeySnapshotType {}
