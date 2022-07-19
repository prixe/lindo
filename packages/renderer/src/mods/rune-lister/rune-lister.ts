import { ConnectionManagerEvents, Data, DofusWindow, MessageSent } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { EventManager } from '../helpers'
import { Mod } from '../mod'

interface MessageItem {
  name: number
  quantity: number
}

export class RuneListerMod extends Mod {
  private readonly eventManager = new EventManager()
  readonly fragmentGid = 8378
  openedRune = false
  messageItems: Array<MessageItem> = []

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)

    this.eventManager.on<ConnectionManagerEvents, 'send'>(
      this.wGame.dofus.connectionManager,
      'send',
      this.onSendMessage
    )
    this.eventManager.on<ConnectionManagerEvents, 'data'>(
      this.wGame.dofus.connectionManager,
      'data',
      this.onReceiveMessage
    )
  }

  onSendMessage = (msg: MessageSent) => {
    if (!msg.data.data) return
    if (msg.data.data.type !== 'ObjectUseMessage') return
    const uid = msg.data.data.data.objectUID
    this.checkMagicFragment(uid)
  }

  onReceiveMessage = (msg: Data) => {
    if (this.openedRune) {
      if (msg._messageType === 'ObjectQuantityMessage') this.addObjectQuantity(msg.objectUID, msg.quantity)
      else if (msg._messageType === 'InventoryWeightMessage') this.showAllMessages()
      else if (msg._messageType === 'ObjectUseMessage') this.checkMagicFragment(msg.objectUID)
    }
  }

  getGidFromUid(uid: number) {
    return this.wGame.gui.playerData.inventory.objects[uid].objectGID
  }

  getQuantityFromUid(uid: number) {
    return this.wGame.gui.playerData.inventory.objects[uid].quantity
  }

  itsARune(uid: number) {
    return this.wGame.gui.playerData.inventory.objects[uid].item.type.id === 78
  }

  addObjectQuantity(uid: number, quantity: number) {
    if (!this.itsARune(uid)) return
    const mi = { name: this.getGidFromUid(uid), quantity: quantity - this.getQuantityFromUid(uid) }
    this.messageItems.push(mi)
  }

  showAllMessages() {
    // Display all the runes
    this.openedRune = false
    const msgs: Array<string> = []
    this.messageItems.forEach((mi) => {
      const msg = this.LL.mod.runeLister.message({ quantity: mi.quantity, runeName: mi.name.toString() })
      msgs.push(msg)
    })
    this.wGame.gui.chat.logMsg(msgs.join('\n'))
    this.messageItems = []
  }

  checkMagicFragment(uid: number) {
    const item = this.wGame.gui.playerData.inventory.objects[uid]
    if (!item) return
    if (item.objectGID === this.fragmentGid) this.openedRune = true
  }

  destroy() {
    this.eventManager.close()
  }
}
