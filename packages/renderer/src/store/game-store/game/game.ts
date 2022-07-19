import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'
import { GameCharacterModel } from '@lindo/shared'

/**
 * Model description here for TypeScript hints.
 */
export const GameModel = types
  .model('Game')
  .props({
    id: types.optional(types.identifier, () => uuidv4()),
    character: types.maybe(types.reference(GameCharacterModel)),
    characterName: types.maybe(types.string),
    characterIcon: types.maybe(types.frozen<HTMLElement>()),
    hasNotification: types.optional(types.boolean, false)
  })
  .actions((self) => ({
    setHasNotification: (hasNotification: boolean) => {
      self.hasNotification = hasNotification
    },
    setCharacterName(name: string) {
      self.characterName = name
    },
    setCharacterIcon(icon: HTMLElement) {
      console.log('setCharacterIcon')
      self.characterIcon = icon
    },
    disconnected() {
      self.characterName = undefined
      self.characterIcon = undefined
      self.hasNotification = false
      self.character = undefined
    },
    removeLogin() {
      self.character = undefined
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameType = Instance<typeof GameModel>

export interface Game extends GameType {}

type GameSnapshotType = SnapshotOut<typeof GameModel>

export interface GameSnapshot extends GameSnapshotType {}
