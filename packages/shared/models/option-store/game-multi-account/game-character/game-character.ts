import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'

/**
 * Model description here for TypeScript hints.
 */
export const GameCharacterModel = types.model('GameCharacter').props({
  id: types.optional(types.identifier, () => uuidv4()),
  account: types.string,
  password: types.string,
  name: types.string
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameCharacterType = Instance<typeof GameCharacterModel>

export interface GameCharacter extends GameCharacterType {}

type GameCharacterSnapshotType = SnapshotOut<typeof GameCharacterModel>

export interface GameCharacterSnapshot extends GameCharacterSnapshotType {}

type GameCharacterSnapshotInType = SnapshotIn<typeof GameCharacterModel>

export interface GameCharacterSnapshotIn extends GameCharacterSnapshotInType {}
