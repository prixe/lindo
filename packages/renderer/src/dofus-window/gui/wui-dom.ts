export interface WuiDom<Element = HTMLDivElement> {
  hide: () => void
  _childrenList: Array<WuiDom>
  rootElement: Element
  setText: (text: string) => boolean
  hasClassName: (className: string) => boolean
  isVisible: () => boolean
}
