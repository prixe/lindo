import {Mod} from "../mod";

export class AutoFocus extends Mod {

    startMod(): void { 
        this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="itemRecipes").on("open",(e)=>{
            setTimeout(() => {
                this.focusRecette();
            }, 200); 
        })
        this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="bidHouseShop").on("open",(e)=>{
            this.focusHdv();
        })
        this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="social").on("open",(e)=>{
        this.focusFriend();
    })
        this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="grimoire").on("open",(e)=>{
                if (e.tabId === 'bestiary') {
                    this.focusBestiary();
                   } else if (e.tabId === 'achievements') {
                    this.focusArchievements();
                   }      
        })
    }   
    private focusRecette(): void {
        this.wGame.document.querySelector('.ItemRecipesWindow .searchBox .InputBox input').focus()      
    };
    private focusHdv(): void {
        requestAnimationFrame(() => { 
        this.wGame.document.querySelector('.BidHouseShopWindow .searchBox .InputBox input').focus()      
    })};
    private focusFriend(): void { 
        requestAnimationFrame(() => { 
        this.wGame.document.querySelector('.SocialWindow .FriendsWindow .InputBox input').focus()      
    })};
    private focusBestiary(): void {
        requestAnimationFrame(() => {
            this.wGame.document.querySelector('.GrimoireWindow .BestiaryWindow .InputBox input').focus()   
    })};
    private focusArchievements(): void {
        requestAnimationFrame(() => {
            this.wGame.document.querySelector('.GrimoireWindow .AchievementsWindow .InputBox input').focus()   
    })};

 }
