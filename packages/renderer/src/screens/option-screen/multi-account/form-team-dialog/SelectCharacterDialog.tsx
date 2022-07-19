import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { useStores } from '@/store'
import { Observer } from 'mobx-react-lite'
import { CharacterCard } from '../components'
import { GameCharacter } from '@lindo/shared'
import { useI18nContext } from '@lindo/i18n'

export interface SelectCharacterDialogProps {
  open: boolean
  ignore?: Array<string>
  onClose: () => void
  onSelect: (character: GameCharacter) => void
}

export const SelectCharacterDialog = ({ onClose, onSelect, open, ignore = [] }: SelectCharacterDialogProps) => {
  const {
    optionStore: { gameMultiAccount }
  } = useStores()
  const { LL } = useI18nContext()

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{LL.option.multiAccount.dialogs.selectCharacter.title()}</DialogTitle>
      <DialogContent>
        <Observer>
          {() => (
            <Grid container>
              {gameMultiAccount.characters
                .filter((character) => !ignore.includes(character.id))
                .map((character) => (
                  <Grid item key={character.id} xs={3}>
                    <CharacterCard character={character} onSelect={onSelect} />
                  </Grid>
                ))}
            </Grid>
          )}
        </Observer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{LL.option.multiAccount.dialogs.selectCharacter.cancel()}</Button>
      </DialogActions>
    </Dialog>
  )
}
