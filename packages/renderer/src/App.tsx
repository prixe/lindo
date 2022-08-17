import { ThemeProvider } from '@mui/material/styles'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { setupRootStore, RootStore, RootStoreProvider } from './store'
import { Navigator } from './navigation'
import { AnalyticsContextProvider, GameContextProvider, LocalProvider } from './providers'
import { GameContext } from '@lindo/shared'
import { TypesafeI18n } from '@lindo/i18n'
import { CssBaseline } from '@mui/material'
import { darkTheme, lightTheme } from './themes'
import { useAnalytics } from './hooks'
import { Analytics } from '@firebase/analytics'

export const App = () => {
  const analytics = useAnalytics()

  const didSetUpRootStoreRef = useRef(false)
  const didSetUpGameContextRef = useRef(false)
  // TODO: fix lightTheme
  const prefersDarkMode = true // useMediaQuery('(prefers-color-scheme: dark)')
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [gameContext, setGameContext] = useState<GameContext | undefined>(undefined)
  const [analyticsContext, setAnalyticsContext] = useState<Analytics | undefined>(undefined)

  const theme = useMemo(() => (prefersDarkMode ? darkTheme : lightTheme), [prefersDarkMode])

  useEffect(() => {
    // prevents to setup root store multiple times
    // cf. React 18 https://github.com/reactwg/react-18/discussions/18
    if (didSetUpRootStoreRef.current === false) {
      didSetUpRootStoreRef.current = true
      setupRootStore().then((rootStore) => {
        window.appVersion = rootStore.appStore.appVersion
        window.buildVersion = rootStore.appStore.buildVersion
        window.lindoVersion = rootStore.appStore.lindoVersion
        setRootStore(rootStore)
      })
    }
    if (didSetUpGameContextRef.current === false) {
      didSetUpGameContextRef.current = true
      window.lindoAPI.fetchGameContext().then(setGameContext)
    }
  }, [])

  useEffect(() => {
    if (rootStore && gameContext) {
      // display window
      window.lindoAPI.appReadyToShow()

      // set analytics
      const analyticsInstance = analytics.createInstance(
        rootStore.appStore.userId,
        rootStore.appStore.lindoVersion,
        gameContext.platform
      )
      setAnalyticsContext(analyticsInstance)
      window.key = gameContext[atob('aGFzaA==') as never]
    }
  }, [rootStore, gameContext])

  if (!rootStore || !gameContext || !analyticsContext) return null

  return (
    <TypesafeI18n locale={rootStore.appStore.language}>
      <RootStoreProvider value={rootStore}>
        <LocalProvider>
          <AnalyticsContextProvider value={analyticsContext}>
            <GameContextProvider value={gameContext}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Navigator />
              </ThemeProvider>
            </GameContextProvider>
          </AnalyticsContextProvider>
        </LocalProvider>
      </RootStoreProvider>
    </TypesafeI18n>
  )
}
