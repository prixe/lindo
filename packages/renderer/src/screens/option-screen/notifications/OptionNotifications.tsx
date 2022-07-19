import React from 'react'
import { Box, Checkbox, FormControl, FormControlLabel, Typography } from '@mui/material'
import { useStores } from '@/store'
import { Observer } from 'mobx-react-lite'
import { useI18nContext } from '@lindo/i18n'

export const OptionNotifications = () => {
  const { LL } = useI18nContext()
  const { optionStore } = useStores()

  return (
    <Observer>
      {() => (
        <>
          <Box sx={{ p: 2, flexGrow: 1, flex: 1 }}>
            <Typography>{LL.option.notifications.description()}</Typography>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.notifications.fightTurn()}
                checked={optionStore.gameNotification.fightTurn}
                onChange={(_, checked) => optionStore.gameNotification.setFightTurn(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.notifications.privateMessage()}
                checked={optionStore.gameNotification.privateMessage}
                onChange={(_, checked) => optionStore.gameNotification.setPrivateMessage(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.notifications.taxCollector()}
                checked={optionStore.gameNotification.taxCollector}
                onChange={(_, checked) => optionStore.gameNotification.setTaxCollector(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.notifications.kolizeum()}
                checked={optionStore.gameNotification.kolizeum}
                onChange={(_, checked) => optionStore.gameNotification.setKolizeum(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.notifications.partyInvitation()}
                checked={optionStore.gameNotification.partyInvitation}
                onChange={(_, checked) => optionStore.gameNotification.setPartyInvitation(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.notifications.aggression()}
                checked={optionStore.gameNotification.aggression}
                onChange={(_, checked) => optionStore.gameNotification.setAggression(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.notifications.saleMessage()}
                checked={optionStore.gameNotification.itemSold}
                onChange={(_, checked) => optionStore.gameNotification.setItemSold(checked)}
              />
            </FormControl>
          </Box>
        </>
      )}
    </Observer>
  )
}
