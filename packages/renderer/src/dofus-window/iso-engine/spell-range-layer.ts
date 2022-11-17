export interface SpellRangeLayer {
  cellInfos: CellInfo[]
}

export interface CellInfo {
  cell: number
  transformState: {
    r: number
    g: number
    b: number
  }
}
