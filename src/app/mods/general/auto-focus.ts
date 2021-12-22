import {Mod} from "../mod";

export class AutoFocus extends Mod {

    startMod(): void {
        this.on(this.wGame.dofus.connectionManager, "ExchangeStartedBidBuyerMessage", () => {
                this.focushdv();
        });
        this.on(this.wGame.dofus.connectionManager, "FriendsListMessage", () => {
                this.focusfriend();
        });
        this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="grimoire").on("open",(e)=>{
                if (e.tabId === 'bestiary') {
                    this.focusbestiary();
                   }   
        })
        this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="grimoire").on("open",(e)=>{
            if (e.tabId === 'achievements') {
                this.focusarchievements();
               }      
    })
    }
    private focushdv(): void {
        this.wGame.document.querySelector('.BidHouseShopWindow .searchBox .InputBox input').focus()      
    };
    private focusfriend(): void {
        this.wGame.document.querySelector('.SocialWindow .FriendsWindow .InputBox input').focus()      
    };
    private focusbestiary(): void {
        requestAnimationFrame(() => {
            this.wGame.document.querySelector('.GrimoireWindow .BestiaryWindow .InputBox input').focus()   
    })};
    private focusarchievements(): void {
        requestAnimationFrame(() => {
            this.wGame.document.querySelector('.GrimoireWindow .AchievementsWindow .InputBox input').focus()   
    })};

 }
