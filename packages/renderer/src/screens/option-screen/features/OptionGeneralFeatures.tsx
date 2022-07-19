import React from 'react'
import { Box, Checkbox, FormControl, FormControlLabel } from '@mui/material'
import { Observer } from 'mobx-react-lite'
import { useI18nContext } from '@lindo/i18n'
import { useStores } from '@/store'

export const OptionGeneralFeatures = () => {
  const { LL } = useI18nContext()
  const { optionStore } = useStores()

  return (
    <Observer>
      {() => (
        <>
          <Box sx={{ p: 2, flexGrow: 1, flex: 1 }}>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.general.hideShop()}
                checked={optionStore.gameGeneral.hiddenShop}
                onChange={(_, checked) => optionStore.gameGeneral.setHiddenShop(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.general.activeOpenMenu()}
                checked={optionStore.gameGeneral.activeOpenMenu}
                onChange={(_, checked) => optionStore.gameGeneral.setActiveOpenMenu(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.general.disableInactivity()}
                checked={optionStore.gameGeneral.preventInactivityDisconnect}
                onChange={(_, checked) => optionStore.gameGeneral.setPreventInactivityDisconnect(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.general.zaapSearchFilter()}
                checked={optionStore.gameGeneral.zaapSearchFilter}
                onChange={(_, checked) => optionStore.gameGeneral.setZaapSearchFilter(checked)}
              />
            </FormControl>
          </Box>
        </>
      )}
    </Observer>
  )
}
