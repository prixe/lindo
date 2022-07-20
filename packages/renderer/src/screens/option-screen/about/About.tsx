import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useStores } from '@/store'
import { Observer } from 'mobx-react-lite'
import { OFFICIAL_WEBSITE_URL } from '@lindo/shared'

export const About = () => {
  const { appStore } = useStores()

  return (
    <Observer>
      {() => (
        <>
          <Box sx={{ p: 2, flexGrow: 1, flex: 1 }}>
            <Typography variant='h5' component='h2' gutterBottom>
              Lindo {appStore.appVersion}
            </Typography>
            <Typography>
              Official website{' '}
              <Button variant='text' onClick={window.lindoAPI.openOfficialWebsite}>
                {OFFICIAL_WEBSITE_URL}
              </Button>
            </Typography>
          </Box>
        </>
      )}
    </Observer>
  )
}
