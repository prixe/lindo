import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'
import { useI18nContext } from '@lindo/i18n'

export interface RemovePasswordDialogProps {
  onClose: () => void
  open: boolean
}

export const RemovePasswordDialog = ({ open, onClose }: RemovePasswordDialogProps) => {
  const { LL } = useI18nContext()
  const handleRemovePassword = async () => {
    window.lindoAPI.removeMasterPassword()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{LL.option.multiAccount.dialogs.passwordDialog.removePassword()}</DialogTitle>
      <DialogContent>
        <DialogContentText>{LL.option.multiAccount.dialogs.passwordDialog.removePasswordInfo()}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRemovePassword} color='error'>
          {LL.option.multiAccount.dialogs.passwordDialog.confirmRemovePassword()}
        </Button>
        <Button onClick={onClose} autoFocus>
          {LL.option.multiAccount.dialogs.passwordDialog.cancel()}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
