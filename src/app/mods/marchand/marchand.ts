import { Mod } from "../mod";

export class Marchand extends Mod {
    private tab = []
    private numMM = null

    startMod(): void {
        console.log("- enable MarchandArrow");
        this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', (response) => {this.getMM(response)} );
        this.on(this.wGame.dofus.connectionManager, 'ExchangeStartOkHumanVendorMessage', (response) => {this.openMM(response)} );
        this.on(this.wGame.dofus.connectionManager, 'ExchangeLeaveMessage', () => {this.closeW()} );
        this.on(this.wGame.dofus.connectionManager, 'ExchangeLeaveMessage', this.closeW());
        this.wGame.document.addEventListener('click', (event) => {this.clickB(event)} );
        this.on(this.wGame.dofus.connectionManager, 'GameRolePlayShowActorMessage', (response) => {this.showActor(response)} );
    }

    private showActor(response) {
        if (response.informations._type == "GameRolePlayMerchantInformations") {
            this.tab = [];
            this.numMM = [];
            for (let i in this.wGame.dofus.actorManager.actors) {
                if (this.wGame.dofus.actorManager.actors[i].isMerchant()) {
                    this.tab.push({id: i, position: this.wGame.dofus.actorManager.actors[i].cellId});
                }
            }
        }
    }

    private clickB(event): void {
        if (event.target.parentNode.id == "rightMM") {

            this.clickRight();
            this.reset()
        }
        else if (event.target.parentNode.id == "leftMM") {
            this.clickLeft();
            this.reset()
        }
    }

    private getMM(response) {
        this.tab = [];
        for (let i in response.actors) {
            if(response.actors[i]._type == "GameRolePlayMerchantInformations") {
                this.tab.push({id: response.actors[i].contextualId, position: response.actors[i].disposition.cellId});
            }
        }
    }

    private addBtn() {
        let leftdiv = document.createElement("div");
        leftdiv.className = "filter Button scaleOnPress";
        leftdiv.id = "leftMM";
        let lefticon = document.createElement("div");
        lefticon.className = "icon";
        lefticon.style.backgroundImage="url(../game/assets/ui/borderArrow/left.png)";
        lefticon.style.backgroundSize="80%";
        lefticon.style.backgroundPosition="50% 35%";
        leftdiv.appendChild(lefticon);
        this.wGame.document.getElementsByClassName("window TradeStorageWindow buy-human")[0].getElementsByClassName("filter")[0].parentNode.insertBefore(leftdiv,this.wGame.document.getElementsByClassName("window TradeStorageWindow buy-human")[0].getElementsByClassName("filter")[0]);

        let rightdiv = document.createElement("div");
        rightdiv.className = "filter Button scaleOnPress";
        rightdiv.id = "rightMM";
        let righticon = document.createElement("div");
        righticon.className = "icon";
        righticon.style.backgroundImage="url(../game/assets/ui/borderArrow/right.png)";
        righticon.style.backgroundSize="80%";
        righticon.style.backgroundPosition="50% 35%";
        rightdiv.appendChild(righticon);
        this.wGame.document.getElementsByClassName("window TradeStorageWindow buy-human")[0].getElementsByClassName("filter")[0].parentNode.insertBefore(rightdiv, null);
    }

    private openMM(response) {
        this.reset()
        this.addBtn();
        this.numMM = this.tab.findIndex(i => i.id == response.sellerId);
    }

    private clickLeft() {
        if (this.wGame.document.getElementById("leftMM")) {
            this.closeMM();
            if (this.numMM == this.tab.length-1) {
                this.numMM = -1;
            }
            this.wGame.dofus.sendMessage("ExchangeOnHumanVendorRequestMessage", {
                humanVendorId: this.tab[this.numMM+1].id,
                humanVendorCell: this.tab[this.numMM+1].position
            });
        }
    }

    private clickRight() {
        if (this.wGame.document.getElementById("rightMM")) {
            this.closeMM();
            if (this.numMM == 0) {
                this.numMM = this.tab.length;
            }
            this.wGame.dofus.sendMessage("ExchangeOnHumanVendorRequestMessage", {
                humanVendorId: this.tab[this.numMM-1].id,
                humanVendorCell: this.tab[this.numMM-1].position
            });
        }
    }

    private closeMM() {
        this.wGame.dofus.sendMessage("LeaveDialogRequestMessage", null);
    }

    private closeW() {
        this.wGame.document.querySelectorAll("#leftMM").forEach((elem) => elem.remove());
        this.wGame.document.querySelectorAll("#rightMM").forEach((elem) => elem.remove());
        console.log("KEYTUR 2")
    }

    public reset() {
        this.wGame.dofus.connectionManager.removeListener('MapComplementaryInformationsDataMessage', this.getMM);
        this.wGame.dofus.connectionManager.removeListener("ExchangeStartOkHumanVendorMessage", this.openMM);
        this.wGame.dofus.connectionManager.removeListener("ExchangeLeaveMessage", this.closeW());
        this.wGame.removeEventListener('click', this.clickB);
        this.closeW();
        this.wGame.dofus.connectionManager.removeListener("GameRolePlayShowActorMessage", this.showActor);
        this.wGame.removeEventListener('keyup', this.clickB);
    }
}
