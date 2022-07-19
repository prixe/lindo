import { useDialog } from '@/hooks'
import { useI18nContext } from '@lindo/i18n'
import {
  Box,
  Button,
  darken,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Tab,
  Tabs,
  useTheme
} from '@mui/material'
import React, { useState } from 'react'
import { ChangelogDialog } from './changelog'
import { OptionFeatures } from './features'
import { OptionGeneral } from './general'
import { OptionMultiAccount } from './multi-account'
import { OptionNotifications } from './notifications'
import { OptionShortcuts } from './shortcuts'
import { TabPanel } from './TabPanel'

export const OptionScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [openResetDialog, , toggleResetDialog] = useDialog()
  const [openChangelogDialog, , toggleChangelogDialog] = useDialog()
  const { LL } = useI18nContext()
  const theme = useTheme()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue)
    if (newValue === 6) {
      toggleChangelogDialog()
      return
    }
    setSelectedTab(newValue)
  }

  const handleResetStore = () => {
    window.lindoAPI.resetStore()
    toggleResetDialog()
  }
  return (
    <>
      <Box sx={{ flexGrow: 1, width: '100vw', display: 'flex' }}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={selectedTab}
          onChange={handleChange}
          aria-label='option-categories'
          sx={{ borderRight: 1, borderColor: 'divider', width: '150px', flexShrink: 0 }}
        >
          <Tab label={LL.option.general.title()} />
          <Tab label={LL.option.shortcuts.title()} />
          <Tab label={LL.option.features.title()} />
          <Tab label={LL.option.notifications.title()} />
          <Tab label={LL.option.multiAccount.title()} />
          <Tab label={LL.option.about.title()} />
          <Tab label={'Changelog'} sx={{ color: theme.palette.secondary.dark, fontSize: 13 }} />
        </Tabs>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column'
          }}
        >
          <Paper
            square
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            <TabPanel value={selectedTab} index={0}>
              <OptionGeneral />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <OptionShortcuts />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <OptionFeatures />
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
              <OptionNotifications />
            </TabPanel>
            <TabPanel value={selectedTab} index={4}>
              <OptionMultiAccount />
            </TabPanel>
          </Paper>
          <Box
            sx={{
              backgroundColor: darken(theme.palette.background.paper, 0.2),
              padding: theme.spacing(1),
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button color='error' onClick={toggleResetDialog}>
              {LL.window.options.button.reset()}
            </Button>
            <Button variant='contained' onClick={() => window.lindoAPI.closeOptionWindow()}>
              {LL.window.options.button.close()}
            </Button>
          </Box>
        </Box>
      </Box>
      <Dialog open={openResetDialog} onClose={toggleResetDialog}>
        <DialogTitle>{LL.window.options.dialogs.resetSettings.title()}</DialogTitle>
        <DialogContent>
          <DialogContentText> {LL.window.options.dialogs.resetSettings.message()}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetStore}> {LL.window.options.dialogs.resetSettings.confirm()}</Button>
          <Button onClick={toggleResetDialog} autoFocus>
            {LL.window.options.dialogs.resetSettings.cancel()}
          </Button>
        </DialogActions>
      </Dialog>
      <ChangelogDialog open={openChangelogDialog} onClose={toggleChangelogDialog} />
    </>
  )
}
