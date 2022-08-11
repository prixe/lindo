import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { GripPositionModel } from './grip-position'

/**
 * Model description here for TypeScript hints.
 */
export const ModStoreModel = types.model('ModStore').props({
  gripPosition: types.optional(GripPositionModel, {})
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type ModStoreType = Instance<typeof ModStoreModel>

export interface ModStore extends ModStoreType {}

type ModStoreSnapshotType = SnapshotOut<typeof ModStoreModel>

export interface ModStoreSnapshot extends ModStoreSnapshotType {}
