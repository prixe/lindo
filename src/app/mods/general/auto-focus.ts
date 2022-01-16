import {Mod} from "../mod";

export class AutoFocus extends Mod {
    private focusableWindows = {
        "ExchangeStartedBidBuyerMessage": ".BidHouseShopWindow .searchBox",
        "ObjectItem" : ".ItemRecipesWindow .searchBox",
        "friends" : ".SocialWindow .FriendsWindow",
        "bestiary" : ".GrimoireWindow .BestiaryWindow",
        "achievements" : ".GrimoireWindow .AchievementsWindow"
    }

    startMod(): void { 
        this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="itemRecipes").on("open",(e)=>{
            this.focusInput(e.itemData._type)
        })
        this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="bidHouseShop").on("open",(e)=>{
            this.focusInput(e._messageType)
        })

        this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="grimoire").on("open",(e)=>{
            this.focusInput(e.tabId)
        })  
      this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="social").on("open",(e)=>{
           this.focusInput(e.tabId)
        })
            
    }   
    private focusInput(id): void {
        requestAnimationFrame(() => { 
        this.wGame.document.querySelector(this.focusableWindows[id] + ' .InputBox input').focus()      
    })};
 }

