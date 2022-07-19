import React from 'react'
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Observer } from 'mobx-react-lite'
import { useI18nContext } from '@lindo/i18n'
import { useStores } from '@/store'
import { TagsInput } from './TagsInput'

export const OptionGroupFeatures = () => {
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
                label={LL.option.features.group.partyInfo.prospecting()}
                checked={optionStore.gameGroup.groupProspecting}
                onChange={(_, checked) => optionStore.gameGroup.setGroupProspecting(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.group.partyInfo.level()}
                checked={optionStore.gameGroup.groupLevel}
                onChange={(_, checked) => optionStore.gameGroup.setGroupLevel(checked)}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={<Checkbox />}
                label={LL.option.features.group.partyMemberOnMap()}
                checked={optionStore.gameGroup.partyMemberOnMap}
                onChange={(_, checked) => optionStore.gameGroup.setPartyMemberOnMap(checked)}
              />
            </FormControl>
            <Divider />
            <Typography variant='h6'>{LL.option.features.group.autoGroup.header()}</Typography>
            <Grid component='form' noValidate autoComplete='off' container margin={0}>
              <Grid item xs={6}>
                <Stack>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={LL.option.features.group.autoGroup.fight()}
                      checked={optionStore.gameGroup.enterGroupFight}
                      onChange={(_, checked) => optionStore.gameGroup.setEnterGroupFight(checked)}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={LL.option.features.group.autoGroup.ready()}
                      checked={optionStore.gameGroup.skipReadyInFight}
                      onChange={(_, checked) => optionStore.gameGroup.setSkipReadyInFight(checked)}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={LL.option.features.group.autoGroup.disableTimer()}
                      checked={optionStore.gameGroup.disableTimer}
                      onChange={(_, checked) => optionStore.gameGroup.setDisableTimer(checked)}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={LL.option.features.group.autoGroup.followLeader()}
                      checked={optionStore.gameGroup.followLeader}
                      onChange={(_, checked) => optionStore.gameGroup.setFollowLeader(checked)}
                    />
                  </FormControl>
                  {optionStore.gameGroup.followLeader && (
                    <FormControl fullWidth>
                      <FormControlLabel
                        control={<Checkbox />}
                        label={LL.option.features.group.autoGroup.followOnMap()}
                        checked={optionStore.gameGroup.followLeaderOnMap}
                        onChange={(_, checked) => optionStore.gameGroup.setFollowLeaderOnMap(checked)}
                      />
                    </FormControl>
                  )}
                  {optionStore.gameGroup.followLeaderOnMap && (
                    <FormControl fullWidth>
                      <FormControlLabel
                        control={<Checkbox />}
                        label={LL.option.features.group.autoGroup.strictMove()}
                        checked={optionStore.gameGroup.followStrictMove}
                        onChange={(_, checked) => optionStore.gameGroup.setFollowStrictMove(checked)}
                      />
                    </FormControl>
                  )}
                  <Typography variant='body2'>{LL.option.features.group.autoGroup.warning()}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={LL.option.features.group.autoGroup.active()}
                    checked={optionStore.gameGroup.autoGrouping}
                    onChange={(_, checked) => optionStore.gameGroup.setAutoGrouping(checked)}
                  />
                </FormControl>
                {/* TODO: use rxjs before changing the store */}
                {optionStore.gameGroup.autoGrouping && (
                  <Grid container>
                    <Grid item xs={6}>
                      <TextField
                        label={LL.option.features.group.autoGroup.leader()}
                        value={optionStore.gameGroup.autoGroupLeaderName}
                        onChange={(e) => optionStore.gameGroup.setAutoGroupLeaderName(e.target.value)}
                        // onChange={(_, value) => optionStore.gameGroup.setAutoGroupLeaderName(value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TagsInput
                        label={LL.option.features.group.autoGroup.members()}
                        placeholder={LL.option.features.group.autoGroup.addMember()}
                        defaultValue={optionStore.gameGroup.autoGroupMembersName}
                        onChange={(value) => optionStore.gameGroup.setAutoGroupMembersName(value)}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Observer>
  )
}
