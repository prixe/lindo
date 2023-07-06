import { Game, RootStore, useStores } from '@/store'
import { MODS, NotificationsMod } from '@/mods'
import { Mod } from '@/mods/mod'
import { DofusWindow } from '@/dofus-window'
import { TranslationFunctions } from '@lindo/i18n'
import { SaveCharacterImageArgs } from '@lindo/shared'
import { useEffect, useRef } from 'react'
import { IMapDidChange, observe } from 'mobx'
import { debounceTime, Subject } from 'rxjs'
import { useAnalytics } from '@/hooks'

export interface GameManagerProps {
  game: Game
  rootStore: RootStore
  LL: TranslationFunctions
}

export const useGameManager = ({ game, rootStore, LL }: GameManagerProps) => {
  const mods = useRef<Array<Mod>>([])
  const analytics = useAnalytics()
  const gameId = game.id
  const windowResized = useRef<Subject<void>>(new Subject())
  let backupMaxZoom: number | undefined
  const disposers = useRef<Array<() => void>>([])
  const { optionStore } = useStores();
  const destroyMods = () => {
    window.lindoAPI.logger.info('destroy mods')()
    for (const mod of mods.current) {
      mod.destroy()
    }
    mods.current = []
  }

  useEffect(() => {
    return observe(rootStore.gameStore._games, (change: IMapDidChange) => {
      if (change.type === 'delete' && change.oldValue.identifier === gameId) {
        destroyMods()
      }
    })
  }, [])

  return {
    init: (dWindow: DofusWindow) => {
      window.lindoAPI.logger.info('init mod')()
      const character = game.character
      if (character) {
        const gameIndex = rootStore.gameStore.games.indexOf(game)
        setTimeout(async () => {
          dWindow.gui.loginScreen._connectMethod = 'lastServer'
          dWindow.gui.loginScreen._login(
            character.account,
            await window.lindoAPI.decryptCharacterPassword(character.password),
            false
          )
          game.removeLogin()
        }, gameIndex * 1500 + 1500)
      }

      const onWindowResized = windowResized.current.pipe(debounceTime(300)).subscribe(() => {
        try {
          dWindow.gui._resizeUi()
        } catch (e) { }
        fixMaxZoom()
      })

      const fixMaxZoom = () => {
        if (!backupMaxZoom) backupMaxZoom = dWindow.isoEngine.mapScene.camera.maxZoom
        dWindow.isoEngine.mapScene.camera.maxZoom = Math.max(
          backupMaxZoom,
          backupMaxZoom + (dWindow.isoEngine.mapScene.canvas.height / 800 - 1)
        )
      }

      const startMods = () => {
        for (const key in MODS) {
          const mod: Mod = new MODS[key](dWindow, rootStore, LL)
          if (mod instanceof NotificationsMod) {
            mod.eventEmitter.on('notification', () => {
              game.setHasNotification(true)
            })
            mod.eventEmitter.on('focusTabRequest', () => {
              rootStore.gameStore.selectGame(game)
            })
          }
          mods.current.push(mod)
        }
      }

      dWindow.onresize = () => {
        windowResized.current.next()
      }

      const handleCharacterSelectedSuccess = () => {
        analytics.logEvent('login')
        game.setCharacterName(dWindow.gui.playerData.characterBaseInformations.name)

        /* create icon */
        const char = new dWindow.CharacterDisplay({ scale: 'fitin' })
        char.setLook(dWindow.gui.playerData.characterBaseInformations.entityLook, {
          riderOnly: true,
          direction: 4,
          animation: 'AnimArtwork',
          boneType: 'timeline/',
          skinType: 'timeline/'
        })
        char.rootElement.style.width = '100%'
        char.rootElement.style.height = '100%'
        if (optionStore.window.minimalInterface) {
          char.canvas.rootElement.style.height = '30px'
          char.canvas.rootElement.style.marginLeft = '2px'
          char.canvas.rootElement.style.aspectRatio = '2 / 1'
        }
        game.setCharacterIcon(char.rootElement)
        startMods()
        fixMaxZoom()
      }

      const handleDisconnect = () => {
        analytics.logEvent('logout')
        game.disconnected()
        onWindowResized.unsubscribe()
        destroyMods()
      }

      const handleCharactersListMessage = async () => {
        const characterSelection = dWindow.gui.windowsContainer._childrenList.find((w) => w.id === 'characterSelection')

        if (characterSelection && characterSelection.id === 'characterSelection') {
          if (!character) {
            return
          }
          await new Promise((resolve) => setTimeout(resolve, 100))
          const row = characterSelection.charactersTable.content._childrenList.find(
            (c) => c.data?.name === character.name
          )
          if (row) {
            row.tap()
          } else {
            window.lindoAPI.logger.error('Character not found')()
          }
          await new Promise<SaveCharacterImageArgs>((resolve, reject) => {
            let i = 0
            const interval = setInterval(() => {
              if (i > 15) {
                reject(new Error('timeout'))
              }
              if (characterSelection.characterDisplay.entity && characterSelection.selectedCharacter) {
                clearInterval(interval)
                const image = characterSelection.characterDisplay.canvas.rootElement.toDataURL('image/png')
                resolve({ image, name: characterSelection.selectedCharacter.name })
              } else {
                window.lindoAPI.logger.debug('waiting for character display')()
              }
              i++
            }, 100)
          })
            .then((args) => {
              window.lindoAPI.saveCharacterImage(args)
            })
            .catch((e) => {
              window.lindoAPI.logger.error('Failed to save character image', e)()
            })

          characterSelection.btnPlay.tap()
        }
      }
      dWindow.dofus.connectionManager.on('CharactersListMessage', handleCharactersListMessage)
      dWindow.gui.playerData.on('characterSelectedSuccess', handleCharacterSelectedSuccess)
      dWindow.gui.on('disconnect', handleDisconnect)

      disposers.current = [
        () => {
          dWindow.dofus.connectionManager.off('CharactersListMessage', handleCharactersListMessage)
          dWindow.gui.playerData.off('characterSelectedSuccess', handleCharacterSelectedSuccess)
          dWindow.gui.off('disconnect', handleDisconnect)
        }
      ]
    }
  }
}
