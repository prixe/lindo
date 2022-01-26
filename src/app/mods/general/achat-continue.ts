import {Mod} from "../mod";

export class AchatContinue extends Mod {

   
    startMod(): void {
     let boutonconfirmation =   this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="tradeItemConfirm").on("open",()=>{
            requestAnimationFrame(() => { 
                this.wGame.gui.windowsContainer.getChildren().find(e => e.id == "tradeItemConfirm").hide()
                boutonconfirmation.buyBtn.tap()
            })
            
        })
    }

 }
