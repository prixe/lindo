import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Observer } from 'mobx-react-lite'
import { useI18nContext } from '@lindo/i18n'
import { AccountContainer } from './account-container'
import { useStores } from '@/store'
import { UnlockForm } from '@/components'
import { useDialog } from '@/hooks'
import { ConfigurePasswordDialog } from './password-form-dialog/ConfigurePasswordDialog'
import { ChangePasswordDialog } from './password-form-dialog/ChangePasswordDialog'
import { RemovePasswordDialog } from './password-form-dialog/RemovePasswordDialog'

export const OptionMultiAccount = () => {
  const { LL } = useI18nContext()
  const {
    optionStore: { gameMultiAccount }
  } = useStores()
  const [openConfigurePasswordDialog, , toggleConfigurePasswordDialog] = useDialog()
  const [openChangePasswordDialog, , toggleChangePasswordDialog] = useDialog()
  const [openRemovePasswordDialog, , toggleRemovePasswordDialog] = useDialog()

  return (
    <>
      <Observer>
        {() => (
          <Box sx={{ flex: 1 }}>
            <Box sx={{ p: 2, flexGrow: 1, flex: 1, display: 'flex' }}>
              {!gameMultiAccount.configured && (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Typography>{LL.option.multiAccount.notConfigured()}</Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant='outlined' onClick={toggleConfigurePasswordDialog}>
                      {LL.option.multiAccount.configurePassword()}
                    </Button>
                  </Box>
                </Box>
              )}
              {!gameMultiAccount.locked && gameMultiAccount.configured && (
                <Box>
                  <Typography>{LL.option.multiAccount.enable()}</Typography>

                  <Stack spacing={2} direction='row' sx={{ mt: 3 }}>
                    <Button variant='outlined' onClick={toggleChangePasswordDialog}>
                      {LL.option.multiAccount.changePassword()}
                    </Button>
                    <Button variant='outlined' onClick={toggleRemovePasswordDialog}>
                      {LL.option.multiAccount.removePassword()}
                    </Button>
                  </Stack>
                </Box>
              )}
              {gameMultiAccount.locked && gameMultiAccount.configured && (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <UnlockForm />
                  <Stack spacing={2} direction='row' sx={{ mt: 3 }}>
                    <Button variant='outlined' onClick={toggleChangePasswordDialog}>
                      {LL.option.multiAccount.changePassword()}
                    </Button>
                    <Button variant='outlined' onClick={toggleRemovePasswordDialog}>
                      {LL.option.multiAccount.removePassword()}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
            {gameMultiAccount.configured && !gameMultiAccount.locked && (
              <Box>
                <AccountContainer />
              </Box>
            )}
          </Box>
        )}
      </Observer>
      <ConfigurePasswordDialog open={openConfigurePasswordDialog} onClose={toggleConfigurePasswordDialog} />
      <ChangePasswordDialog open={openChangePasswordDialog} onClose={toggleChangePasswordDialog} />
      <RemovePasswordDialog open={openRemovePasswordDialog} onClose={toggleRemovePasswordDialog} />
    </>
  )
}
