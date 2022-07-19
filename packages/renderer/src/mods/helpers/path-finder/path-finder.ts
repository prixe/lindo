import { DofusWindow, MapCell, OccupiedCells } from '@/dofus-window'
import { CellPathCandidate } from './cell-path-candidate'
import { CellPathData } from './cell-path-data'

export class PathFinder {
  private static OCCUPIED_CELL_WEIGHT = 10
  private static ELEVATION_TOLERANCE = 11.825
  private static WIDTH = 33 + 2
  private static HEIGHT = 34 + 2
  private static CELL_NUMBER = 560

  private mapPoints: Record<string, number>
  private grid: Array<Array<CellPathData>>
  private useOldMovementSystem: boolean
  private firstCellZone?: number

  constructor() {
    this.mapPoints = {}
    this.grid = []
    this.useOldMovementSystem = false

    this._generateMapPoints()
    this._generateGrid()
  }

  resetPath() {
    this.mapPoints = {}
    this.grid = []
    this.useOldMovementSystem = false

    this._generateMapPoints()
    this._generateGrid()
  }

  fillPathGrid(map: DofusWindow['isoEngine']['mapRenderer']['map']) {
    this.firstCellZone = map.cells[0].z || 0
    this.useOldMovementSystem = true

    for (let i = 0; i < PathFinder.WIDTH; i += 1) {
      const row = this.grid[i]
      for (let j = 0; j < PathFinder.HEIGHT; j += 1) {
        const cellId = this.getCellId(i - 1, j - 1)
        const cellPath = row[j]
        const cell = map.cells[cellId]
        this.updateCellPath(cell, cellPath)
      }
    }
  }

