import { GameMultiAccountSnapshot, IPCEvents, RootStore } from '@lindo/shared'
import { ipcMain, safeStorage } from 'electron'
import crypto from 'crypto-js'
import * as argon2 from 'argon2'
import ElectronStore from 'electron-store'
import { onSnapshot } from 'mobx-state-tree'
import { UnlockWindow } from './windows'

interface MultiAccountStore {
  masterPassword: string
  isEncrypted: boolean
}

interface MultiAccountStore {
  masterPassword: string
  useSecureStorage: boolean
  multiAccountState: string
}

export class MultiAccount {
  private _store = new ElectronStore<MultiAccountStore>()
  private _rootStore: RootStore
  private _masterPassword?: string

  private static _encrypt(input: string, password?: string): string {
    if (password) {
      const encJson = crypto.AES.encrypt(input, password).toString()
      return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(encJson))
    }
    throw new Error('Master password is not configured')
  }

  private static _decrypt(input: string, password?: string): string {
    if (password) {
      const decData = crypto.enc.Base64.parse(input).toString(crypto.enc.Utf8)
      return crypto.AES.decrypt(decData, password).toString(crypto.enc.Utf8)
    }
    throw new Error('Master password is not configured')
  }

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore

    onSnapshot(rootStore.optionStore.gameMultiAccount, (snapshot) => {
      if (!rootStore.optionStore.gameMultiAccount.locked && this._masterPassword) {
        console.log('Multi-account is unlocked, gonna encrypt the store')
        this._encryptAndSaveState(snapshot, this._masterPassword)
      }
    })

    ipcMain.handle(IPCEvents.SAVE_MASTER_PASSWORD, (event, masterPassword) => {
      return this._saveMasterPassword(masterPassword)
    })

    ipcMain.handle(IPCEvents.REMOVE_MASTER_PASSWORD, () => {
      return this._removeMasterPassword()
    })

    ipcMain.handle(IPCEvents.CHANGE_MASTER_PASSWORD, (event, masterPassword, oldPassword) => {
      return this._changeMasterPassword(masterPassword, oldPassword)
    })

    ipcMain.handle(IPCEvents.IS_MASTER_PASSWORD_CONFIGURED, () => {
      return this._isMasterPasswordConfigured()
    })

    ipcMain.handle(IPCEvents.DECRYPT_CHARACTER_PASSWORD, (event, input: string) => {
      return MultiAccount._decrypt(input, this._masterPassword)
    })

    ipcMain.handle(IPCEvents.ENCRYPT_CHARACTER_PASSWORD, (event, input: string) => {
      return MultiAccount._encrypt(input, this._masterPassword)
    })

    ipcMain.handle(IPCEvents.UNLOCK_APPLICATION, async (event, masterPassword: string) => {
      return this._unlockApplication(masterPassword)
    })

    this._isMasterPasswordConfigured().then((isConfigured) => {
      this._rootStore.optionStore.gameMultiAccount.setConfigured(isConfigured)
    })
  }

  isEnabled() {
    return this._isMasterPasswordConfigured()
  }

  async unlockWithTeam() {
    const unlockWindow = new UnlockWindow(this._rootStore)
    const closeListener = () => {
      unlockWindow.close()
    }
    ipcMain.on(IPCEvents.CLOSE_UNLOCK_WINDOW, closeListener)

    unlockWindow.once('close', () => {
      console.log('Unlock window closed')
      return new Error('Multi-account unlock window was closed')
    })

    const selectTeamId = await new Promise<string>((resolve, reject) => {
      ipcMain.handleOnce(IPCEvents.SELECT_TEAM_TO_CONNECT, async (event, teamId: string) => {
        resolve(teamId)
      })
      unlockWindow.once('close', () => {
        reject(new Error('Multi-account unlock window was closed'))
      })
    })

    // close the window and return the selected team id
    unlockWindow.close()
    ipcMain.removeListener(IPCEvents.CLOSE_UNLOCK_WINDOW, closeListener)
    return selectTeamId
  }

  private async _removeMasterPassword(): Promise<void> {
    this._store.delete('masterPassword')
    this._store.delete('multiAccountState')
    this._store.delete('useSecureStorage')
    this._masterPassword = undefined
    this._rootStore.optionStore.restoreGameMultiAccount({})
  }

  private async _changeMasterPassword(masterPassword: string, oldPassword: string): Promise<boolean> {
    if (await this._checkMasterPassword(oldPassword)) {
      // decrypt state with the old password
      const encryptedState = this._store.get('multiAccountState')
      const strState = MultiAccount._decrypt(encryptedState, oldPassword)
      const state: GameMultiAccountSnapshot = JSON.parse(strState)
      const stateWithNewPassword: GameMultiAccountSnapshot = {
        ...state,
        characters: state.characters.map((character) => {
          return {
            ...character,
            password: MultiAccount._encrypt(MultiAccount._decrypt(character.password, oldPassword), masterPassword)
          }
        })
      }
      this._saveMasterPassword(masterPassword)
      this._encryptAndSaveState(stateWithNewPassword, masterPassword)
      return true
    }
    return false
  }

  private async _saveMasterPassword(masterPassword: string): Promise<void> {
    const isEncryptionAvailable = await safeStorage.isEncryptionAvailable()
    let encryptedPassword = await argon2.hash(masterPassword)
    if (!isEncryptionAvailable) {
      console.log('Safe storage is not available, warn multi-account will use non secure storage')
      this._store.set('useSecureStorage', false)
    } else {
      const buffer = safeStorage.encryptString(encryptedPassword)
      encryptedPassword = JSON.stringify(buffer.toJSON())
      this._store.set('useSecureStorage', true)
    }
    this._store.set('masterPassword', encryptedPassword)
    this._masterPassword = masterPassword
    this._rootStore.optionStore.gameMultiAccount.setConfigured(true)
    this._rootStore.optionStore.gameMultiAccount.unlock()
  }

  private async _isMasterPasswordConfigured(): Promise<boolean> {
    return this._store.has('masterPassword')
  }

  private async _checkMasterPassword(input: string): Promise<boolean> {
    const encryptedPassword = this._store.get('masterPassword')
    const isEncrypted = this._store.get('useSecureStorage')
    let hashedPassword = encryptedPassword
    if (isEncrypted) {
      const buffer = Buffer.from(JSON.parse(encryptedPassword))
      hashedPassword = await safeStorage.decryptString(buffer)
    }
    return argon2.verify(hashedPassword, input)
  }

  private _encryptAndSaveState(snapshot: GameMultiAccountSnapshot, password: string): void {
    const encryptedState = MultiAccount._encrypt(JSON.stringify(snapshot), password)
    this._store.set('multiAccountState', encryptedState)
  }

  private async _unlockApplication(masterPassword: string): Promise<boolean> {
    const passwordOk = await this._checkMasterPassword(masterPassword)
    if (passwordOk) {
      this._masterPassword = masterPassword

      const encryptedState = this._store.get('multiAccountState')
      if (encryptedState) {
        console.log('Multi-account is unlocked, gonna decrypt the store')
        const decrypted = MultiAccount._decrypt(encryptedState, masterPassword)
        const multiAccountState = JSON.parse(decrypted)
        this._rootStore.optionStore.restoreGameMultiAccount(multiAccountState)
        this._rootStore.optionStore.gameMultiAccount.setConfigured(true)
      }

      this._rootStore.optionStore.gameMultiAccount.unlock()
    }
    return passwordOk
  }
}
