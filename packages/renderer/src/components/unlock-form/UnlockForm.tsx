import { useI18nContext } from '@lindo/i18n'
import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { PasswordElement } from 'react-hook-form-mui'

export interface UnlockFormProps {
  onSkip?: () => void
  onUnlock?: () => void
}

export const UnlockForm = ({ onSkip, onUnlock }: UnlockFormProps) => {
  const { control, handleSubmit, setError } = useForm<{ password: string }>()
  const { LL } = useI18nContext()

  const onSubmit = async (data: { password: string }) => {
    const result = await window.lindoAPI.unlockApplication(data.password)
    if (!result) {
      setError('password', { message: LL.window.unlockScreen.invalidPassword() }, { shouldFocus: true })
    } else {
      if (onUnlock) onUnlock()
    }
  }

  return (
    <Box noValidate autoComplete='off' component='form' onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: '40ch' }}>
      <Typography>{LL.window.unlockScreen.info()}</Typography>
      <PasswordElement
        autoFocus
        fullWidth
        required
        sx={{ mt: 2 }}
        name='password'
        label={LL.window.unlockScreen.masterPassword()}
        control={control}
      />
      <Stack sx={{ mt: 2 }} alignSelf={'stretch'} direction='row' justifyContent='space-between'>
        {onSkip && <Button onClick={onSkip}>{LL.window.unlockScreen.skip()}</Button>}
        <Button variant='contained' type='submit'>
          {LL.window.unlockScreen.unlock()}
        </Button>
      </Stack>
    </Box>
  )
}
