import {
  ChatMessage,
  ConnectionManagerEvents,
  DofusWindow,
  GameFightTurnStartMessage,
  GameRolePlayAggressionMessage,
  GUIEvents,
  PartyInvitationMessage,
  TaxMessage,
  TextInformationMessage
} from '@/dofus-window'
import TypedEmitter from 'typed-emitter'
import EventEmitter from 'eventemitter3'
import { EventManager } from '../helpers'
import { Mod } from '../mod'
import axios from 'axios'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'

export type NotificationsModEvents = {
  notification: () => void
  focusTabRequest: () => void
}

export class NotificationsMod extends Mod {
  readonly eventEmitter = new EventEmitter() as TypedEmitter<NotificationsModEvents>
  private readonly _eventManager = new EventManager()
  private _ressourcesKnow: Record<string, string> = {}

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.start()
  }

  private start(): void {
    this._eventManager.on<ConnectionManagerEvents, 'ChatServerMessage'>(
      this.wGame.dofus.connectionManager,
      'ChatServerMessage',
      (msg) => {
        this._sendMPNotif(msg)
      }
    )

    this._eventManager.on<GUIEvents, 'GameFightTurnStartMessage'>(
      this.wGame.gui,
      'GameFightTurnStartMessage',
      (msg) => {
        this._sendFightTurnNotif(msg)
      }
    )

    this._eventManager.on<ConnectionManagerEvents, 'TaxCollectorAttackedMessage'>(
      this.wGame.dofus.connectionManager,
      'TaxCollectorAttackedMessage',
      (tax) => {
        this._sendTaxCollectorNotif(tax)
      }
    )

    this._eventManager.on<ConnectionManagerEvents, 'GameRolePlayArenaFightPropositionMessage'>(
      this.wGame.dofus.connectionManager,
      'GameRolePlayArenaFightPropositionMessage',
      () => {
        this._sendKolizeumNotif()
      }
    )

    this._eventManager.on<ConnectionManagerEvents, 'PartyInvitationMessage'>(
      this.wGame.dofus.connectionManager,
      'PartyInvitationMessage',
      (msg) => {
        this._sendPartyInvitationNotif(msg)
      }
    )

    this._eventManager.on<ConnectionManagerEvents, 'GameRolePlayAggressionMessage'>(
      this.wGame.dofus.connectionManager,
      'GameRolePlayAggressionMessage',
      (msg) => {
        this._sendAggressionNotif(msg)
      }
    )

    this._eventManager.on<ConnectionManagerEvents, 'TextInformationMessage'>(
      this.wGame.dofus.connectionManager,
      'TextInformationMessage',
      (msg) => {
        this._sendHdvSaleNotif(msg)
      }
    )
  }

  private _sendMPNotif(msg: ChatMessage) {
    if (!this.wGame.document.hasFocus() && this.rootStore.optionStore.gameNotification.privateMessage) {
      if (msg.channel === 9) {
        this.eventEmitter.emit('notification')

        const mpNotif = new Notification(this.LL.notifications.privateMessage({ senderName: msg.senderName }), {
          body: msg.content
        })

        this._handleClickNotification(mpNotif)
      }
    }
  }

  private _sendFightTurnNotif(msg: GameFightTurnStartMessage) {
    if (!this.wGame.document.hasFocus() && this.wGame.gui.playerData.characterBaseInformations.id === msg.id) {
      if (this.rootStore.optionStore.gameNotification.fightTurn) {
        this.eventEmitter.emit('notification')

        const turnNotif = new Notification(
          this.LL.notifications.fightTurn({
            characterName: this.wGame.gui.playerData.characterBaseInformations.name
          })
        )

        this._handleClickNotification(turnNotif)
      }

      if (this.rootStore.optionStore.gameFight.focusOnFightTurn) {
        window.lindoAPI.focusCurrentWindow()
        this.eventEmitter.emit('focusTabRequest')
      }
    }
  }

  private _sendTaxCollectorNotif(tax: TaxMessage) {
    if (!this.wGame.document.hasFocus() && this.rootStore.optionStore.gameNotification.taxCollector) {
      this.eventEmitter.emit('notification')

      const guildName = tax.guild.guildName
      const x = tax.worldX
      const y = tax.worldY
      const zoneName = tax.enrichData.subAreaName
      const tcName = tax.enrichData.firstName + ' ' + tax.enrichData.lastName

      const taxCollectorNotif = new Notification(this.LL.notifications.taxCollector(), {
        body: zoneName + ' [' + x + ', ' + y + '] : ' + guildName + ', ' + tcName
      })

      this._handleClickNotification(taxCollectorNotif)
    }
  }

  private _sendKolizeumNotif() {
    if (!this.wGame.document.hasFocus() && this.rootStore.optionStore.gameNotification.kolizeum) {
      this.eventEmitter.emit('notification')

      const kolizeumNotif = new Notification(this.LL.notifications.kolizeum())

      this._handleClickNotification(kolizeumNotif)
    }
  }

  private _sendPartyInvitationNotif(e: PartyInvitationMessage) {
    if (!this.wGame.document.hasFocus() && this.rootStore.optionStore.gameNotification.kolizeum) {
      this.eventEmitter.emit('notification')

      const partyInvitationNotif = new Notification(this.LL.notifications.partyInvitation({ senderName: e.fromName }))

      this._handleClickNotification(partyInvitationNotif)
    }
  }

  private _sendAggressionNotif(e: GameRolePlayAggressionMessage) {
    if (
      !this.wGame.document.hasFocus() &&
      this.rootStore.optionStore.gameNotification.aggression &&
      e.defenderId === this.wGame.gui.playerData.characterBaseInformations.id
    ) {
      this.eventEmitter.emit('notification')

      const aggressionNotif = new Notification(this.LL.notifications.aggression())

      this._handleClickNotification(aggressionNotif)
    }
  }

  private async _sendHdvSaleNotif(e: TextInformationMessage) {
    if (!this.wGame.document.hasFocus() && this.rootStore.optionStore.gameNotification.itemSold) {
      if (e.msgId === 65) {
        const id = e.parameters[1]

        this.eventEmitter.emit('notification')

        if (this._ressourcesKnow[id] == null) {
          // TODO: type the response body
          const res = await axios.post('https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=1.49.9', {
            class: 'Items',
            ids: [id]
          })
          this._ressourcesKnow[id] = res.data[id].nameId
        }

        const saleNotif = new Notification(this.LL.notifications.saleMessage(), {
          // TODO: translate body
          body: `+ ${e.parameters[0]} Kamas (vente de ${e.parameters[3]} ${this._ressourcesKnow[id]})`
        })

        this._handleClickNotification(saleNotif)
      }
    }
  }

  private _handleClickNotification(notification: Notification) {
    notification.onclick = () => {
      window.lindoAPI.focusCurrentWindow()
      this.eventEmitter.emit('focusTabRequest')
    }
  }

  destroy() {
    this.eventEmitter.removeAllListeners()
    this._eventManager.close()
  }
}
