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
  }, [])

  return (
    <TabManager>
      <Box sx={{ display: 'flex', flex: 1 }} height='100%' width='100vw'>
        <SideBar />
        <Box sx={{ display: 'flex', position: 'relative', flex: 1 }}>
          <Observer>
            {() => (
              <>
                {gameStore.games.map((game) => {
                  const selected = gameStore.selectedGame?.id === game.id
                  return (
                    <div
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        overflow: 'hidden',
                        visibility: selected ? 'visible' : 'hidden'
                      }}
                      key={game.id}
                    >
                      <GameScreen key={game.id} game={game} />
                    </div>
                  )
                })}
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </TabManager>
  )
}
