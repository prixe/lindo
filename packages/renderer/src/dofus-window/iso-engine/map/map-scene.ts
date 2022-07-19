export interface MapScene {
  l: number
  t: number
  areasToRefresh: Record<string, Array<number>>
  camera: {
    zoom: number
    zoomTo: (zoom: number) => void
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
