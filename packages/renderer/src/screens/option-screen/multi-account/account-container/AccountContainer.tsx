import { useStores } from '@/store'
import React from 'react'
import { Box, Button, CardContent } from '@mui/material'
import { Observer } from 'mobx-react-lite'
import AddIcon from '@mui/icons-material/Add'
import { CharacterCard, CharacterGenericCard, TeamAccordion } from '../components'
import { useDialog } from '@/hooks'
import { AddCharacterDialog } from '../add-character-dialog'
import { FormTeamDialog } from '../form-team-dialog'
import { useI18nContext } from '@lindo/i18n'

export const AccountContainer = () => {
  const {
    optionStore: { gameMultiAccount }
  } = useStores()
  const { LL } = useI18nContext()
  const [openAddCharacterDialog, , toggleAddCharacterDialog] = useDialog()
  const [openAddTeamDialog, , toggleAddTeamDialog] = useDialog()

  return (
    <>
      <Box
        sx={{ flexDirection: 'row', p: 2, display: 'flex', gap: '10px', width: 'calc(100vw - 150px)' }}
        style={{ overflowX: 'auto' }}
      >
        <CharacterGenericCard>
          <CardContent>
            <Button onClick={toggleAddCharacterDialog} size='small' startIcon={<AddIcon />}>
              {LL.option.multiAccount.addCharacter()}
            </Button>
          </CardContent>
        </CharacterGenericCard>
        <Observer>
          {() => (
            <>
              {gameMultiAccount.characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </>
          )}
        </Observer>
      </Box>
      <Box sx={{ p: 2 }}>
        <Observer>
          {() => (
            <>
              {gameMultiAccount.teams.map((team) => (
                <TeamAccordion key={team.id} team={team} />
              ))}
            </>
          )}
        </Observer>
        <Button size='small' sx={{ mt: 1 }} onClick={toggleAddTeamDialog} startIcon={<AddIcon />}>
          {LL.option.multiAccount.newTeam()}
        </Button>
      </Box>
      <AddCharacterDialog open={openAddCharacterDialog} onClose={toggleAddCharacterDialog} />
      <FormTeamDialog open={openAddTeamDialog} onClose={toggleAddTeamDialog} />
    </>
  )
}
