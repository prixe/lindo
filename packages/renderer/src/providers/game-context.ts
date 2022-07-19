import { GameContext } from '@lindo/shared'
import { createContext, useContext } from 'react'

/**
 * Create a context we can use to
 * - Provide access to our stores from our root component
 * - Consume stores in our screens (or other components, though it's
 *   preferable to just connect screens)
 */
const _GameContext = createContext<GameContext>({} as GameContext)

/**
 * The provider our root component will use to expose the root store
 */
export const GameContextProvider = _GameContext.Provider

/**
 * A hook that screens can use to gain access to our stores, with
 * `const { someStore, someOtherStore } = useStores()`,
 * or less likely: `const rootStore = useStores()`
 */
export const useGameContext = () => useContext(_GameContext)
