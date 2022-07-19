import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const GameModHotkeyModel = types
  .model('GameModHotkey')
  .props({
    monsterTooltip: types.optional(types.string, 'P'),
    mapResources: types.optional(types.string, ''),
    toggleHealthBar: types.optional(types.string, '')
  })
  .actions((self) => ({
    setMonsterTooltip(hotkey: string) {
      self.monsterTooltip = hotkey
    },
    setMapResources(hotkey: string) {
      self.mapResources = hotkey
    },
    setToggleHealthBar(hotkey: string) {
      self.toggleHealthBar = hotkey
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameModHotkeyType = Instance<typeof GameModHotkeyModel>

export interface GameModHotkey extends GameModHotkeyType {}

type GameModHotkeySnapshotType = SnapshotOut<typeof GameModHotkeyModel>

export interface GameModHotkeySnapshot extends GameModHotkeySnapshotType {}
