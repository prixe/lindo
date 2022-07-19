import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'
import { GameCharacterModel } from '../game-character'

/**
 * Model description here for TypeScript hints.
 */
export const GameTeamWindowModel = types.model('GameTeamWindow').props({
  id: types.optional(types.identifier, () => uuidv4()),
  characters: types.array(types.safeReference(GameCharacterModel, { acceptsUndefined: false }))
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameTeamWindowType = Instance<typeof GameTeamWindowModel>

export interface GameTeamWindow extends GameTeamWindowType {}

type GameTeamWindowSnapshotType = SnapshotOut<typeof GameTeamWindowModel>

export interface GameTeamWindowSnapshot extends GameTeamWindowSnapshotType {}

type GameTeamWindowSnapshotInType = SnapshotIn<typeof GameTeamWindowModel>

export interface GameTeamWindowSnapshotIn extends GameTeamWindowSnapshotInType {}
