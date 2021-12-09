import { TranslateService } from "@ngx-translate/core";
import { SettingsService } from "@services/settings.service";
import { Mod } from "../mod";

export class RuneOpenerList extends Mod {
    ID = 'RuneOpenerList';
    langs = {
        en: { message: "Obtained (Number) (RuneName)" },
        de: { message: "Wurden erreicht (Number) (RuneName) " },
        es: { message: "Se han conseguido (Number) (RuneName) " },
        fr: { message: "Obtention de (Number) (RuneName)" },
        it: { message: "Hai ottenuto (Number) (RuneName) " },
        pt: { message: "Obteve (Number) (RuneName) " }
    };
    fragmentGid = 8378
    openedRune = false;
    oldItems = []
    messageItems = []
    lang: { message: string };
    constructor(
        wGame: any | Window,
        settings: SettingsService,
        translate: TranslateService,
        language: string

    ) {
        super(wGame, settings, translate);
        this.lang = this.langs[language]
        this.load();
    }

    load() {
        this.on(this.wGame.dofus.connectionManager, 'send', this.onSendMessage);
        this.on(this.wGame.dofus.connectionManager, 'data', this.onReceiveMessage);
    }

    unload() {
        this.removeListener(this.wGame.dofus.connectionManager, 'send', this.onSendMessage)
        this.removeListener(this.wGame.dofus.connectionManager, 'data', this.onReceiveMessage)
    }
    onSendMessage = (msg) => {
        if (!msg.data.data) return;
        if (msg.data.data.type !== 'ObjectUseMessage') return;
        var uid = msg.data.data.data.objectUID;
        this.checkMagicFragment(uid)
    }

    onReceiveMessage = (msg) => {
        if (this.openedRune) {
            if (msg._messageType === 'ObjectQuantityMessage')
                this.addObjectQuantity(msg.objectUID, msg.quantity);
            else if (msg._messageType === 'InventoryWeightMessage') this.showAllMessages();
            else if (msg._messageType === 'ObjectUseMessage') this.checkMagicFragment(msg.objectUID);
        }
    }
    getGidFromUid(uid) {
        return this.wGame.gui.playerData.inventory.objects[uid].objectGID;
    }
    getQuantityFromUid(uid) {
        return this.wGame.gui.playerData.inventory.objects[uid].quantity;
    }
    itsARune(uid) {
        return this.wGame.gui.playerData.inventory.objects[uid].item.type.id === 78;
    }
    addObjectQuantity(uid, quantity) {
        if (!this.itsARune(uid)) return;
        const mi = { name: this.getGidFromUid(uid), quantity: quantity - this.getQuantityFromUid(uid) };
        this.messageItems.push(mi);
    }
    showAllMessages() {
        // Display all the runes
        this.openedRune = false;
        var msgs = []
        this.messageItems.forEach(mi => {
            const msg = this.lang.message.replace("(Number)", mi.quantity).replace("(RuneName)", `$item${mi.name}`);
            msgs.push(msg);
        });
        this.wGame.gui.chat.logMsg(msgs.join("\n"))
        this.messageItems = []
    }
    checkMagicFragment(uid) {
        var item = this.wGame.gui.playerData.inventory.objects[uid];
        if (!item) return;
        if (item.objectGID === this.fragmentGid)
            this.openedRune = true;
    }
}
