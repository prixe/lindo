import React from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import { LANGUAGES, RESOLUTIONS } from '@lindo/shared'
import { useStores } from '@/store'
import { Observer } from 'mobx-react-lite'
import { useI18nContext } from '@lindo/i18n'

export const OptionGeneral = () => {
  const { appStore, optionStore } = useStores()
  const [displayRestart, setDisplayRestart] = React.useState(false)
  const { LL } = useI18nContext()

  const handleResetGameData = () => {
    window.lindoAPI.resetGameData()
  }

  const handleClearCache = () => {
    window.lindoAPI.clearCache()
  }

  return (
    <Observer>
      {() => (
        <>
          <Box sx={{ p: 2, flexGrow: 1, flex: 1 }}>
            <Typography variant='h5' component='h2' gutterBottom>
              {LL.option.general.interface()}
            </Typography>
            <FormControl sx={{ minWidth: 150, m: 1 }}>
              <InputLabel id='language-label'>{LL.option.general.language()}</InputLabel>
              <Select
                labelId='language-label'
                id='language'
                label={LL.option.general.language()}
                value={appStore.language}
                onChange={(event) => appStore.setLanguageKey(event.target.value)}
              >
                {LANGUAGES.map((language) => (
                  <MenuItem value={language.value} key={language.value}>
                    {language.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150, m: 1 }}>
              <InputLabel id='resolution-label'>{LL.option.general.resolution()}</InputLabel>
              <Select
                labelId='resolution-label'
                id='resolution'
                label={LL.option.general.resolution()}
                value={optionStore.window.humanizeResolution}
                onChange={(event) => optionStore.window.setResolutionFromString(event.target.value)}
              >
                {RESOLUTIONS.map((resolution) => (
                  <MenuItem value={resolution} key={resolution}>
                    {resolution}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.general.fullScreen()}
                checked={optionStore.window.fullScreen}
                onChange={(_, checked) => optionStore.window.setFullScreen(checked)}
              />
            </FormControl>
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
                label={LL.option.features.fight.focusFightTurn()}
                checked={optionStore.gameFight.focusOnFightTurn}
                onChange={(_, checked) => optionStore.gameFight.setFocusOnFightTurn(checked)}
              />
            </FormControl>
            <hr />
            <Typography variant='h5' component='h2' gutterBottom>
              {LL.option.general.sound()}
            </Typography>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.general.soundFocus()}
                checked={optionStore.window.soundOnFocus}
                onChange={(_, checked) => optionStore.window.setSoundOnFocus(checked)}
              />
            </FormControl>
            <hr />
            <Typography variant='h5' component='h2' gutterBottom>
              {LL.option.general.gameData()}
            </Typography>
            <Stack alignItems='flex-start' spacing={1}>
              <Button variant='outlined' onClick={handleResetGameData}>
                {LL.option.general.resetGame()}
              </Button>
              <Button variant='outlined' onClick={handleClearCache}>
                {LL.option.general.clearCache()}
              </Button>
            </Stack>
            <Stack alignItems='flex-start' direction='row' spacing={1}>
              <FormControl>
                <FormControlLabel
                  onChange={(_, checked) => {
                    setDisplayRestart(checked !== appStore.dofusTouchEarly)
                    return appStore.setDofusTouchEarly(checked)
                  }}
                  checked={appStore.dofusTouchEarly}
                  control={<Checkbox />}
                  label={LL.option.general.early()}
                />
              </FormControl>
              {displayRestart && (
                <Button variant='text' color='warning' onClick={handleResetGameData}>
                  You need to restart to apply change
                </Button>
              )}
            </Stack>
          </Box>
        </>
      )}
    </Observer>
  )
}
