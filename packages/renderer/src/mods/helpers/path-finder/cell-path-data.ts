import { CellPathCandidate } from './cell-path-candidate'

export class CellPathData {
  i: number
  j: number
  floor: number
  zone: number
  speed: number
  weight: number
  candidateRef?: CellPathCandidate

  constructor(i: number, j: number) {
    this.i = i
    this.j = j

    this.floor = -1
    this.zone = -1
    this.speed = 1

    this.weight = 0
    this.candidateRef = undefined
  }
}
