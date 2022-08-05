// import { useI18nContext } from '@lindo/i18n'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, useTheme } from '@mui/material'
import React, { memo, useEffect } from 'react'
import { useChangelog } from './use-changelog'

export interface ChangelogDialogProps {
  open: boolean
  onClose: () => void
}

// eslint-disable-next-line react/display-name
export const ChangelogDialog = memo(({ open, onClose }: ChangelogDialogProps) => {
  // const { LL } = useI18nContext()
  const theme = useTheme()
  const { currentChangelog, selectedVersionIndex, versions, selectVersionIndex } = useChangelog()

  const handleSelectVersion = (_event: React.SyntheticEvent | undefined, index: number) => {
    selectVersionIndex(index)
  }

  useEffect(() => {
    if (open) {
      handleSelectVersion(undefined, 0)
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box
        sx={{
          flexGrow: 1,
          width: '100vw',
          display: 'flex',
          height: '100vh',
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={selectedVersionIndex}
          onChange={handleSelectVersion}
          aria-label='option-categories'
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            width: '150px',
            flexShrink: 0,
            backgroundColor: theme.palette.background.default
          }}
        >
          {versions.map((version) => (
            <Tab key={version.version} label={version.version} />
          ))}
        </Tabs>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column'
          }}
        >
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto' }}>
            {currentChangelog && (
              <>
                <DialogTitle>
                  Release - {currentChangelog.title.version} ({currentChangelog.title.date.toDateString()})
                </DialogTitle>
                <DialogContent>
                  <Box dangerouslySetInnerHTML={{ __html: currentChangelog.content }} />
                </DialogContent>
              </>
            )}
          </Box>
          <DialogActions>
            <Button variant='outlined' onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  )
})
