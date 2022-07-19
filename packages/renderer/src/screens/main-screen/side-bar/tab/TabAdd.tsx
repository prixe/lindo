import React from 'react'
import styles from './tab.module.scss'
import classNames from 'classnames'
import { darken, Icon, lighten, styled } from '@mui/material'
import { useStores } from '@/store'
import { useI18nContext } from '@lindo/i18n'

interface TabAddProps {
  className?: string
}

export const TabAdd = styled((props: TabAddProps) => {
  const { gameStore } = useStores()
  const { LL } = useI18nContext()

  const handleAddGame = () => {
    if (gameStore.games.length < 6) {
      gameStore.addGame()
    } else {
      alert(LL.window.main.tabsOverflow.text())
      gameStore.addGame()
    }
  }

  return (
    <div onClick={handleAddGame} className={classNames(styles.tab, props.className)}>
      <Icon sx={{ fontSize: 24 }}>add</Icon>
    </div>
  )
})(
  ({ theme }) => `
  background: ${darken(theme.palette.background.paper, 0.2)};
  color: ${lighten(theme.palette.background.paper, 0.5)};
  border: 1px dashed ${lighten(theme.palette.background.paper, 0.2)};

  &:hover {
    background: ${theme.palette.background.paper};
  }
`
)
