import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const GameFightOptionModel = types
  .model('GameFightOption')
  .props({
    healthBar: types.optional(types.boolean, true),
    damageEstimator: types.optional(types.boolean, true),
    verticalTimeline: types.optional(types.boolean, false),
    challengeBonus: types.optional(types.boolean, false),
    focusOnFightTurn: types.optional(types.boolean, true),
    fightChronometer: types.optional(types.boolean, true),
    monsterTooltip: types.optional(types.boolean, true)
  })
  .actions((self) => ({
    setHealthBar(value: boolean) {
      self.healthBar = value
    },
    setDamageEstimator(value: boolean) {
      self.damageEstimator = value
    },
    setVerticalTimeline(value: boolean) {
      self.verticalTimeline = value
    },
    setChallengeBonus(value: boolean) {
      self.challengeBonus = value
    },
    setFocusOnFightTurn(value: boolean) {
      self.focusOnFightTurn = value
    },
    setFightChronometer(value: boolean) {
      self.fightChronometer = value
    },
    setMonsterTooltip(value: boolean) {
      self.monsterTooltip = value
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameFightOptionType = Instance<typeof GameFightOptionModel>

export interface GameFightOption extends GameFightOptionType {}

type GameFightOptionSnapshotType = SnapshotOut<typeof GameFightOptionModel>

export interface GameFightOptionSnapshot extends GameFightOptionSnapshotType {}
