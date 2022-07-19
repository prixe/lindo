import { UpdateProgress } from '@lindo/shared'
import { Box, LinearProgress, useTheme } from '@mui/material'
import React, { useEffect } from 'react'

export const UpdaterScreen = () => {
  const theme = useTheme()
  const [progress, setProgress] = React.useState<UpdateProgress>({ message: 'INIT', percent: 0 })

  useEffect(() => {
    document.title = 'Updater'

    return window.lindoAPI.subscribeToUpdateProgress((progress) => {
      setProgress(progress)
    })
  }, [])
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: '100vh',
        display: 'flex',
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <LinearProgress variant='buffer' sx={{ margin: 2 }} value={progress.percent} valueBuffer={100} />
      <Box sx={{ textAlign: 'center' }}>
        <span>{progress.message}</span>
      </Box>
    </Box>
  )
}
