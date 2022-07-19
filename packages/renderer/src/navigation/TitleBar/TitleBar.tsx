import { Box, Typography } from '@mui/material'
import React from 'react'
import styles from './title-bar.module.scss'

export const TITLE_BAR_HEIGHT = '26px'

export const TitleBar = () => {
  return (
    <Box
      sx={{ width: '100vw', height: TITLE_BAR_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      className={styles['title-bar']}
    >
      <Typography>Lindo</Typography>
    </Box>
  )
}
