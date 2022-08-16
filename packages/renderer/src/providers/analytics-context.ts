import { Analytics } from 'firebase/analytics'
import { createContext, useContext } from 'react'

/**
 * Create a context we can use to
 * - Provide access to our stores from our root component
 * - Consume stores in our screens (or other components, though it's
 *   preferable to just connect screens)
 */
const _AnalyticsContext = createContext<Analytics>({} as Analytics)

/**
 * The provider our root component will use to expose the root store
 */
export const AnalyticsContextProvider = _AnalyticsContext.Provider

/**
 * A hook that screens can use to gain access to our stores, with
 * `const { someStore, someOtherStore } = useStores()`,
 * or less likely: `const rootStore = useStores()`
 */
export const useAnalyticsContext = () => useContext(_AnalyticsContext)
