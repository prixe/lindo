import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useStores } from '@/store'
import { Observer } from 'mobx-react-lite'
import { GITHUB_URL, MATRIX_URL, OFFICIAL_WEBSITE_URL } from '@lindo/shared'

export const About = () => {
  const { appStore } = useStores()

  return (
    <Observer>
      {() => (
        <>
          <Box sx={{ p: 2, flexGrow: 1, flex: 1 }}>
            <Typography variant='h5' component='h2' gutterBottom>
              Lindo {appStore.lindoVersion}
            </Typography>
            <Typography>
              Official website{' '}
              <Button variant='text' target='_blank' href={OFFICIAL_WEBSITE_URL}>
                {OFFICIAL_WEBSITE_URL}
              </Button>
            </Typography>
            <Typography>
              GitHub{' '}
              <Button variant='text' target='_blank' href={GITHUB_URL}>
                {GITHUB_URL}
              </Button>
            </Typography>
            <Typography>
              Chat Server{' '}
              <Button variant='text' target='_blank' href={MATRIX_URL}>
                {MATRIX_URL}
              </Button>
            </Typography>
          </Box>
        </>
      )}
    </Observer>
  )
}
