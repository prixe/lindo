import * as shared from '@lindo/shared'
import { SnapshotOut, types } from 'mobx-state-tree'
import { GameStore, GameStoreModel } from '../game-store'

/**
 * A RootStore model.
 */
export const RootStoreModel = shared.RootStoreModel.props({
  gameStore: types.optional(GameStoreModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends shared.RootStore {
  gameStore: GameStore
}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
