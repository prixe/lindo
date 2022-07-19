import { useConst } from '@/hooks'
import { useStores } from '@/store'
import { reaction } from 'mobx'
import React, { useEffect } from 'react'
import { Shortcuts } from 'shortcuts'
export interface TabManagerProps {
  children: React.ReactNode
}

/**
 * Manage hotkeys and action for game tabs
 **/
export const TabManager = ({ children }: TabManagerProps) => {
  const { gameStore, hotkeyStore } = useStores()
  const shortcuts = useConst(new Shortcuts())

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

  useEffect(() => {
    const setTabHotKeys = () => {
      shortcuts.reset()
      shortcuts.add(
        hotkeyStore.window.tabs.map((tab, index) => ({
          shortcut: tab,
          handler: () => {
            gameStore.selectGameIndex(index)
          }
        }))
      )
    }
    setTabHotKeys()
    return reaction(
      () => hotkeyStore.window.tabs,
      () => {
        setTabHotKeys()
      }
    )
  }, [hotkeyStore.window.tabs])

  return <>{children}</>
}
