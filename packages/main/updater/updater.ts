import { RootStore } from '@lindo/shared'
import { dialog } from 'electron'
import { GameUpdater } from './game-updater'

export const runUpdater = async (rootStore: RootStore) => {
  const gameUpdater = await GameUpdater.init(rootStore)
  await gameUpdater.run().catch(() => {
    dialog.showErrorBox('Error', 'Failed to update game')
  })
  console.log('runUpdater ->', 'done')
}
