import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const GameNotificationOptionModel = types
  .model('GameNotificationOption')
  .props({
    privateMessage: types.optional(types.boolean, true),
    fightTurn: types.optional(types.boolean, true),
    taxCollector: types.optional(types.boolean, true),
    kolizeum: types.optional(types.boolean, true),
    partyInvitation: types.optional(types.boolean, true),
    aggression: types.optional(types.boolean, true),
    itemSold: types.optional(types.boolean, false)
  })
  .actions((self) => ({
    setPrivateMessage(value: boolean) {
      self.privateMessage = value
    },
    setFightTurn(value: boolean) {
      self.fightTurn = value
    },
    setTaxCollector(value: boolean) {
      self.taxCollector = value
    },
    setKolizeum(value: boolean) {
      self.kolizeum = value
    },
    setPartyInvitation(value: boolean) {
      self.partyInvitation = value
    },
    setAggression(value: boolean) {
      self.aggression = value
    },
    setItemSold(value: boolean) {
      self.itemSold = value
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameNotificationOptionType = Instance<typeof GameNotificationOptionModel>

export interface GameNotificationOption extends GameNotificationOptionType {}

type GameNotificationOptionSnapshotType = SnapshotOut<typeof GameNotificationOptionModel>

export interface GameNotificationOptionSnapshot extends GameNotificationOptionSnapshotType {}
