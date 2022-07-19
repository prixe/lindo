import hash from 'object-hash'
import { applyPatch, IJsonPatch, Instance, onPatch } from 'mobx-state-tree'
import { RootStoreModel } from './root-store'
/**
 * The key we'll be saving our state as within async storage.
 */
// const ROOT_STATE_STORAGE_KEY = 'root'

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  console.log('setupRootStore')
  // prepare the environment that will be associated with the RootStore.
  const env = await Promise.resolve({})

  const state = await window.lindoAPI.fetchInitialStateAsync()
  console.log('Got initial state: ', state)

  // const optionsPlugin = await SystemJS.import("http://localhost:3001/dist/plugin-test.js");

  // const ExtendedRootStoreModel = RootStoreModel.props({
  //   optionsStore: types.optional(optionsPlugin.PluginStoreModel, {}),
  // })

  const rootStore: Instance<typeof RootStoreModel> = RootStoreModel.create(state, env)

  const patchesFromMain: Array<string> = []

  window.window.lindoAPI.subscribeToIPCPatch((patch: IJsonPatch) => {
    console.log({ patch })
    patchesFromMain.push(hash(patch))
    applyPatch(rootStore, patch)
  })

  onPatch(rootStore, (patch) => {
    console.log('onPatch', patch)
    // ignore local storage patches
    if (patch.path.startsWith('/gameStore')) {
      return
    }

    const patchHash = hash(patch)
    if (patchesFromMain.includes(patchHash)) {
      console.log('patch already applied ', patchHash)
      patchesFromMain.splice(patchesFromMain.indexOf(patchHash), 1)
      return
    }
    window.lindoAPI.forwardPatchToMain(patch)
  })

  return rootStore
}
