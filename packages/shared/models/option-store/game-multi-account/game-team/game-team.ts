import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'
import { GameCharacter } from '../game-character'
import { GameTeamWindowModel } from './game-team-window'

/**
 * Model description here for TypeScript hints.
 */
export const GameTeamModel = types
  .model('GameTeam')
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    name: types.string,
    windows: types.array(GameTeamWindowModel)
  })
  .views((self) => ({
    get allCharacters() {
      return self.windows.flatMap((window) => window.characters as Array<GameCharacter>)
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameTeamType = Instance<typeof GameTeamModel>

export interface GameTeam extends GameTeamType {}

type GameTeamSnapshotType = SnapshotOut<typeof GameTeamModel>

export interface GameTeamSnapshot extends GameTeamSnapshotType {}

type GameTeamSnapshotInType = SnapshotIn<typeof GameTeamModel>

export interface GameTeamSnapshotIn extends GameTeamSnapshotInType {}
