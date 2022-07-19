import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const GameGeneralOptionModel = types
  .model('GameGeneralOption')
  .props({
    activeOpenMenu: types.optional(types.boolean, true),
    hiddenShop: types.optional(types.boolean, false),
    preventInactivityDisconnect: types.optional(types.boolean, true),
    zaapSearchFilter: types.optional(types.boolean, true)
  })
  .actions((self) => ({
    setActiveOpenMenu(value: boolean) {
      self.activeOpenMenu = value
    },
    setHiddenShop(value: boolean) {
      self.hiddenShop = value
    },
    setPreventInactivityDisconnect(value: boolean) {
      self.preventInactivityDisconnect = value
    },
    setZaapSearchFilter(value: boolean) {
      self.zaapSearchFilter = value
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameGeneralOptionType = Instance<typeof GameGeneralOptionModel>

export interface GameGeneralOption extends GameGeneralOptionType {}

type GameGeneralOptionSnapshotType = SnapshotOut<typeof GameGeneralOptionModel>

export interface GameGeneralOptionSnapshot extends GameGeneralOptionSnapshotType {}