  /**
   *
   * @param {*} source userCellId
   * @param {*} target targetCellId
   * @param {*} occupiedCells occupiedCells
   * @param {*} allowDiagonals canMoveDiagonally
   * @param {*} stopNextToTarget bool mis a false
   *
   */
  getPath(
    source: number,
    target: number,
    occupiedCells: OccupiedCells,
    allowDiagonals: boolean = true,
    stopNextToTarget: boolean = false
  ) {
    const srcPos = this.getMapPoint(source) // source index
    const dstPos = this.getMapPoint(target) // destination index

    const si = srcPos.x + 1 // source i
    const sj = srcPos.y + 1 // source j

    const srcCell = this.grid[si][sj]
    if (srcCell.zone === -1) {
      // Searching for accessible cell around source
      let bestFit
      let bestDist = Infinity
      let bestFloorDiff = Infinity
      for (let i = -1; i <= 1; i += 1) {
        for (let j = -1; j <= 1; j += 1) {
          if (i === 0 && j === 0) {
            continue
          }

          const cell = this.grid[si + i][sj + j]
          if (cell.zone === -1) {
            continue
          }

          const floorDiff = Math.abs(cell.floor - srcCell.floor)
          const dist = Math.abs(i) + Math.abs(j)
          if (bestFit === undefined || floorDiff < bestFloorDiff || (floorDiff <= bestFloorDiff && dist < bestDist)) {
            bestFit = cell
            bestDist = dist
            bestFloorDiff = floorDiff
          }
        }
      }

      if (bestFit !== undefined) {
        return [source, this.getCellId(bestFit.i - 1, bestFit.j - 1)]
      }

      console.error(new Error('[pathFinder.getPath] Player is stuck in ' + si + '/' + sj))
      return [source]
    }

    const di = dstPos.x + 1 // destination i
    const dj = dstPos.y + 1 // destination j

    // marking cells as occupied
    let cellPos
    for (const cellId of Object.keys(occupiedCells).map(parseFloat)) {
      cellPos = this.getMapPoint(cellId)
      this.grid[cellPos.x + 1][cellPos.y + 1].weight += PathFinder.OCCUPIED_CELL_WEIGHT
    }

    let candidates: Array<CellPathCandidate> = []
    const selections = []

    // First cell in the path
    const distSrcDst = Math.sqrt((si - di) * (si - di) + (sj - dj) * (sj - dj))
    let selection = new CellPathCandidate(si, sj, 0, distSrcDst)

    // Adding cells to path until destination has been reached
    let reachingPath
    let closestPath: CellPathCandidate | undefined = selection
    while (selection.i !== di || selection.j !== dj) {
      this.addCandidates(selection, di, dj, candidates, allowDiagonals)

      // Looking for candidate with the smallest additional length to path
      // in O(number of candidates)
      const n = candidates.length
      if (n === 0) {
        // No possible path
        // returning the closest path to destination
        selection = closestPath
        break
      }

      let minPotentialWeight = Infinity
      let selectionIndex = 0
      for (let c = 0; c < n; c += 1) {
        const candidate = candidates[c]
        if (candidate.w + candidate.d < minPotentialWeight) {
          selection = candidate
          minPotentialWeight = candidate.w + candidate.d
          selectionIndex = c
        }
      }

      selections.push(selection)
      candidates.splice(selectionIndex, 1)

      // If stopNextToTarget
      // then when reaching a distance of less than Math.sqrt(2) the destination is considered as reached
      // (the threshold has to be bigger than sqrt(2) but smaller than 2, to be safe we use the value 1.5)
      if (selection.d === 0 || (stopNextToTarget && selection.d < 1.5)) {
        // Selected path reached destination
        if (reachingPath === undefined || selection.w < reachingPath.w) {
          reachingPath = selection
          closestPath = selection

          // Clearing candidates dominated by current solution to speed up the algorithm
          const trimmedCandidates = []
          for (let c = 0; c < candidates.length; c += 1) {
            const candidate = candidates[c]
            if (candidate.w + candidate.d < reachingPath.w) {
              trimmedCandidates.push(candidate)
            } else {
              this.grid[candidate.i][candidate.j].candidateRef = undefined
            }
          }
          candidates = trimmedCandidates
        }
      } else {
        if (selection.d < closestPath.d) {
          // 'selection' is the new closest path to destination
          closestPath = selection
        }
      }
    }

    // Removing candidate reference in each cell in selections and active candidates
    for (let c = 0; c < candidates.length; c += 1) {
      const candidate = candidates[c]
      this.grid[candidate.i][candidate.j].candidateRef = undefined
    }

    for (let s = 0; s < selections.length; s += 1) {
      selection = selections[s]
      this.grid[selection.i][selection.j].candidateRef = undefined
    }

    // Marking cells as unoccupied
    for (const cellId of Object.keys(occupiedCells).map(parseFloat)) {
      cellPos = this.getMapPoint(cellId)
      this.grid[cellPos.x + 1][cellPos.y + 1].weight -= PathFinder.OCCUPIED_CELL_WEIGHT
    }

    const shortestPath = []
    while (closestPath !== undefined) {
      shortestPath.unshift(this.getCellId(closestPath!.i - 1, closestPath!.j - 1))
      closestPath = closestPath!.path
    }

    return shortestPath
  }

  updateCellPath(cell: MapCell, cellPath: CellPathData) {
    if (cell !== undefined && cell.l & 1) {
      cellPath.floor = cell.f || 0
      cellPath.zone = cell.z || 0
      cellPath.speed = 1 + (cell.s || 0) / 10

      if (cellPath.zone !== this.firstCellZone) {
        this.useOldMovementSystem = false
      }
    } else {
      cellPath.floor = -1
      cellPath.zone = -1
    }
  }

  addCandidate(
    c: CellPathData,
    w: number,
    di: number,
    dj: number,
    candidates: Array<CellPathCandidate>,
    path: CellPathCandidate
  ) {
    const i = c.i
    const j = c.j

    // The total weight of the candidate is the weight of previous path
    // plus its weight (calculated based on occupancy and speed factor)
    const distanceToDestination = Math.sqrt((di - i) * (di - i) + (dj - j) * (dj - j))
    w = w / c.speed + c.weight

    if (c.candidateRef === undefined) {
      const candidateRef = new CellPathCandidate(i, j, path.w + w, distanceToDestination, path)
      candidates.push(candidateRef)
      c.candidateRef = candidateRef
    } else {
      const currentWeight = c.candidateRef.w
      const newWeight = path.w + w
      if (newWeight < currentWeight) {
        c.candidateRef.w = newWeight
        c.candidateRef.path = path
      }
    }
  }

