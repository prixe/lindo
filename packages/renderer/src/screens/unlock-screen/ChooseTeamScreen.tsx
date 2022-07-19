import React from 'react'
import { useStores } from '@/store'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  darken,
  Grid,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { Observer } from 'mobx-react-lite'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CharacterCard } from '../option-screen/multi-account/components'
import { GameTeam } from '@lindo/shared'
import { useI18nContext } from '@lindo/i18n'

export const ChooseTeamScreen = () => {
  const theme = useTheme()
  const { LL } = useI18nContext()
  const {
    optionStore: { gameMultiAccount }
  } = useStores()

  const handleSkip = () => {
    window.lindoAPI.closeUnlockWindow()
  }

  const handleConnect = (e: React.MouseEvent<HTMLElement>, team: GameTeam) => {
    e.stopPropagation()
    window.lindoAPI.selectTeamToConnect(team.id)
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: '100vh',
        display: 'flex',
        p: 2,
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <Box>
        <Typography>{LL.window.unlockScreen.chooseTeamConnect()}</Typography>
        <Observer>
          {() => (
            <>
              {gameMultiAccount.teams.map((team) => (
                <Accordion key={team.id} sx={{ backgroundColor: darken(theme.palette.background.paper, 0.3) }}>
                  <AccordionSummary
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>{team.name}</Typography>
                    <Typography sx={{ color: 'text.secondary', flex: 1 }}>
                      {team.allCharacters.map((c) => `${c.name}`).join(', ')}
                    </Typography>
                    <Button onClick={(e) => handleConnect(e, team)} sx={{ mr: 1 }}>
                      {LL.window.unlockScreen.connect()}
                    </Button>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {team.windows.map((window, index) => (
                        <Grid xs={6} item key={window.id}>
                          <Card>
                            <CardHeader title={'Window ' + (index + 1)}></CardHeader>
                            <CardContent>
                              <Grid container spacing={2}>
                                {window.characters.map((character) => (
                                  <Grid item key={character.id}>
                                    <CharacterCard display='preview' size='small' character={character} />
                                  </Grid>
                                ))}
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          )}
        </Observer>
        <Stack sx={{ mt: 2 }} alignSelf={'stretch'} direction='row' justifyContent='space-between'>
          <Button onClick={handleSkip}>{LL.window.unlockScreen.skip()}</Button>
        </Stack>
      </Box>
    </Box>
  )
}
