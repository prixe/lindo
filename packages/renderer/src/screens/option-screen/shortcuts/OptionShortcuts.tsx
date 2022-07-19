import React from 'react'
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material'
import { TabPanel } from '../TabPanel'
import { ShortcutInput } from './ShortcutInput'
import { useStores } from '@/store'
import { Observer } from 'mobx-react-lite'
import { useI18nContext } from '@lindo/i18n'

export const OptionShortcuts = () => {
  const [value, setValue] = React.useState(0)
  const { LL } = useI18nContext()
  const { hotkeyStore } = useStores()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Observer>
      {() => (
        <Box sx={{ flexGrow: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label='shortcuts-tabs'>
              <Tab label={LL.option.shortcuts.application.header()} />
              <Tab label={LL.option.shortcuts.interfaces.header()} />
              <Tab label={LL.option.shortcuts.spells.header()} />
              <Tab label={LL.option.shortcuts.items.header()} />
              <Tab label={LL.option.shortcuts.diver.header()} />
              <Tab label={LL.option.shortcuts.mods.header()} />
            </Tabs>
          </Box>
          <Box sx={{ p: 1, flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
            <Box>
              <TabPanel value={value} index={0}>
                <Grid component='form' noValidate autoComplete='off' container spacing={1} margin={0}>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='new-window'
                        label={LL.option.shortcuts.application.newWindow()}
                        value={hotkeyStore.window.newWindow}
                        onChange={hotkeyStore.window.setNewWindow}
                      />
                      <ShortcutInput
                        id='new-tab'
                        label={LL.option.shortcuts.application.newTab()}
                        value={hotkeyStore.window.newTab}
                        onChange={hotkeyStore.window.setNewTab}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='next-tab'
                        label={LL.option.shortcuts.application.nextTab()}
                        value={hotkeyStore.window.nextTab}
                        onChange={hotkeyStore.window.setNextTab}
                      />
                      <ShortcutInput
                        id='previous-tab'
                        label={LL.option.shortcuts.application.prevTab()}
                        value={hotkeyStore.window.prevTab}
                        onChange={hotkeyStore.window.setPrevTab}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      {Array.from({ length: 4 }, (_, k) => k).map((i) => (
                        <ShortcutInput
                          id={'tab-' + i}
                          key={'tab-' + i}
                          label={LL.option.shortcuts.application.tab({ x: i + 1 })}
                          value={hotkeyStore.window.tabs[i]}
                          onChange={(shortcut) => hotkeyStore.window.setTab(shortcut, i)}
                        />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      {Array.from({ length: 4 }, (_, k) => k + 4).map((i) => (
                        <ShortcutInput
                          id={'tab-' + i}
                          key={'tab-' + i}
                          label={LL.option.shortcuts.application.tab({ x: i + 1 })}
                          value={hotkeyStore.window.tabs[i]}
                          onChange={(shortcut) => hotkeyStore.window.setTab(shortcut, i)}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Grid component='form' noValidate autoComplete='off' container spacing={1} margin={0}>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='carac'
                        label={LL.option.shortcuts.interfaces.carac()}
                        value={hotkeyStore.gameInterface.carac}
                        onChange={hotkeyStore.gameInterface.setCarac}
                      />
                      <ShortcutInput
                        id='spell'
                        label={LL.option.shortcuts.interfaces.spell()}
                        value={hotkeyStore.gameInterface.spell}
                        onChange={hotkeyStore.gameInterface.setSpell}
                      />
                      <ShortcutInput
                        id='bag'
                        label={LL.option.shortcuts.interfaces.bag()}
                        value={hotkeyStore.gameInterface.bag}
                        onChange={hotkeyStore.gameInterface.setBag}
                      />
                      <ShortcutInput
                        id='bidHouse'
                        label={LL.option.shortcuts.interfaces.bidHouse()}
                        value={hotkeyStore.gameInterface.bidHouse}
                        onChange={hotkeyStore.gameInterface.setBidHouse}
                      />
                      <ShortcutInput
                        id='map'
                        label={LL.option.shortcuts.interfaces.map()}
                        value={hotkeyStore.gameInterface.map}
                        onChange={hotkeyStore.gameInterface.setMap}
                      />
                      <ShortcutInput
                        id='friend'
                        label={LL.option.shortcuts.interfaces.friend()}
                        value={hotkeyStore.gameInterface.friend}
                        onChange={hotkeyStore.gameInterface.setFriend}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='book'
                        label={LL.option.shortcuts.interfaces.book()}
                        value={hotkeyStore.gameInterface.book}
                        onChange={hotkeyStore.gameInterface.setBook}
                      />
                      <ShortcutInput
                        id='guild'
                        label={LL.option.shortcuts.interfaces.guild()}
                        value={hotkeyStore.gameInterface.guild}
                        onChange={hotkeyStore.gameInterface.setGuild}
                      />
                      <ShortcutInput
                        id='conquest'
                        label={LL.option.shortcuts.interfaces.conquest()}
                        value={hotkeyStore.gameInterface.conquest}
                        onChange={hotkeyStore.gameInterface.setConquest}
                      />
                      <ShortcutInput
                        id='goultine'
                        label={LL.option.shortcuts.interfaces.goultine()}
                        value={hotkeyStore.gameInterface.goultine}
                        onChange={hotkeyStore.gameInterface.setGoultine}
                      />
                      <ShortcutInput
                        id='job'
                        label={LL.option.shortcuts.interfaces.job()}
                        value={hotkeyStore.gameInterface.job}
                        onChange={hotkeyStore.gameInterface.setJob}
                      />
                      <ShortcutInput
                        id='alliance'
                        label={LL.option.shortcuts.interfaces.alliance()}
                        value={hotkeyStore.gameInterface.alliance}
                        onChange={hotkeyStore.gameInterface.setAlliance}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='mount'
                        label={LL.option.shortcuts.interfaces.mount()}
                        value={hotkeyStore.gameInterface.mount}
                        onChange={hotkeyStore.gameInterface.setMount}
                      />
                      <ShortcutInput
                        id='directory'
                        label={LL.option.shortcuts.interfaces.directory()}
                        value={hotkeyStore.gameInterface.directory}
                        onChange={hotkeyStore.gameInterface.setDirectory}
                      />
                      <ShortcutInput
                        id='alignment'
                        label={LL.option.shortcuts.interfaces.alignment()}
                        value={hotkeyStore.gameInterface.alignment}
                        onChange={hotkeyStore.gameInterface.setAlignment}
                      />
                      <ShortcutInput
                        id='bestiary'
                        label={LL.option.shortcuts.interfaces.bestiary()}
                        value={hotkeyStore.gameInterface.bestiary}
                        onChange={hotkeyStore.gameInterface.setBestiary}
                      />
                      <ShortcutInput
                        id='title'
                        label={LL.option.shortcuts.interfaces.title()}
                        value={hotkeyStore.gameInterface.title}
                        onChange={hotkeyStore.gameInterface.setTitle}
                      />
                      <ShortcutInput
                        id='achievement'
                        label={LL.option.shortcuts.interfaces.achievement()}
                        value={hotkeyStore.gameInterface.achievement}
                        onChange={hotkeyStore.gameInterface.setAchievement}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='daily-quest'
                        label={LL.option.shortcuts.interfaces.dailyQuest()}
                        value={hotkeyStore.gameInterface.dailyQuest}
                        onChange={hotkeyStore.gameInterface.setDailyQuest}
                      />
                      <ShortcutInput
                        id='spouse'
                        label={LL.option.shortcuts.interfaces.spouse()}
                        value={hotkeyStore.gameInterface.spouse}
                        onChange={hotkeyStore.gameInterface.setSpouse}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Grid component='form' noValidate autoComplete='off' container spacing={1} margin={0}>
                  {Array.from({ length: 4 }, (_, k) => k).map((i) => (
                    <Grid item xs={3} key={'grid-spell-' + i}>
                      <Stack spacing={2}>
                        {Array.from({ length: 7 }, (_, k) => k + i * 8).map((j) => (
                          <ShortcutInput
                            key={'spell-' + j}
                            id={'spell-' + j}
                            label={LL.option.shortcuts.spells.slot({ x: j + 1 })}
                            value={hotkeyStore.gameInterface.spells[j]}
                            onChange={(hotkey) => hotkeyStore.gameInterface.setSpells(j, hotkey)}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Grid component='form' noValidate autoComplete='off' container spacing={1} margin={0}>
                  {Array.from({ length: 4 }, (_, k) => k).map((i) => (
                    <Grid item xs={3} key={'grid-item-' + i}>
                      <Stack spacing={2}>
                        {Array.from({ length: 7 }, (_, k) => k + i * 8).map((j) => (
                          <ShortcutInput
                            key={'item-' + j}
                            id={'item-' + j}
                            label={LL.option.shortcuts.items.slot({ x: j + 1 })}
                            value={hotkeyStore.gameInterface.items[j]}
                            onChange={(hotkey) => hotkeyStore.gameInterface.setItems(j, hotkey)}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={4}>
                <Grid component='form' noValidate autoComplete='off' container spacing={1} margin={0}>
                  <Grid item xs={4}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='en-turn'
                        label={LL.option.shortcuts.diver.endTurn()}
                        value={hotkeyStore.gameAction.endTurn}
                        onChange={hotkeyStore.gameAction.setEndTurn}
                      />
                      <ShortcutInput
                        id='go-up'
                        label={LL.option.shortcuts.diver.goUp()}
                        value={hotkeyStore.gameAction.goUp}
                        onChange={hotkeyStore.gameAction.setGoUp}
                      />
                      <ShortcutInput
                        id='go-down'
                        label={LL.option.shortcuts.diver.goDown()}
                        value={hotkeyStore.gameAction.goDown}
                        onChange={hotkeyStore.gameAction.setGoDown}
                      />
                      <ShortcutInput
                        id='go-left'
                        label={LL.option.shortcuts.diver.goLeft()}
                        value={hotkeyStore.gameAction.goLeft}
                        onChange={hotkeyStore.gameAction.setGoLeft}
                      />
                      <ShortcutInput
                        id='go-right'
                        label={LL.option.shortcuts.diver.goRight()}
                        value={hotkeyStore.gameAction.goRight}
                        onChange={hotkeyStore.gameAction.setGoRight}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='open-chat'
                        label={LL.option.shortcuts.diver.openChat()}
                        value={hotkeyStore.gameAction.openChat}
                        onChange={hotkeyStore.gameAction.setOpenChat}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='open-menu'
                        label={LL.option.shortcuts.diver.openMenu()}
                        value={hotkeyStore.gameAction.openMenu}
                        onChange={hotkeyStore.gameAction.setOpenMenu}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={5}>
                <Grid component='form' noValidate autoComplete='off' container spacing={1} margin={0}>
                  <Grid item xs={4}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='monster-tooltip-hotkey'
                        label={LL.option.shortcuts.mods.monsterTooltip()}
                        value={hotkeyStore.gameMod.monsterTooltip}
                        onChange={hotkeyStore.gameMod.setMonsterTooltip}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='map-resources-hotkey'
                        label={LL.option.shortcuts.mods.mapResources()}
                        value={hotkeyStore.gameMod.mapResources}
                        onChange={hotkeyStore.gameMod.setMapResources}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={2}>
                      <ShortcutInput
                        id='health-bar-hotkey'
                        label={LL.option.shortcuts.mods.healthBar()}
                        value={hotkeyStore.gameMod.toggleHealthBar}
                        onChange={hotkeyStore.gameMod.setToggleHealthBar}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
            <Typography marginTop={2}>{LL.option.shortcuts.information()}</Typography>
          </Box>
        </Box>
      )}
    </Observer>
  )
}
