// import { useI18nContext } from '@lindo/i18n'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import { marked } from 'marked'
import { useGameContext } from '@/providers'

export interface ChangelogDialogProps {
  open: boolean
  onClose: () => void
}

// eslint-disable-next-line react/display-name
export const ChangelogDialog = memo(({ open, onClose }: ChangelogDialogProps) => {
  // const { LL } = useI18nContext()
  const context = useGameContext()

  const [changelog, setChangelog] = useState('')

  useEffect(() => {
    fetch(context.changeLogSrc)
      .then((res) => res.blob())
      .then((blob) => blob.text())
      .then((text) => {
        setChangelog(marked.parse(text))
      })
  })

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>Changelog</DialogTitle>
      <DialogContent dangerouslySetInnerHTML={{ __html: changelog }}></DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
})
