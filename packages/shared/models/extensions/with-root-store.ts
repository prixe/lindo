import { getRoot, IStateTreeNode } from 'mobx-state-tree'
import type { RootStore } from '../root-store/root-store'

/**
 * Adds a rootStore property to the node for a convenient
 * and strongly typed way for stores to access other stores.
 */
export const withRootStore = (self: IStateTreeNode) => ({
  views: {
    /**
     * The root store.
     */
    get rootStore(): RootStore {
      return getRoot<RootStore>(self)
    }
  }
})
