export interface MapScene {
  l: number
  t: number
  areasToRefresh: Record<string, Array<number>>
  camera: {
    zoom: number
    maxZoom: number
    zoomTo: (zoom: number) => void
  }
  canvas: {
    height: number
  }
  convertSceneToCanvasCoordinate: (
    x: number,
    y: number
  ) => {
    x: number
    y: number
  }
  _refreshAreas: () => void
}
