import { ActorManager } from './actor-manager'
import { InteractiveElement, StatedElement } from './element'
import { MapCell, MapDirection, MapScene } from './map'
import { CellInfo, SpellRangeLayer } from './spell-range-layer'

export interface IsoEngine {
  attackActor: (actorId: number) => void
  background: {
    render: () => void
  }
  useInteractive: (elemId: number, skillInstanceUid?: number) => void
  _movePlayerOnMap: (cellId: number, bool?: boolean, cb?: () => void) => void
  _castSpellImmediately: (cellId: number) => void
  _spellRangeLayer: SpellRangeLayer
  mapScene: MapScene
  gotoNeighbourMap: (direction: MapDirection, cell: number, x: number, y: number) => void
  mapRenderer: {
    isFightMode: boolean
    mapId: number
    interactiveElements: Record<number, InteractiveElement>
    statedElements: Record<number, StatedElement>
    isWalkable: (cell: number | null) => boolean
    getChangeMapFlags: (cell: number | null) => Record<MapDirection, boolean>
    getCellSceneCoordinate: (cell: number) => {
      x: number
      y: number
    }
    getCellId: (x: number, y: number) => CellInfo
    map: {
      cells: MapCell[]
    }
    grid: {
      getCoordinateGridFromCellId: (cellId: number) => {
        i: number // x
        j: number // y
      }
      grid: Array<
        Array<{
          cellId: number
        }>
      >
    }
  }
  actorManager: ActorManager
}
