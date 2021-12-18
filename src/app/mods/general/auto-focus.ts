import {Mod} from "../mod";

export class AutoFocus extends Mod {

    startMod(): void {
        this.on(this.wGame.dofus.connectionManager, "ExchangeStartedBidBuyerMessage", () => {
         this.focushdv();
        });
    }


    private focushdv(): void {
        this.wGame.document.querySelector('.BidHouseShopWindow .searchBox .InputBox input').focus()      
    }
}
