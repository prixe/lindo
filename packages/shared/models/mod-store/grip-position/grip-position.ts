import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export interface GripPositionCoordinates {
  top: number
  left: number
}

/**
 * Model description here for TypeScript hints.
 */
export const GripPositionModel = types
  .model('GripPosition')
  .props({
    timeline: types.maybe(types.frozen<GripPositionCoordinates>()),
    party: types.maybe(types.frozen<GripPositionCoordinates>()),
    notificationBar: types.maybe(types.frozen<GripPositionCoordinates>()),
    challengeIndicator: types.maybe(types.frozen<GripPositionCoordinates>()),
    roleplayBuffs: types.maybe(types.frozen<GripPositionCoordinates>())
  })
  .views((self) => ({
    get grips() {
      return [self.timeline, self.party, self.notificationBar, self.challengeIndicator, self.roleplayBuffs]
    }
  }))
  .actions((self) => ({}))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GripPositionType = Instance<typeof GripPositionModel>

export interface GripPosition extends GripPositionType {}

type GripPositionSnapshotType = SnapshotOut<typeof GripPositionModel>

export interface GripPositionSnapshot extends GripPositionSnapshotType {}
