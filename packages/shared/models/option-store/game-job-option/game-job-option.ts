import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const GameJobOptionModel = types
  .model('GameJobOption')
  .props({
    xpRemainingBeforeLevelUp: types.optional(types.boolean, false),
    harvestTimeIndicator: types.optional(types.boolean, true),
    mapResources: types.optional(types.boolean, false)
  })
  .actions((self) => ({
    setXpRemainingBeforeLevelUp(value: boolean) {
      self.xpRemainingBeforeLevelUp = value
    },
    setHarvestTimeIndicator(value: boolean) {
      self.harvestTimeIndicator = value
    },
    setMapResources(value: boolean) {
      self.mapResources = value
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameJobOptionType = Instance<typeof GameJobOptionModel>

export interface GameJobOption extends GameJobOptionType {}

type GameJobOptionSnapshotType = SnapshotOut<typeof GameJobOptionModel>

export interface GameJobOptionSnapshot extends GameJobOptionSnapshotType {}
