import { applySnapshot, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { GameFightOptionModel } from './game-fight-option'
import { GameGeneralOptionModel } from './game-general-option'
import { GameGroupOptionModel } from './game-group-option'
import { GameJobOptionModel } from './game-job-option'
import { GameNotificationOptionModel } from './game-notification-option'
import { WindowOptionModel } from './window-option'
import { GameMultiAccountModel, GameMultiAccountSnapshotIn } from './game-multi-account'

// TODO: remove later only for POC

/**
 * Model description here for TypeScript hints.
 */
export const OptionStoreModel = types
  .model('OptionStore')
  .props({
    window: types.optional(WindowOptionModel, {}),
    gameGeneral: types.optional(GameGeneralOptionModel, {}),
    gameFight: types.optional(GameFightOptionModel, {}),
    gameGroup: types.optional(GameGroupOptionModel, {}),
    gameJob: types.optional(GameJobOptionModel, {}),
    gameNotification: types.optional(GameNotificationOptionModel, {}),
    gameMultiAccount: types.optional(GameMultiAccountModel, {})
  })
  .actions((self) => ({
    restoreGameMultiAccount(gameMultiAccount: GameMultiAccountSnapshotIn) {
      applySnapshot(self.gameMultiAccount, gameMultiAccount)
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type OptionStoreType = Instance<typeof OptionStoreModel>

export interface OptionStore extends OptionStoreType {}

type OptionStoreSnapshotType = SnapshotOut<typeof OptionStoreModel>

export interface OptionStoreSnapshot extends OptionStoreSnapshotType {}
