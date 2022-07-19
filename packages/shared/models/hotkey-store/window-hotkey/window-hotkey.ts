import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const WindowHotkeyModel = types
  .model('WindowHotkey')
  .props({
    newTab: types.optional(types.string, 'CmdOrCtrl+T'),
    closeTab: types.optional(types.string, 'CmdOrCtrl+W'),
    newWindow: types.optional(types.string, 'CmdOrCtrl+N'),
    nextTab: types.optional(types.string, 'Down'),
    prevTab: types.optional(types.string, 'Up'),
    activTab: types.optional(types.string, 'CmdOrCtrl+Tab'),
    tabs: types.optional(types.array(types.string), ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'])
  })
  .actions((self) => ({
    setNewTab(hotkey: string) {
      self.newTab = hotkey
    },
    setcloseTab(hotkey: string) {
      self.closeTab = hotkey
    },
    setNewWindow(hotkey: string) {
      self.newWindow = hotkey
    },
    setNextTab(hotkey: string) {
      self.nextTab = hotkey
    },
    setPrevTab(hotkey: string) {
      self.prevTab = hotkey
    },
    setActivTab(hotkey: string) {
      self.activTab = hotkey
    },
    setTab(hotkey: string, index: number) {
      self.tabs[index] = hotkey
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type WindowHotkeyType = Instance<typeof WindowHotkeyModel>

export interface WindowHotkey extends WindowHotkeyType {}

type WindowHotkeySnapshotType = SnapshotOut<typeof WindowHotkeyModel>

export interface WindowHotkeySnapshot extends WindowHotkeySnapshotType {}
