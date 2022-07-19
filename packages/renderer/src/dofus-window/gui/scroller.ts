export interface ScrollerOption {
  scrollX: boolean
  scrollY: boolean
}

export interface ScrollerIndicator {
  options: {
    listenY: boolean
    listenX: boolean
  }
  wrapper: HTMLDivElement
}

export interface Scroller {
  iScroll: {
    options: ScrollerOption
    indicators: Array<ScrollerIndicator>
    refresh: () => void
  }
}
