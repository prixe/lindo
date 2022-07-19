export * from './map-scene'

export type MapDirection = 'left' | 'right' | 'top' | 'bottom'

export interface MapCell {
  z: number
  f: number
  l: number
  s: number
}

export type OccupiedCells = {
  [index: number]: Array<{
    actorId: number
  }>
}
