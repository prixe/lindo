import { ConnectionManagerEvents, DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { EventManager } from '../helpers'
import { Mod } from '../mod'

export class ChallengePercentMod extends Mod {
  private stylesheet?: HTMLStyleElement
  private eventManager = new EventManager()
  private settingDisposer: () => void

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)

    this.settingDisposer = observe(
      this.rootStore.optionStore.gameFight,
      'challengeBonus',
      () => {
        if (this.rootStore.optionStore.gameFight.challengeBonus) {
          this.start()
        } else {
          this.stop()
        }
      },
      true
    )
  }

  private start(): void {
    console.info('- enable challengePercent')
    this.stylesheet = window.document.createElement('style')
    this.stylesheet.id = 'ChallPercent'
    this.stylesheet.innerHTML = `
      .challPercentOnIcon .challengeIcon {
        background-size: contain;
        background-position: left center;
      }

      .challPercentOnIcon,
      .challPercentOnIcon .challengeSlot {
        width: 100px;
      }

      .challPercentOnIconDetails {
        position: absolute;
        width: 45px;
        left: 45px;
        top: 11px;
      }
      `

    this.wGame.document.head.appendChild(this.stylesheet)

    this.wGame.gui.challengeIndicator.rootElement.classList.add('challPercentOnIcon')

    this.eventManager.on<ConnectionManagerEvents, 'ChallengeInfoMessage'>(
      this.wGame.dofus.connectionManager,
      'ChallengeInfoMessage',
      (msg) => {
        const challengeText = document.createElement('div')
        challengeText.className = 'challPercentOnIconDetails'
        challengeText.innerHTML = '+' + msg.xpBonus + '%'
        this.wGame.gui.challengeIndicator?.iconDetailsListByChallengeId?.[
          msg.challengeId
        ]?.icon?.rootElement.appendChild(challengeText)
      }
    )
  }

  private stop() {
    this.eventManager.close()
    this.stylesheet?.remove?.()
    if (this.wGame.gui.challengeIndicator) {
      this.wGame.gui?.challengeIndicator?.rootElement?.classList?.remove?.('challPercentOnIcon')
    }
  }

  destroy() {
    this.stop()
    this.settingDisposer()
  }
}
