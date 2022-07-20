import { RootStore } from '@lindo/shared'
import { dialog } from 'electron'
import { I18n } from '../utils'
import { AppUpdater } from './app-updater'
import { GameUpdater } from './game-updater'

export const runUpdater = async (rootStore: RootStore, i18n: I18n) => {
  const appUpdater = await AppUpdater.init(rootStore, i18n)
  await appUpdater.run().catch((err) => {
    console.log('Error running app updater:', err)
  })

  const gameUpdater = await GameUpdater.init(rootStore)
  await gameUpdater.run().catch(() => {
    dialog.showErrorBox('Error', 'Failed to update game')
  })
  console.log('runUpdater ->', 'done')
}
