export interface FollowInstructionSchema {
  type: 'cell' | 'map' | 'sun' | 'interactive'
}

export interface CellFollowInstruction extends FollowInstructionSchema {
  type: 'cell'
  mapId: number
  cellId: number
}

export interface MapFollowInstruction extends FollowInstructionSchema {
  type: 'map'
  mapId: number
  cellId: number
}

export interface SunFollowInstruction extends FollowInstructionSchema {
  type: 'sun'
  mapId: number
  cellId: number
}

export interface InteractiveFollowInstruction extends FollowInstructionSchema {
  type: 'interactive'
  mapId: number
  elemId: number
  skillInstanceUid: number
}

export type FollowInstruction =
  | CellFollowInstruction
  | MapFollowInstruction
  | SunFollowInstruction
  | InteractiveFollowInstruction
