import { DofusWindow, IScroll, MapScene, WorldMap } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { Mod } from '../mod'

export class JsFixesMod extends Mod {
  private _disposers: Array<() => void> = []

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.contextLost()
    this.spritesOutOfScreen()
    this.mapZoom()
  }

  private contextLost() {
    const onWebGLContextLost = (event: WebGLContextEvent) => {
      console.info('reload webglcontext cause: webglcontextlost')
      this.wGame.isoEngine.background.render()
      event.preventDefault()
    }
    const canvas = this.wGame.document.getElementById('mapScene-canvas') as HTMLCanvasElement
    canvas.addEventListener('webglcontextlost', onWebGLContextLost as never, false)

    this._disposers.push(() => {
      canvas.removeEventListener('webglcontextlost', onWebGLContextLost as never)
    })
  }

  private spritesOutOfScreen() {
    const _refreshAreasBackup = this.wGame.isoEngine.mapScene._refreshAreas.bind(this.wGame.isoEngine.mapScene)
    this.wGame.isoEngine.mapScene._refreshAreas = function () {
      for (const id in this.areasToRefresh) {
        if (this.areasToRefresh[id][3] < this.t) {
          this.areasToRefresh[id][2] = this.t
          this.areasToRefresh[id][3] = this.t + 5
        }
        if (this.areasToRefresh[id][1] < this.l) {
          this.areasToRefresh[id][0] = this.l
          this.areasToRefresh[id][1] = this.l + 5
        }
      }
      _refreshAreasBackup()
    }

    this._disposers.push(() => {
      this.wGame.isoEngine.mapScene._refreshAreas = _refreshAreasBackup
    })
  }

  private mapZoom() {
    const worldZoom = function (worldMap: WorldMap, e: IScroll) {
      const zoom = -e.deltaY / 600
      const previousZ = worldMap._scene.camera.zoomTarget
      worldMap._scene.camera.zoomTo(worldMap._scene.camera.zoom * (1 + zoom))
      const newZ = worldMap._scene.camera.zoomTarget
      const deltaZ = newZ / previousZ
      worldMap._scene.move(0, 0, e.layerX * (deltaZ - 1), e.layerY * (deltaZ - 1), 1)
      worldMap._loadChunksInView()
    }

    const mapZoom = function (mapScene: MapScene, e: IScroll) {
      const zoom = -e.deltaY / 600
      mapScene.camera.zoomTo(mapScene.camera.zoom * (1 + zoom))
    }

    this.wGame.gui.windowsContainer.getChildren().forEach((child) => {
      if (child.id === 'worldMap') {
        child.on('open', () => {
          const onMouseWheel = (e: Event) => {
            worldZoom(child._worldMap, e as IScroll)
          }
          child._worldMap.rootElement.addEventListener('mousewheel', onMouseWheel)
          this._disposers.push(() => {
            child._worldMap.rootElement.removeEventListener('mousewheel', onMouseWheel)
          })
        })
      }
    })

    const onMouseWheel = (e: Event) => {
      mapZoom(this.wGame.isoEngine.mapScene, e as IScroll)
    }

    this.wGame.foreground.rootElement.addEventListener('mousewheel', onMouseWheel)
    this._disposers.push(() => {
      this.wGame.foreground.rootElement.removeEventListener('mousewheel', onMouseWheel)
    })
  }

  destroy(): void {
    for (const disposer of this._disposers) {
      disposer()
    }
    this._disposers = []
  }
}
