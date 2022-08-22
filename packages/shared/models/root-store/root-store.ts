import { applySnapshot, SnapshotOut, types } from 'mobx-state-tree'
import { AppStore, AppStoreModel } from '../app-store'
import { OptionStore, OptionStoreModel } from '../option-store'
import { HotkeyStore, HotkeyStoreModel } from '../hotkey-store'
import { ModStore, ModStoreModel } from '../mod-store'

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model('RootStore')
  .props({
    optionStore: types.optional(OptionStoreModel, {}),
    appStore: types.optional(AppStoreModel, {}),
    hotkeyStore: types.optional(HotkeyStoreModel, {}),
    modStore: types.optional(ModStoreModel, {})
  })
  .actions((self) => ({
    reset() {
      applySnapshot(self, {})
    }
  }))

/**
 * The RootStore instance.
 */
export interface RootStore {
  optionStore: OptionStore
  appStore: AppStore
  hotkeyStore: HotkeyStore
  modStore: ModStore
  reset: () => void
}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
