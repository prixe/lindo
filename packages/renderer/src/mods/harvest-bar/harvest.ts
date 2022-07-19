import { ConnectionManagerEvents, DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { EventManager } from '../helpers'
import { Mod } from '../mod'
import { HarvestBar } from './harvest-bar'

export class HarvestBarMod extends Mod {
  private harvestBar?: HarvestBar
  private statedElements: Map<number, number> = new Map()
  private settingDisposer: () => void
  private eventManager = new EventManager()

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(
      this.rootStore.optionStore.gameJob,
      'harvestTimeIndicator',
      () => {
        if (this.rootStore.optionStore.gameJob.harvestTimeIndicator) {
          this.start()
        } else {
          this.stop()
        }
      },
      true
    )
  }

  start(): void {
    console.info('- enable Harvest indicator')

    const harvestCss = document.createElement('style')
    harvestCss.id = 'harvestCss'
    harvestCss.innerHTML = `
            .harvestBarContainer {
                box-sizing: border-box;
                border: 1px gray solid;
                background-color: #222;
                height: 6px;
                width: 80px;
                position: absolute;
                border-radius: 3px;
                overflow: hidden;
                transition-duration: 500ms;
                margin-top: 10px;
            }
            .harvestBar {
                transition-duration: 300ms;
                height: 100%;
                width: 100%;
                background-color: orange;
            }
            .harvestTimeText {
                font-size: 11px;
                font-weight: bold;
                text-align: center;
                position: absolute;
                width: 80px;
                color: white;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.9);
                transition-duration: 500ms;
                margin-top: 4px;
            }`
    this.wGame.document.getElementsByTagName('head')[0].appendChild(harvestCss)

    this.harvestBar = new HarvestBar(this.wGame)

    this.removeOnFinish()
    this.displayOnStart()
    this.setHarvestStart()
  }

  private setHarvestStart(): void {
    this.eventManager.on<ConnectionManagerEvents, 'StatedElementUpdatedMessage'>(
      this.wGame.dofus.connectionManager,
      'StatedElementUpdatedMessage',
      (e) => {
        try {
          this.statedElements.set(e.statedElement.elementId, e.statedElement.elementCellId)
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private displayOnStart(): void {
    this.eventManager.on<ConnectionManagerEvents, 'InteractiveUsedMessage'>(
      this.wGame.dofus.connectionManager,
      'InteractiveUsedMessage',
      (e) => {
        try {
          if (this.statedElements.has(e.elemId) && e.entityId === this.wGame.isoEngine.actorManager.userId) {
            this.harvestBar?.harvestStarted(this.statedElements.get(e.elemId)!, e.duration)
            this.statedElements.clear()
          }
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private removeOnFinish(): void {
    this.eventManager.on<ConnectionManagerEvents, 'InteractiveUseEndedMessage'>(
      this.wGame.dofus.connectionManager,
      'InteractiveUseEndedMessage',
      () => {
        try {
          this.harvestBar?.destroy()
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private stop() {
    this.eventManager.close()
    if (this.harvestBar) this.harvestBar.destroy()
    const bar = this.wGame.document.getElementById('harvestBarContainer')
    if (bar) bar.remove()
    const time = this.wGame.document.getElementById('harvestTime')
    if (time) time.remove()
    const harvestCss = this.wGame.document.getElementById('harvestCss')
    if (harvestCss && harvestCss.parentElement) harvestCss.parentElement.removeChild(harvestCss)
  }

  public destroy() {
    this.stop()
    this.settingDisposer()
  }
}
