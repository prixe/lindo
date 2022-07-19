export interface MultiAccountContext {
  teamId: string
  teamWindowId: string
}

export interface GameContext {
  gameSrc: string
  characterImagesSrc: string
  windowId: number
  multiAccount?: MultiAccountContext
  changeLogSrc: string
}
