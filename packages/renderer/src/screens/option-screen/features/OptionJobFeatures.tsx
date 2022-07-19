import React from 'react'
import { Box, Checkbox, FormControl, FormControlLabel } from '@mui/material'
import { Observer } from 'mobx-react-lite'
import { useI18nContext } from '@lindo/i18n'
import { useStores } from '@/store'

export const OptionJobFeatures = () => {
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
                label={LL.option.features.job.harvestIndicator()}
                checked={optionStore.gameJob.harvestTimeIndicator}
                onChange={(_, checked) => optionStore.gameJob.setHarvestTimeIndicator(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.job.jobsXp()}
                checked={optionStore.gameJob.xpRemainingBeforeLevelUp}
                onChange={(_, checked) => optionStore.gameJob.setXpRemainingBeforeLevelUp(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.job.showResources()}
                checked={optionStore.gameJob.mapResources}
                onChange={(_, checked) => optionStore.gameJob.setMapResources(checked)}
              />
            </FormControl>
          </Box>
        </>
      )}
    </Observer>
  )
}
