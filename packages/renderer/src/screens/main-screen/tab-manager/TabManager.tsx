import { useStores } from '@/store'
import React, { useEffect } from 'react'
export interface TabManagerProps {
  children: React.ReactNode
}

/**
 * Manage hotkeys and action for game tabs
 **/
export const TabManager = ({ children }: TabManagerProps) => {
  const { gameStore } = useStores()

  useEffect(
    () =>
      window.lindoAPI.subscribeToNewTab(() => {
        gameStore.addGame()
      }),
    []
  )

  useEffect(
    () =>
      window.lindoAPI.subscribeToNextTab(() => {
        gameStore.selectNextGame()
      }),
    []
  )

  useEffect(
    () =>
      window.lindoAPI.subscribeToPrevTab(() => {
        gameStore.selectPreviousGame()
      }),
    []
  )

  useEffect(
    () =>
      window.lindoAPI.subscribeToCloseTab(() => {
        gameStore.removeSelectedGame()
      }),
    []
  )

  useEffect(() =>
    window.lindoAPI.subscribeToSelectTab((tabIndex: number) => {
      gameStore.selectGameIndex(tabIndex)
    })
  )

  return <>{children}</>
}
