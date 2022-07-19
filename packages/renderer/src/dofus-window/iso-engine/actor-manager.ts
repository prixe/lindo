import { GameRolePlayActor } from './actor'
import { OccupiedCells } from './map'

export type Bbox = [number, number, number, number]

export interface DisplayActor {
  id: number
  animated: boolean
  animSymbol: unknown
  moving: boolean
  bbox: Bbox
  canMoveDiagonally: boolean
  carriedActor: unknown
  carriedEntity: unknown
  cellId: number
  data: GameRolePlayActor
  cancelMovement: (callback: () => void) => void
  isMerchant: () => boolean
  direction: number
  emoteAnimated: boolean
  circleGraphic: unknown
  contextualId: number
}

export interface ActorManager {
  actors: Record<string | number, DisplayActor>
  getActor: (userId: number) => DisplayActor
  getIndexedVisibleActors: () => Record<number, DisplayActor>
  getOccupiedCells: (cellId: number | null) => OccupiedCells | undefined
  userId: number
  userActor: DisplayActor
  _occupiedCells: OccupiedCells
}
