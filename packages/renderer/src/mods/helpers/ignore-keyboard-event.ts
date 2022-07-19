export const ignoreKeyboardEvent = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement
  const tagName = target.tagName
  if (tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
    return true
  }

  return false
}
