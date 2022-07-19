import { DofusWindow } from '@/dofus-window'

export class HarvestBar {
  private wGame: DofusWindow
  private container: HTMLDivElement
  private harvestBar: HTMLDivElement
  private harvestTimeText: HTMLDivElement
  private updateInterval?: number
  private interval: number = 200

  private cellId: number = 0
  private duration: number = 0
  private remainingTime: number = 0

  constructor(wGame: DofusWindow) {
    this.wGame = wGame

    this.container = document.createElement('div')
    this.container.id = 'harvestBarContainer'
    this.container.className = 'harvestBarContainer'

    this.wGame.foreground.rootElement.appendChild(this.container)

    const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(this.cellId)
    const pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y)

    /* harvestBar */
    this.harvestBar = document.createElement('div')
    this.harvestBar.id = 'harvestBar'
    this.harvestBar.className = 'harvestBar'
    this.container.appendChild(this.harvestBar)

    this.container.style.left = pos.x - this.container.offsetWidth / 2 + 'px'
    this.container.style.top = pos.y + 'px'

    /* harvestTimeText */
    this.harvestTimeText = document.createElement('div')
    this.harvestTimeText.id = 'harvestTime'
    this.harvestTimeText.className = 'harvestTimeText'
    this.wGame.foreground.rootElement.appendChild(this.harvestTimeText)

    this.harvestTimeText.style.left = pos.x - this.container.offsetWidth / 2 + 'px'
    this.harvestTimeText.style.top = pos.y + 'px'

    this.update()
  }

  private show() {
    // this.createBar()
    this.container.style.visibility = 'visible'

    this.updateInterval = window.setInterval(() => {
      this.remainingTime -= this.interval
      this.update()
    }, this.interval)
  }

  private update() {
    /* Harvest Bar */
    const time: number = (this.remainingTime / this.duration) * 100
    this.harvestBar.style.width = (time > 0 ? time : '0') + '%'

    /* Harvest Text */
    this.harvestTimeText.innerHTML = (this.remainingTime > 0 ? this.remainingTime / 1000 : '0') + 's'
  }

  public harvestStarted(cellId: number, duration: number) {
    this.cellId = cellId
    this.duration = duration * 100
    this.remainingTime = duration * 100
    this.show()
  }

  public destroy(): boolean {
    clearInterval(this.updateInterval)
    if (this.container && this.container.parentElement) this.container.parentElement.removeChild(this.container)
    if (this.harvestTimeText && this.harvestTimeText.parentElement)
      this.harvestTimeText.parentElement.removeChild(this.harvestTimeText)

    return true
  }
}
