import { UnlockForm } from '@/components'
import { Box, useTheme } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const UnlockScreen = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleUnlock = () => {
    navigate('/choose-team')
  }

  const handleSkip = () => {
    window.lindoAPI.closeUnlockWindow()
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: '100vh',
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <UnlockForm onSkip={handleSkip} onUnlock={handleUnlock} />
    </Box>
  )
}
