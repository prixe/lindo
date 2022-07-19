import { ThemeProvider } from '@mui/material/styles'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { setupRootStore, RootStore, RootStoreProvider } from './store'
import { Navigator } from './navigation'
import { GameContextProvider } from './providers'
import { GameContext } from '@lindo/shared'
import { TypesafeI18n } from '@lindo/i18n'
import { CssBaseline } from '@mui/material'
import { darkTheme, lightTheme } from './themes'

export const App = () => {
  const didSetUpRootStoreRef = useRef(false)
  const didSetUpGameContextRef = useRef(false)
  // TODO: fix lightTheme
  const prefersDarkMode = true // useMediaQuery('(prefers-color-scheme: dark)')
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [gameContext, setGameContext] = useState<GameContext | undefined>(undefined)

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

  if (!rootStore || !gameContext) return null

  return (
    <TypesafeI18n locale='en'>
      <RootStoreProvider value={rootStore}>
        <GameContextProvider value={gameContext}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navigator />
          </ThemeProvider>
        </GameContextProvider>
      </RootStoreProvider>
    </TypesafeI18n>
  )
}
