import { RootStore, RootStoreSnapshot } from '@lindo/shared'
import ElectronStore from 'electron-store'
import { onSnapshot, applySnapshot, IStateTreeNode } from 'mobx-state-tree'

export interface IOptions {
  storage: ElectronStore<{ rootStore: RootStoreSnapshot }>
  beforeSave?: (rootStore: RootStoreSnapshot) => object
}
export interface IArgs {
  (name: 'rootStore', store: RootStore & IStateTreeNode, options?: IOptions): Promise<void>
}

export const persist: IArgs = (name, store, options) => {
  const { storage, beforeSave } = options ?? {}

  // use AsyncLocalStorage by default (or if localStorage was passed in)
  if (!storage) {
    return Promise.reject(
      new Error(
        'localStorage (the default storage engine) is not ' +
          'supported in this environment. Please configure a different storage ' +
          'engine via the `storage:` option.'
      )
    )
  }

  onSnapshot(store, (_snapshot: RootStoreSnapshot) => {
    // need to shallow clone as otherwise properties are non-configurable (https://github.com/agilgur5/mst-persist/pull/21#discussion_r348105595)
    const snapshot = beforeSave ? beforeSave(_snapshot) : _snapshot
    storage.set(name, snapshot)
  })

  return Promise.resolve(storage.get(name)).then((data) => {
    const snapshot = !isString(data) ? data : JSON.parse(data)
    // don't apply false (which will error), leave store in initial state
    if (!snapshot) {
      return
    }
    try {
      applySnapshot(store, snapshot)
    } catch (e) {
      console.log(e)
    }
  })
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export default persist
