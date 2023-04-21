import { Mod } from '@/mods/mod'
import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { EventManager } from '@/mods/helpers'
import { IObjectDidChange, Lambda, observe } from 'mobx'

interface ValueDidChange {
  value: boolean
  oldValue: boolean
}

export class DebugMessagesMod extends Mod {
  private readonly eventManager = new EventManager()
  private readonly _disposers: Array<Lambda> = []

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    console.log('- enabled debug messages')
    const disposer = observe(this.rootStore.optionStore.window, (change: IObjectDidChange<ValueDidChange>) => {
      if (change.name !== 'debugLogs') return
      if (change.type !== 'update') return
      if (change?.newValue?.value) this.startEvents()
      else this.removeEvents()
    })
    this._disposers.push(disposer)
    if (this.rootStore.optionStore.window.debugLogs) this.load()
  }

  private load() {
    this.startEvents()
  }

  private startEvents() {
    console.log('- starting debug events')
    this.eventManager.on(this.wGame.dofus.connectionManager, 'send', this.onSend)
    this.eventManager.on(this.wGame.dofus.connectionManager, 'data', this.onReceive)
    this.eventManager.on(this.wGame.dofus.connectionManager, 'messageSequence', this.onMsgSeq)
  }

  onSend = (msg: any) => {
    if (msg.call === 'sendMessage') {
      console.debug('%c-> ' + msg.data.data.type, 'background-color: orange; color:black', msg.data.data.data)
    } else {
      console.debug('%c-> ' + msg.data.call, 'background-color: red; color:white', msg.data.data)
    }
  }

  onReceive = (msg: any) => {
    const msgCopy = { ...msg }
    const type = msg._messageType
    delete msgCopy._messageType
    console.debug('%c<- ' + type, 'background-color: green;color: white', msgCopy)
  }

  onMsgSeq = (msg: any) => {
    msg.sequence.forEach((s: any) => {
      const msgCopy = { ...s }
      delete msgCopy._messageType
      console.debug('%cSEQ ' + s._messageType, 'background-color: yellow;color:black;', msgCopy)
    })
  }

  destroy(): void {
    this.removeEvents()
    for (const disposer of this._disposers) {
      disposer()
    }
  }

  private removeEvents() {
    console.log('- removing debug events')
    this.eventManager.removeListener(this.wGame.dofus.connectionManager, 'send', this.onSend)
    this.eventManager.removeListener(this.wGame.dofus.connectionManager, 'data', this.onReceive)
    this.eventManager.removeListener(this.wGame.dofus.connectionManager, 'messageSequence', this.onMsgSeq)
  }
}
