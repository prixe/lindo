import React, { useEffect } from 'react'
import { useStores } from '@/store'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useForm, useFieldArray } from 'react-hook-form'
import { TextFieldElement } from 'react-hook-form-mui'
import { TeamWindowCard, TeamWindowForm } from './TeamWindowCard'
import { GameTeam, GameTeamSnapshotIn } from '@lindo/shared'
import { useI18nContext } from '@lindo/i18n'

export interface AddTeamDialogProps {
  open: boolean
  onClose: () => void
  value?: GameTeam
}

export interface TeamForm {
  id?: string
  name: string
  windows: Array<TeamWindowForm>
}

const mapValuesToForm = (value: GameTeam): TeamForm => {
  return {
    id: value.id,
    name: value.name,
    windows: value.windows.map((window) => ({
      characters: window.characters
    }))
  }
}

export const FormTeamDialog = ({ onClose, open, value }: AddTeamDialogProps) => {
  const { optionStore } = useStores()
  const { control, handleSubmit, reset } = useForm<TeamForm>({
    defaultValues: value
      ? mapValuesToForm(value)
      : {
          windows: [{}]
        }
  })
  const { LL } = useI18nContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'windows'
  })

  useEffect(() => {
    reset(
      value
        ? mapValuesToForm(value)
        : {
            windows: [{}]
          }
    )
  }, [open, value])

  const onSubmit = (data: TeamForm) => {
    const team: GameTeamSnapshotIn = {
      id: data.id,
      name: data.name,
      windows: data.windows.map((window) => ({
        characters: window.characters.map((c) => c.id)
      }))
    }
    if (data.id) {
      optionStore.gameMultiAccount.updateTeam(team)
    } else {
      optionStore.gameMultiAccount.addTeam(team)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullScreen>
      <DialogTitle>{LL.option.multiAccount.dialogs.teamDialog.title()}</DialogTitle>
      <DialogContent>
        <Box
          id='character-form'
          sx={{ mt: 2 }}
          component='form'
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextFieldElement
            name='name'
            control={control}
            required
            fullWidth
            label={LL.option.multiAccount.dialogs.teamDialog.teamName()}
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {fields.map((window, index) => (
              <Grid key={index} item xs={6}>
                <TeamWindowCard onRemove={() => remove(index)} index={index} control={control} />
              </Grid>
            ))}
          </Grid>
          <Button startIcon={<AddIcon />} variant='outlined' sx={{ mt: 2 }} onClick={() => append({})}>
            {LL.option.multiAccount.dialogs.teamDialog.addWindow()}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{LL.option.multiAccount.dialogs.teamDialog.cancel()}</Button>
        <Button variant='contained' type='submit' form='character-form'>
          {LL.option.multiAccount.dialogs.teamDialog.confirm()}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
