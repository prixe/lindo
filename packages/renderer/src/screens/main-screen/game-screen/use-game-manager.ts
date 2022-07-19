import { Game, RootStore } from '@/store'
import { MODS, NotificationsMod } from '@/mods'
import { Mod } from '@/mods/mod'
import { DofusWindow } from '@/dofus-window'
import { TranslationFunctions } from '@lindo/i18n'
import { SaveCharacterImageArgs } from '@lindo/shared'
import { useEffect, useRef } from 'react'
import { IMapDidChange, observe } from 'mobx'

export interface GameManagerProps {
  game: Game
  rootStore: RootStore
  LL: TranslationFunctions
}

export const useGameManager = ({ game, rootStore, LL }: GameManagerProps) => {
  const mods = useRef<Array<Mod>>([])
  const gameId = game.id
  const disposers = useRef<Array<() => void>>([])

  const destroyMods = () => {
    console.log('destroy mods')
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
  })

  return {
    init: (dWindow: DofusWindow) => {
      console.log('init mod')
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
        try {
          dWindow.gui._resizeUi()
        } catch (e) {}
      }

      const handleCharacterSelectedSuccess = () => {
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

        game.setCharacterIcon(char.rootElement)
        startMods()
      }

      const handleDisconnect = () => {
        game.disconnected()
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
            console.error('Character not found')
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
                console.log('waiting for character display')
              }
              i++
            }, 100)
          })
            .then((args) => {
              window.lindoAPI.saveCharacterImage(args)
            })
            .catch((e) => {
              console.warn('Failed to save character image', e)
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
