import * as EventEmitter from 'eventemitter3';
import {ElectronService as electron} from '@services/electron/electron.service';
import axios from 'axios';

import {Mod} from "../mod";

export class Notifications extends Mod {
    public eventEmitter: EventEmitter;
    private ressourcesKnow: Array<string> = [];

    startMod(): void {
        this.eventEmitter = new EventEmitter();
        this.params = this.settings.option.notification;

        this.on(this.wGame.dofus.connectionManager, 'ChatServerMessage', (msg: any) => {
            this.sendMPNotif(msg);
        });
        this.on(this.wGame.gui, 'GameFightTurnStartMessage', (actor: any) => {
            this.sendFightTurnNotif(actor);
        });
        this.on(this.wGame.dofus.connectionManager, 'TaxCollectorAttackedMessage', (tc: any) => {
            this.sendTaxCollectorNotif(tc);
        });
        this.on(this.wGame.dofus.connectionManager, 'GameRolePlayArenaFightPropositionMessage', (e: any) => {
            this.sendKolizeumNotif();
        });
        this.on(this.wGame.dofus.connectionManager, 'PartyInvitationMessage', (e: any) => {
            this.sendPartyInvitationNotif(e);
        });
        this.on(this.wGame.dofus.connectionManager, 'GameRolePlayAggressionMessage', (e: any) => {
            this.sendAggressionNotif(e);
        });
        this.on(this.wGame.dofus.connectionManager, 'TextInformationMessage', (e: any) => {
            this.sendHdvSaleNotif(e);
        });
    }

    private async sendHdvSaleNotif(e: any) {
        if (!this.wGame.document.hasFocus() && this.params.sale_message) {
            if (e.msgId == 65) {
                const id = e.parameters[1];

                this.eventEmitter.emit('newNotification');

                if (this.ressourcesKnow[id] == null) {
                    const res = await axios.post('https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=1.49.9', {class: "Items", ids: [id]});
                    this.ressourcesKnow[id] = res.data[id].nameId;
                }

                let saleNotif = new Notification(this.translate.instant('app.notifications.sale-message'), {
                    body: `+ ${e.parameters[0]} Kamas (vente de ${e.parameters[3]} ${this.ressourcesKnow[id]})`
                });

                saleNotif.onclick = () => {
                    electron.getCurrentWindow().focus();
                    this.eventEmitter.emit('focusTab');
                }
            }
        }

    }

    private sendMPNotif(msg: any) {
        if (!this.wGame.document.hasFocus() && this.params.private_message) {
            if (msg.channel == 9) {

                this.eventEmitter.emit('newNotification');

                const mpNotif = new Notification(this.translate.instant('app.notifications.private-message', {character: msg.senderName}), {
                    body: msg.content
                });

                mpNotif.onclick = () => {
                    electron.getCurrentWindow().focus();
                    this.eventEmitter.emit('focusTab');
                };
            }
        }
    }

    private sendFightTurnNotif(actor: any) {
        if (!this.wGame.document.hasFocus()
            && this.wGame.gui.playerData.characterBaseInformations.id == actor.id) {

            if (this.params.fight_turn) {

                this.eventEmitter.emit('newNotification');

                const turnNotif = new Notification(this.translate.instant('app.notifications.fight-turn', {character: this.wGame.gui.playerData.characterBaseInformations.name}));

                turnNotif.onclick = () => {
                    electron.getCurrentWindow().focus();
                    this.eventEmitter.emit('focusTab');
                };
            }

            if (this.params.focus_fight_turn) {
                electron.getCurrentWindow().focus();
                this.eventEmitter.emit('focusTab');
            }
        }
    }

    private sendKolizeumNotif() {
        if (!this.wGame.document.hasFocus()
            && this.params.fight_turn) {

            this.eventEmitter.emit('newNotification');

            const kolizeumNotif = new Notification(this.translate.instant('app.notifications.kolizeum'));

            kolizeumNotif.onclick = () => {
                electron.getCurrentWindow().focus();
                this.eventEmitter.emit('focusTab');
            };
        }
    }

    private sendTaxCollectorNotif(tc: any) {
        if (!this.wGame.document.hasFocus() && this.params.tax_collector) {

            this.eventEmitter.emit('newNotification');

            const guildName = tc.guild.guildName;
            const x = tc.worldX;
            const y = tc.worldY;
            const zoneName = tc.enrichData.subAreaName;
            const tcName = tc.enrichData.firstName + " " + tc.enrichData.lastName;

            const taxCollectorNotif = new Notification(this.translate.instant('app.notifications.tax-collector'), {
                body: zoneName + ' [' + x + ', ' + y + '] : ' + guildName + ', ' + tcName
            });

            taxCollectorNotif.onclick = () => {
                electron.getCurrentWindow().focus();
                this.eventEmitter.emit('focusTab');
            };

        }
    }

    private sendPartyInvitationNotif(e: any) {
        if (!this.wGame.document.hasFocus() && this.params.party_invitation) {

            this.eventEmitter.emit('newNotification');

            const fromName: string = e.fromName;

            const partyInvitationNotif = new Notification(this.translate.instant('app.notifications.party-invitation', {character: e.fromName}));

            partyInvitationNotif.onclick = () => {
                electron.getCurrentWindow().focus();
                this.eventEmitter.emit('focusTab');
            };
        }
    }

    private sendAggressionNotif(e: any) {
        if (!this.wGame.document.hasFocus()
            && this.params.aggression
            && e.defenderId == this.wGame.gui.playerData.characterBaseInformations.id) {

            this.eventEmitter.emit('newNotification');

            const aggressionNotif = new Notification(this.translate.instant('app.notifications.aggression'));

            aggressionNotif.onclick = () => {
                electron.getCurrentWindow().focus();
                this.eventEmitter.emit('focusTab');
            };
        }
    }

    public reset() {
        super.reset();
        this.eventEmitter.removeAllListeners();
    }

}
