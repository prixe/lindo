import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useStores } from '@/store'
import { Observer } from 'mobx-react-lite'
import styles from './about.module.scss'
import { GITHUB_URL, MATRIX_URL, OFFICIAL_WEBSITE_URL, REDDIT_URL } from '@lindo/shared'
import { useI18nContext } from '@lindo/i18n'

export const About = () => {
  const { appStore } = useStores()
  const { LL } = useI18nContext()

  return (
    <Observer>
      {() => (
        <>
          <Box sx={{ p: 2, flexGrow: 1, flex: 1 }}>
            <Typography variant='h5' component='h2' gutterBottom>
              Lindo {appStore.lindoVersion}
            </Typography>
            <Typography>
              <>
                {LL.option.about.links.website()}{' '}
                <Button variant='text' target='_blank' href={OFFICIAL_WEBSITE_URL}>
                  {OFFICIAL_WEBSITE_URL}
                </Button>
              </>
            </Typography>
            <Typography>
              <>
                {LL.option.about.links.chat()}{' '}
                <Button variant='text' target='_blank' href={MATRIX_URL}>
                  {MATRIX_URL}
                </Button>
              </>
            </Typography>
            <Typography>
              <>
                {LL.option.about.links.reddit()}{' '}
                <Button variant='text' target='_blank' href={MATRIX_URL}>
                  {REDDIT_URL}
                </Button>
              </>
            </Typography>
            <Typography>
              <>
                {LL.option.about.links.github()}{' '}
                <Button variant='text' target='_blank' href={GITHUB_URL}>
                  {GITHUB_URL}
                </Button>
              </>
            </Typography>
            <Typography className={styles['description-title']} variant='h5' component='h2'>
              {LL.option.about.title()}
            </Typography>
            <Typography className={styles.description}>{LL.option.about.text0()}</Typography>
            <Typography className={styles.description}>{LL.option.about.text1()}</Typography>
            <Typography className={styles.description}>{LL.option.about.text2()}</Typography>
          </Box>
        </>
      )}
    </Observer>
  )
}
