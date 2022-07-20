import { contextBridge, ipcRenderer, IpcRendererEvent, shell } from 'electron'
import { domReady } from './utils'
import { IJsonPatch } from 'mobx-state-tree'
import {
  FollowInstruction,
  GameContext,
  IPCEvents,
  LindoAPI,
  LindoLogger,
  LindoTitleBar,
  OFFICIAL_WEBSITE_URL,
  RootStoreSnapshot,
  SaveCharacterImageArgs,
  UpdateProgress
} from '@lindo/shared'
import { Titlebar, Color } from 'custom-electron-titlebar'
;(async () => {
  await domReady()
})()

window.addEventListener('DOMContentLoaded', () => {
  // only display custom titlebar for main windows
  if (window.location.hash !== '') {
    return
  }
  const titleBar = new Titlebar({
    backgroundColor: Color.fromHex('#121212')
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titlebarRef: HTMLDivElement = (titleBar as any).titlebar

  titlebarRef.addEventListener('dblclick', () => {
    ipcRenderer.send(IPCEvents.TOGGLE_MAXIMIZE_WINDOW)
  })

  titleBar.updateTitle('Lindo')
  const lindoTitleBar: LindoTitleBar = {
    updateTitle: (title: string) => titleBar.updateTitle(title),
    height: titlebarRef.clientHeight + 'px'
  }
  contextBridge.exposeInMainWorld('titleBar', lindoTitleBar)
})

// MOBX
const forwardPatchToMain = (patch: IJsonPatch): void => {
  ipcRenderer.send(IPCEvents.PATCH, patch)
}

const fetchInitialStateAsync = async (): Promise<RootStoreSnapshot> => {
  const data = await ipcRenderer.invoke(IPCEvents.INIT_STATE_ASYNC)
  return JSON.parse(data)
}

const subscribeToIPCPatch = (callback: (patch: IJsonPatch) => void): (() => void) => {
  const listener = (_: IpcRendererEvent, patch: IJsonPatch) => {
    callback(patch)
  }
  ipcRenderer.on(IPCEvents.PATCH, listener)

  return () => {
    ipcRenderer.removeListener(IPCEvents.PATCH, listener)
  }
}

const resetStore = (): void => {
  ipcRenderer.send(IPCEvents.RESET_STORE)
}

// Hotkeys
const subscribeToNewTab = (callback: () => void): (() => void) => {
  const listener = () => {
    callback()
  }
  ipcRenderer.on(IPCEvents.NEW_TAB, listener)

  return () => {
    ipcRenderer.removeListener(IPCEvents.NEW_TAB, listener)
  }
}

const subscribeToNextTab = (callback: () => void): (() => void) => {
  const listener = () => {
    callback()
  }
  ipcRenderer.on(IPCEvents.NEXT_TAB, listener)

  return () => {
    ipcRenderer.removeListener(IPCEvents.NEXT_TAB, listener)
  }
}

const subscribeToPrevTab = (callback: () => void): (() => void) => {
  const listener = () => {
    callback()
  }
  ipcRenderer.on(IPCEvents.PREV_TAB, listener)

  return () => {
    ipcRenderer.removeListener(IPCEvents.PREV_TAB, listener)
  }
}

const subscribeToCloseTab = (callback: () => void): (() => void) => {
  const listener = () => {
    callback()
  }
  ipcRenderer.on(IPCEvents.CLOSE_TAB, listener)

  return () => {
    ipcRenderer.removeListener(IPCEvents.CLOSE_TAB, listener)
  }
}

// Updater
const subscribeToUpdateProgress = (callback: (updateProgress: UpdateProgress) => void): (() => void) => {
  const listener = (_: IpcRendererEvent, updateProgress: UpdateProgress) => {
    callback(updateProgress)
  }
  ipcRenderer.on(IPCEvents.UPDATE_PROGRESS, listener)

  return () => {
    ipcRenderer.removeListener(IPCEvents.UPDATE_PROGRESS, listener)
  }
}

// Context
const fetchGameContext = async (): Promise<GameContext> => {
  const data = await ipcRenderer.invoke(IPCEvents.GET_GAME_CONTEXT)
  return JSON.parse(data)
}

const appReadyToShow = () => {
  ipcRenderer.send(IPCEvents.APP_READY_TO_SHOW)
}

// Window
const openOptionWindow = (): void => {
  ipcRenderer.send(IPCEvents.OPEN_OPTION)
}

const focusCurrentWindow = (): void => {
  ipcRenderer.send(IPCEvents.FOCUS_WINDOW)
}

const closeOptionWindow = (): void => {
  ipcRenderer.send(IPCEvents.CLOSE_OPTION)
}

const setAudioMuteWindow = (value: boolean): void => {
  ipcRenderer.send(IPCEvents.AUDIO_MUTE_WINDOW, value)
}

// Multi account
const saveMasterPassword = async (masterPassword: string): Promise<void> => {
  await ipcRenderer.invoke(IPCEvents.SAVE_MASTER_PASSWORD, masterPassword)
}

const changeMasterPassword = async (masterPassword: string, oldPassword: string): Promise<boolean> => {
  return ipcRenderer.invoke(IPCEvents.CHANGE_MASTER_PASSWORD, masterPassword, oldPassword)
}

const removeMasterPassword = async (): Promise<void> => {
  return ipcRenderer.invoke(IPCEvents.REMOVE_MASTER_PASSWORD)
}

const encryptCharacterPassword = async (characterPassword: string): Promise<string> => {
  return ipcRenderer.invoke(IPCEvents.ENCRYPT_CHARACTER_PASSWORD, characterPassword)
}

const decryptCharacterPassword = async (encryptedCharacterPassword: string): Promise<string> => {
  return ipcRenderer.invoke(IPCEvents.DECRYPT_CHARACTER_PASSWORD, encryptedCharacterPassword)
}

const unlockApplication = async (masterPassword: string): Promise<boolean> => {
  return ipcRenderer.invoke(IPCEvents.UNLOCK_APPLICATION, masterPassword)
}

const isMasterPasswordConfigured = (): Promise<boolean> => {
  return ipcRenderer.invoke(IPCEvents.IS_MASTER_PASSWORD_CONFIGURED)
}

const saveCharacterImage = (args: SaveCharacterImageArgs) => {
  ipcRenderer.send(IPCEvents.SAVE_CHARACTER_IMAGE, args)
}

const closeUnlockWindow = () => {
  ipcRenderer.send(IPCEvents.CLOSE_UNLOCK_WINDOW)
}
const selectTeamToConnect = (teamId: string) => {
  ipcRenderer.invoke(IPCEvents.SELECT_TEAM_TO_CONNECT, teamId)
}

// Auto group
const subscribeToAutoGroupPathInstruction = (callback: (instruction: FollowInstruction) => void): (() => void) => {
  const listener = (_: IpcRendererEvent, instruction: FollowInstruction) => {
    callback(instruction)
  }
  ipcRenderer.on(IPCEvents.AUTO_GROUP_PUSH_PATH, listener)

  return () => {
    ipcRenderer.removeListener(IPCEvents.AUTO_GROUP_PUSH_PATH, listener)
  }
}

const sendAutoGroupPathInstruction = (instruction: FollowInstruction) => {
  ipcRenderer.send(IPCEvents.AUTO_GROUP_PUSH_PATH, instruction)
}

// options
const resetGameData = () => {
  ipcRenderer.send(IPCEvents.RESET_GAME_DATA)
}
const clearCache = () => {
  ipcRenderer.send(IPCEvents.CLEAR_CACHE)
}

const openOfficialWebsite = () => {
  shell.openExternal(OFFICIAL_WEBSITE_URL)
}

const logger: LindoLogger = {
  debug: (...params: unknown[]) => {
    ipcRenderer.send(IPCEvents.LOGGER_DEBUG, ...params)
    const args = [].slice.call(params)
    args.unshift(console as never)
    // eslint-disable-next-line prefer-spread
    return console.debug.bind.apply(console.log, args as never)
  },
  info: (...params: unknown[]) => {
    ipcRenderer.send(IPCEvents.LOGGER_INFO, ...params)
    const args = [].slice.call(params)
    args.unshift(console as never)
    // eslint-disable-next-line prefer-spread
    return console.info.bind.apply(console.log, args as never)
  },
  warn: (...params: unknown[]) => {
    ipcRenderer.send(IPCEvents.LOGGER_WARN, ...params)
    const args = [].slice.call(params)
    args.unshift(console as never)
    // eslint-disable-next-line prefer-spread
    return console.warn.bind.apply(console.log, args as never)
  },
  error: (...params: unknown[]) => {
    ipcRenderer.send(IPCEvents.LOGGER_ERROR, ...params)
    const args = [].slice.call(params)
    args.unshift(console as never)
    // eslint-disable-next-line prefer-spread
    return console.info.bind.apply(console.log, args as never)
  }
}

const lindoApi: LindoAPI = {
  fetchInitialStateAsync,
  resetStore,
  forwardPatchToMain,
  subscribeToIPCPatch,
  subscribeToNewTab,
  subscribeToNextTab,
  subscribeToPrevTab,
  subscribeToCloseTab,
  subscribeToUpdateProgress,
  fetchGameContext,
  appReadyToShow,
  openOptionWindow,
  focusCurrentWindow,
  closeOptionWindow,
  setAudioMuteWindow,
  saveMasterPassword,
  isMasterPasswordConfigured,
  saveCharacterImage,
  unlockApplication,
  closeUnlockWindow,
  selectTeamToConnect,
  encryptCharacterPassword,
  decryptCharacterPassword,
  changeMasterPassword,
  removeMasterPassword,
  subscribeToAutoGroupPathInstruction,
  sendAutoGroupPathInstruction,
  resetGameData,
  clearCache,
  openOfficialWebsite,
  logger
}
contextBridge.exposeInMainWorld('lindoAPI', lindoApi)
