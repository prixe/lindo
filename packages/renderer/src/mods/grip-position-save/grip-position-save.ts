import { Mod } from '../mod'
import { DofusWindow, WuiDom, GUIEvents } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { GripElement, GripPositionCoordinates, GRIP_ELEMENTS } from '@lindo/shared'
import { EventManager } from '../helpers'
import { observe } from 'mobx'

export class GripPositionSaveMod extends Mod {
  private readonly disposer: () => void
  private readonly eventManager = new EventManager()

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.registerEvent()

    this.disposer = observe(this.rootStore.modStore.gripPosition, (change) => {
      if (change.type === 'update') {
        console.log(change)
        this.moveElement(change.name as GripElement)
      }
    })
  }

  public registerEvent(): void {
    GRIP_ELEMENTS.forEach((grip) => {
      this.registerGrip(grip)
    })

    const onResize = () => {
      console.log('onResize')
      // Move grips to not overlap foreground
      GRIP_ELEMENTS.forEach((grip) => {
        this.moveElement(grip)
      })
    }
    this.eventManager.on<GUIEvents, 'resize'>(this.wGame.gui, 'resize', onResize)
  }

  private moveElement(target: GripElement) {
    const elementPosition = this.rootStore.modStore.gripPosition[target]
    if (elementPosition && this.wGame?.gui?.isConnected) {
      const mapScene = this.wGame.document.querySelector<HTMLCanvasElement>('#mapScene-canvas')!
      let availableWidth = mapScene.width
      const availableHeight = mapScene.height
      if (mapScene.offsetLeft) {
        availableWidth = availableWidth + mapScene.offsetLeft
      }
      const cssTarget = '.' + target.charAt(0).toUpperCase() + target.slice(1)
      const targetWidth = this.wGame.document?.querySelector<HTMLDivElement>(cssTarget)?.clientWidth
      const targetHeight = this.wGame.document?.querySelector<HTMLDivElement>(cssTarget)?.clientHeight
      if (
        targetWidth !== undefined &&
        targetHeight !== undefined &&
        availableWidth !== undefined &&
        availableHeight !== undefined
      ) {
        const left =
          elementPosition.left < availableWidth - targetWidth ? elementPosition.left : availableWidth - targetWidth
        const top =
          elementPosition.top < availableHeight - targetHeight ? elementPosition.top : availableHeight - targetHeight

        // Removing existing stylesheet
        this.wGame?.document?.querySelector?.('#' + target + 'stylesheet')?.remove?.()

        const stylesheet = this.wGame.document.createElement('style')
        stylesheet.id = target + 'stylesheet'
        stylesheet.innerHTML = cssTarget
        stylesheet.innerHTML += '{'
        stylesheet.innerHTML += 'top:' + top + 'px !important;'
        stylesheet.innerHTML += 'left:' + left + 'px !important;'
        stylesheet.innerHTML += '}'
        this.wGame.document.head.appendChild(stylesheet)
      }
    }
  }

  private savePosition(element: GripElement, position: GripPositionCoordinates) {
    this.rootStore.modStore.gripPosition.setGripPosition(element, position)
  }

  private registerGrip(grip: GripElement) {
    this.eventManager.on(this.wGame.gui[grip as never], 'dragEnd', () => {
      const element = this.wGame.gui[grip as never] as WuiDom
      const position: GripPositionCoordinates = {
        top: parseFloat(element.rootElement.style.top.slice(0, -2)),
        left: parseFloat(element.rootElement.style.left.slice(0, -2))
      }
      this.savePosition(grip, position)
    })

    if (grip === 'timeline') {
      this.eventManager.on(this.wGame.gui[grip as never], 'resized', () => {
        this.moveElement(grip)
      })
    }

    if (JSON.parse(window.localStorage.getItem(grip + 'Position')!)) {
      this.moveElement(grip)
    }
  }

  destroy(): void {
    this.disposer()
    this.eventManager.close()
  }
}
