import React, { useRef, useEffect } from 'react'
import styles from './tab.module.scss'
import classNames from 'classnames'
import { darken, Icon, IconButton, lighten, styled, Tooltip } from '@mui/material'
import { Game, useStores } from '@/store'
import { Observer } from 'mobx-react-lite'
import { reaction } from 'mobx'

export interface TabGameProps {
  game: Game
  className?: string
}

export const TabGame = styled(({ game, className }: TabGameProps) => {
  const { gameStore } = useStores()
  const characterIconRef = useRef<HTMLDivElement>(null)

  const handleClose = (event: React.MouseEvent) => {
    gameStore.removeGame(game)
    return event.stopPropagation()
  }

  useEffect(() => {
    const updateCharIcon = () => {
      if (characterIconRef.current && game.characterIcon) {
        characterIconRef.current.appendChild(game.characterIcon)
        characterIconRef.current.style.display = 'block'
      } else if (characterIconRef.current) {
        characterIconRef.current.innerHTML = ''
        characterIconRef.current.style.display = 'none'
      }
    }
    const disposer = reaction(
      () => game.characterIcon,
      (characterIcon) => {
        console.log(characterIcon)
        updateCharIcon()
      }
    )
    updateCharIcon()

    return disposer
  }, [game])

  return (
    <Observer>
      {() => {
        const active = gameStore.selectedGame === game
        return (
          <Tooltip title={game.characterName ?? ''} placement='right'>
            <div
              onClick={() => gameStore.selectGame(game)}
              className={classNames(styles.tab, styles['tab-game'], className, {
                focus: active,
                notification: game.hasNotification
              })}
            >
              <div className={styles['icon-char']} ref={characterIconRef} />
              {!game.characterIcon && <Icon sx={{ fontSize: 24 }}>keyboard</Icon>}
              <IconButton className={styles['tab-close']} onClick={handleClose}>
                <Icon sx={{ fontSize: 15, position: 'absolute', top: 2, left: 2 }}>close</Icon>
              </IconButton>
            </div>
          </Tooltip>
        )
      }}
    </Observer>
  )
})(
  ({ theme }) => `
    background: ${darken(theme.palette.background.paper, 0.2)};
    color: ${lighten(theme.palette.background.paper, 0.5)};
    border: 1px ${lighten(theme.palette.background.paper, 0.2)};
    
    &:hover {
      background: ${theme.palette.background.paper};
    }
    &.notification {
      opacity: 1;
      animation: blink 1.5s linear infinite;
    }
    &.focus {
      opacity: 1;
      color: white;
      border-width: 2px;
      border-color: ${darken(theme.palette.primary.main, 0.2)};
    }

    @keyframes blink {
      0% {
        border-color: #fffc89;
      }
      50% {
        border-color: #ff8d5f;
      }
      100% {
        border-color: #fffc89;
      }
    }
`
)
