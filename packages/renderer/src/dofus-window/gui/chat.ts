export interface ChatEntry {
  message: string
}

export interface Chat {
  active: boolean
  activate: () => void
  deactivate: () => void
  logMsg: (msg: string) => void
  chatInput: {
    sentMessageHistory: {
      goBack: () => void
      goForward: () => void
      getCurrentEntry: () => ChatEntry
    }
    inputChat: {
      setValue: (value: string) => void
    }
  }
}
