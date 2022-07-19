import { IPCEvents, RootStoreModel, RootStore, RootStoreSnapshot } from '@lindo/shared'
import { ipcMain, webContents } from 'electron'
import hash from 'object-hash'
import { applyPatch, getSnapshot, IJsonPatch, Instance, onPatch } from 'mobx-state-tree'
import ElectronStore from 'electron-store'
import persist from './root-store-persist'

/**
 * The key we'll be saving our state as within async storage.
 */
// const ROOT_STATE_STORAGE_KEY = 'root'

/**
 * Setup the root state.
 */
export async function setupRootStore(): Promise<RootStore> {
  // prepare the environment that will be associated with the RootStore.
  const env = await Promise.resolve({})
  // const optionsPlugin = await SystemJS.import("http://localhost:3001/dist/plugin-test.js");

  // const ExtendedRootStoreModel = RootStoreModel.props({
  //   optionsStore: types.optional(optionsPlugin.PluginStoreModel, {}),
  // })

  const rootStore: Instance<typeof RootStoreModel> = RootStoreModel.create({}, env)
  const storage = new ElectronStore<{ rootStore: RootStoreSnapshot }>()

  await persist('rootStore', rootStore, {
    storage,
    beforeSave: (rootStore: RootStoreSnapshot) => {
      // ignore gameMultiAccount, will be encrypted later
      return {
        ...rootStore,
        optionStore: {
          ...rootStore.optionStore,
          gameMultiAccount: undefined
        }
      }
    }
  })
  console.log('RootStore -> restored')

  const patchesFromRenderer: Array<string> = []

  ipcMain.handle(IPCEvents.INIT_STATE_ASYNC, async () => {
    return JSON.stringify(getSnapshot(rootStore))
  })

  ipcMain.on(IPCEvents.INIT_STATE, (event) => {
    event.returnValue = JSON.stringify(getSnapshot(rootStore))
  })

  // When receiving an action from a renderer
  ipcMain.on(IPCEvents.PATCH, (event, patch: IJsonPatch) => {
    // TODO: manage local patch, scoped to one process
    // const localPatch = stopForwarding(patch)
    console.log('Got patch: ', patch)
    patchesFromRenderer.push(hash(patch))
    applyPatch(rootStore, patch)

    // Forward it to all of the other renderers
    webContents.getAllWebContents().forEach((contents) => {
      // Ignore the renderer that sent the action and chromium devtools
      if (contents.id !== event.sender.id && !contents.getURL().startsWith('devtools://')) {
        contents.send(IPCEvents.PATCH, patch)
      }
    })
  })

  onPatch(rootStore, (patch) => {
    console.info('Got change: ', patch)

    const patchHash = hash(patch)
    if (patchesFromRenderer.includes(patchHash)) {
      console.log('patch already applied ', patchHash)
      patchesFromRenderer.splice(patchesFromRenderer.indexOf(patchHash), 1)
      return
    }

    webContents.getAllWebContents().forEach((contents) => {
      contents.send(IPCEvents.PATCH, patch)
    })
  })

  return rootStore
}
