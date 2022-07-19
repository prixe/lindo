import { IJsonPatch } from 'mobx-state-tree'
import { SaveCharacterImageArgs } from '../constants'
import { RootStoreSnapshot } from '../models'
import { FollowInstruction } from './auto-group'
import { GameContext } from './game-context'
import { UpdateProgress } from './update-progress'

export interface LindoTitleBar {
  updateTitle: (title: string) => void
  height: string
}

export interface LindoAPI {
  // mobx
  forwardPatchToMain: (patch: IJsonPatch) => void
  fetchInitialStateAsync: () => Promise<RootStoreSnapshot>
  subscribeToIPCPatch: (callback: (patch: IJsonPatch) => void) => () => void
  resetStore: () => void
  // hotkeys
  subscribeToNewTab: (callback: () => void) => () => void
  subscribeToNextTab: (callback: () => void) => () => void
  subscribeToPrevTab: (callback: () => void) => () => void
  subscribeToCloseTab: (callback: () => void) => () => void
  // updater
  subscribeToUpdateProgress: (callback: (updateProgress: UpdateProgress) => void) => void
  // context
  fetchGameContext: () => Promise<GameContext>
  // window
  openOptionWindow: () => void
  focusCurrentWindow: () => void
  closeOptionWindow: () => void
  setAudioMuteWindow: (value: boolean) => void
  // multi account
  saveMasterPassword: (masterPassword: string) => Promise<void>
  removeMasterPassword: () => Promise<void>
  changeMasterPassword: (masterPassword: string, oldPassword: string) => Promise<boolean>
  encryptCharacterPassword: (characterPassword: string) => Promise<string>
  decryptCharacterPassword: (encryptedCharacterPassword: string) => Promise<string>
  unlockApplication: (masterPassword: string) => Promise<boolean>
  isMasterPasswordConfigured: () => Promise<boolean>
  saveCharacterImage: (args: SaveCharacterImageArgs) => void
  closeUnlockWindow: () => void
  selectTeamToConnect: (teamId: string) => void
  // auto-group
  subscribeToAutoGroupPathInstruction: (callback: (instruction: FollowInstruction) => void) => () => void
  sendAutoGroupPathInstruction: (instruction: FollowInstruction) => void
  // options
  resetGameData: () => void
  clearCache: () => void
}
