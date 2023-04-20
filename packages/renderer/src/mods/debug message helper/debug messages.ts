import { Mod } from '@/mods/mod'
import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { EventManager } from '@/mods/helpers'

export class DebugMessagesMod extends Mod {
  private readonly eventManager = new EventManager()

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.load()
    console.log('- enabled debug messages')
  }

  private load() {
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
    this.eventManager.removeListener(this.wGame.dofus.connectionManager, 'send', this.onSend)
    this.eventManager.removeListener(this.wGame.dofus.connectionManager, 'data', this.onReceive)
    this.eventManager.removeListener(this.wGame.dofus.connectionManager, 'messageSequence', this.onMsgSeq)
  }
}
