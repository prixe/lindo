import React from 'react'
import { Box, Checkbox, FormControl, FormControlLabel } from '@mui/material'
import { Observer } from 'mobx-react-lite'
import { useI18nContext } from '@lindo/i18n'
import { useStores } from '@/store'

export const OptionFightFeatures = () => {
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
                label={LL.option.features.fight.verticalTimeline()}
                checked={optionStore.gameFight.verticalTimeline}
                onChange={(_, checked) => optionStore.gameFight.setVerticalTimeline(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.fight.challengePercent()}
                checked={optionStore.gameFight.challengeBonus}
                onChange={(_, checked) => optionStore.gameFight.setChallengeBonus(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.fight.focusFightTurn()}
                checked={optionStore.gameFight.focusOnFightTurn}
                onChange={(_, checked) => optionStore.gameFight.setFocusOnFightTurn(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.fight.fightChronometer()}
                checked={optionStore.gameFight.fightChronometer}
                onChange={(_, checked) => optionStore.gameFight.setFightChronometer(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.fight.estimator()}
                checked={optionStore.gameFight.damageEstimator}
                onChange={(_, checked) => optionStore.gameFight.setDamageEstimator(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.fight.healthBar()}
                checked={optionStore.gameFight.healthBar}
                onChange={(_, checked) => optionStore.gameFight.setHealthBar(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.fight.monsterTooltip()}
                checked={optionStore.gameFight.monsterTooltip}
                onChange={(_, checked) => optionStore.gameFight.setMonsterTooltip(checked)}
              />
            </FormControl>
          </Box>
        </>
      )}
    </Observer>
  )
}
