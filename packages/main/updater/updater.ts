import { RootStore } from '@lindo/shared'
import { dialog } from 'electron'
import { logger } from '../logger'
import { I18n } from '../utils'
import { AppUpdater } from './app-updater'
import { GameUpdater } from './game-updater'

export const runUpdater = async (rootStore: RootStore, i18n: I18n) => {
  const appUpdater = await AppUpdater.init(rootStore, i18n)
  await appUpdater.run().catch((err) => {
    logger.error('Error running app updater:', err)
  })

  logger.info('runUpdater -> Start game update checking...')
  const gameUpdater = await GameUpdater.init(rootStore)
  await gameUpdater.run().catch((e) => {
    console.log(e)
    dialog.showErrorBox('Error', 'Failed to update game')
  })
  logger.info('runUpdater -> done')
}
