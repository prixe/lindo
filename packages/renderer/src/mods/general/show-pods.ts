import { ConnectionManagerEvents, DofusWindow, EquipmentWindow, GUIWindowEvents } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { EventManager } from '../helpers'
import { Mod } from '../mod'

export class ShowPodsMod extends Mod {
  private readonly equipmentWindow: EquipmentWindow
  private readonly eventManager = new EventManager()

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    const window = this.wGame.gui.windowsContainer.getChildren().find((w) => w.id === 'equipment')
    if (window?.id === 'equipment') {
      this.equipmentWindow = window
    } else {
      throw new Error('Cant find the equipment window')
    }

    this.start()
  }

  private start(): void {
    this.equipmentWindow.on('open', () => {
      if (this.equipmentWindow.openState) {
        this.show()
      } else {
        this.eventManager.once<GUIWindowEvents, 'opened'>(this.equipmentWindow, 'opened', () => this.show())
      }
    })
  }

  private show() {
    const podContainer = this.equipmentWindow.storageBox._childrenList[0]._childrenList.find((c) =>
      c.hasClassName('podContainer')
    )
    if (!podContainer) {
      throw new Error("can't find the pod container")
    }
    const progressBarContainer = podContainer._childrenList.find((c) => c.hasClassName('progressBarContainer'))
    if (!progressBarContainer) {
      throw new Error("can't find the progress bar container")
    }
    const podsLabel = progressBarContainer._childrenList[0]
    if (!podsLabel) {
      throw new Error("can't find the pod label")
    }

    const updatePods = (msg: { weight: number; weightMax: number }) => {
      const pods = this.formatNumber(msg.weightMax - msg.weight)
      podsLabel.setText(`${pods} Pods:`)
    }

    updatePods({
      weight: this.wGame.gui.playerData.inventory.weight,
      weightMax: this.wGame.gui.playerData.inventory.maxWeight
    })

    this.eventManager.on<ConnectionManagerEvents, 'InventoryWeightMessage'>(
      this.wGame.dofus.connectionManager,
      'InventoryWeightMessage',
      (msg) => updatePods(msg)
    )
  }

  private formatNumber(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  destroy() {
    this.eventManager.close()
  }
}
