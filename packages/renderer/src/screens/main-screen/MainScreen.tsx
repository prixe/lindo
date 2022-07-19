import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { SideBar } from './side-bar/SideBar'
import { Observer } from 'mobx-react-lite'
import { GameScreen } from './game-screen/GameScreen'
import { useStores } from '@/store'
import { TabManager } from './tab-manager'
import { useGameContext } from '@/providers'

export const MainScreen = () => {
  const { gameStore } = useStores()
  const gameContext = useGameContext()
  const didLoadGames = useRef(false)

  useEffect(() => {
    if (didLoadGames.current === true) {
      return
    }
    didLoadGames.current = true
    if (gameContext.multiAccount) {
      gameStore.gamesFromTeamWindow(gameContext.multiAccount)
    } else {
      gameStore.addGame()
    }
  })

  return (
    <TabManager>
      <Box sx={{ display: 'flex', flex: 1 }} height='100%' width='100vw'>
        <SideBar />
        <Observer>
          {() => (
            <>
              {gameStore.games.map((game) => (
                <div
                  style={{
                    flex: 1,
                    display: gameStore.selectedGame?.id !== game.id ? 'none' : 'flex'
                  }}
                  key={game.id}
                >
                  <GameScreen key={game.id} game={game} />
                </div>
              ))}
            </>
          )}
        </Observer>
      </Box>
    </TabManager>
  )
}
