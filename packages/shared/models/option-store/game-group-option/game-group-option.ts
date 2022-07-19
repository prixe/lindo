import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const GameGroupOptionModel = types
  .model('GameGroupOption')
  .props({
    groupProspecting: types.optional(types.boolean, true),
    groupLevel: types.optional(types.boolean, true),
    partyMemberOnMap: types.optional(types.boolean, true),
    enterGroupFight: types.optional(types.boolean, false),
    skipReadyInFight: types.optional(types.boolean, false),
    followLeader: types.optional(types.boolean, false),
    followLeaderOnMap: types.optional(types.boolean, false),
    followStrictMove: types.optional(types.boolean, false),
    autoGrouping: types.optional(types.boolean, false),
    autoGroupLeaderName: types.optional(types.string, ''),
    autoGroupMembersName: types.array(types.string),
    disableTimer: types.optional(types.boolean, false)
  })
  .actions((self) => ({
    setGroupProspecting(value: boolean) {
      self.groupProspecting = value
    },
    setGroupLevel(value: boolean) {
      self.groupLevel = value
    },
    setPartyMemberOnMap(value: boolean) {
      self.partyMemberOnMap = value
    },
    setEnterGroupFight(value: boolean) {
      self.enterGroupFight = value
    },
    setSkipReadyInFight(value: boolean) {
      self.skipReadyInFight = value
    },
    setFollowLeader(value: boolean) {
      self.followLeader = value
    },
    setFollowLeaderOnMap(value: boolean) {
      self.followLeaderOnMap = value
    },
    setFollowStrictMove(value: boolean) {
      self.followStrictMove = value
    },
    setAutoGrouping(value: boolean) {
      self.autoGrouping = value
    },
    setAutoGroupLeaderName(value: string) {
      self.autoGroupLeaderName = value
    },
    setAutoGroupMembersName(value: string[]) {
      self.autoGroupMembersName.replace(value)
    },
    setDisableTimer(value: boolean) {
      self.disableTimer = value
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameGroupOptionType = Instance<typeof GameGroupOptionModel>

export interface GameGroupOption extends GameGroupOptionType {}

type GameGroupOptionSnapshotType = SnapshotOut<typeof GameGroupOptionModel>

export interface GameGroupOptionSnapshot extends GameGroupOptionSnapshotType {}
