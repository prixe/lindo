import { WuiDom } from './wui-dom'

export interface WorldMap extends WuiDom {
  _loadChunksInView: () => void
  _scene: {
    move: (cx: number, cy: number, tx: number, ty: number, scale: number) => void
    camera: {
      zoom: number
      zoomTarget: number
      zoomTo: (zoom: number) => void
    }
  }
}
