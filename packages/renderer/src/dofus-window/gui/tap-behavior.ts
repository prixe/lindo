export interface TapBehavior {
  isEnable: () => boolean
  setEnable: (enable: boolean) => void
  cancelTap: () => void
  tap: () => void
}