  addCandidates(
    path: CellPathCandidate,
    di: number,
    dj: number,
    candidates: Array<CellPathCandidate>,
    allowDiagonals: boolean
  ) {
    const i = path.i
    const j = path.j
    const c = this.grid[i][j]

    // Searching whether adjacent cells can be candidates to lengthen the path

    // Adjacent cells
    const c01 = this.grid[i - 1][j]
    const c10 = this.grid[i][j - 1]
    const c12 = this.grid[i][j + 1]
    const c21 = this.grid[i + 1][j]

    // weight of path in straight line = 1
    const weightStraight = 1

    if (this.areCommunicating(c, c01)) {
      this.addCandidate(c01, weightStraight, di, dj, candidates, path)
    }
    if (this.areCommunicating(c, c21)) {
      this.addCandidate(c21, weightStraight, di, dj, candidates, path)
    }
    if (this.areCommunicating(c, c10)) {
      this.addCandidate(c10, weightStraight, di, dj, candidates, path)
    }
    if (this.areCommunicating(c, c12)) {
      this.addCandidate(c12, weightStraight, di, dj, candidates, path)
    }

    // Searching whether diagonally adjacent cells can be candidates to lengthen the path

    // Diagonally adjacent cells
    const c00 = this.grid[i - 1][j - 1]
    const c02 = this.grid[i - 1][j + 1]
    const c20 = this.grid[i + 1][j - 1]
    const c22 = this.grid[i + 1][j + 1]

    // weight of path in diagonal = Math.sqrt(2)
    const weightDiagonal = Math.sqrt(2)

    if (allowDiagonals) {
      if (this.canMoveDiagonallyTo(c, c00, c01, c10)) {
        this.addCandidate(c00, weightDiagonal, di, dj, candidates, path)
      }
      if (this.canMoveDiagonallyTo(c, c20, c21, c10)) {
        this.addCandidate(c20, weightDiagonal, di, dj, candidates, path)
      }
      if (this.canMoveDiagonallyTo(c, c02, c01, c12)) {
        this.addCandidate(c02, weightDiagonal, di, dj, candidates, path)
      }
      if (this.canMoveDiagonallyTo(c, c22, c21, c12)) {
        this.addCandidate(c22, weightDiagonal, di, dj, candidates, path)
      }
    }
  }

  getCellId(x: number, y: number) {
    return this.mapPoints[x + '_' + y]
  }

  private _generateMapPoints() {
    this.mapPoints = {}
    for (let cellId = 0; cellId < PathFinder.CELL_NUMBER; cellId++) {
      const { x, y } = this.getMapPoint(cellId)
      this.mapPoints[x + '_' + y] = cellId
    }
  }

  private _generateGrid() {
    this.grid = []
    for (let i = 0; i < PathFinder.WIDTH; i += 1) {
      const row = []
      for (let j = 0; j < PathFinder.HEIGHT; j += 1) {
        row[j] = new CellPathData(i, j)
      }
      this.grid[i] = row
    }
  }

  getMapPoint(cellId: number) {
    const row = (cellId % 14) - ~~(cellId / 28)
    const x = row + 19
    const y = row + ~~(cellId / 14)
    return {
      x,
      y
    }
  }

  areCommunicating(c1: CellPathData, c2: CellPathData, oldMovementSystem = false) {
    const sameFloor = c1.floor === c2.floor
    const sameZone = c1.zone === c2.zone
    const ELEVATION_TOLERANCE = 11.825
    if (sameFloor) return true
    if (!sameZone) return false

    return oldMovementSystem || c1.zone !== 0 || Math.abs(c1.floor - c2.floor) <= ELEVATION_TOLERANCE
  }

  canMoveDiagonallyTo(c1: CellPathData, c2: CellPathData, c3: CellPathData, c4: CellPathData) {
    // Can move between c1 and c2 diagonally only if c1 and c2 are compatible and if c1 is compatible either with c3 or c4
    return (
      this.areCommunicating(c1, c2, this.useOldMovementSystem) &&
      (this.areCommunicating(c1, c3, this.useOldMovementSystem) ||
        this.areCommunicating(c1, c4, this.useOldMovementSystem))
    )
  }
}
