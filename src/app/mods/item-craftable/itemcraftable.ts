import {Mod} from "../mod";

export class ItemCraftable extends Mod {
    private itemWindow = null
    private styleTag: HTMLStyleElement;
    private statuscheckbox = false

    startMod(): void {
        this.itemWindow = this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="itemRecipes")
            this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="itemRecipes").on("open",(e)=>{
            e = this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="itemRecipes")
            setTimeout(() => {
                this.checkBox();    
            }, 200);           
        })
    }

    private verifRecette(statuscheckbox){
        let aa = this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="itemRecipes")
        let listrecette = aa.recipeList.recipesList._childrenList
        if(listrecette == NaN){
           return ;
        } 
             if(statuscheckbox == false){
                 this.searchFilterOn(listrecette)
            } 
            else {
                 this.searchFilterOff(listrecette)
            } 

    }
        private searchFilterOn(listrecette){
            let list = this.wGame.document.querySelector('.ItemRecipesWindow .rightCol .recipesWrapper .scrollerContent')   
                for(var i = 0; i < listrecette.length; i++){
                    if(listrecette[i].craftableCount == 1){
                    list.getElementsByClassName("RecipeBox")[i].style.display = "block";
                    } 
                    else {
                    list.getElementsByClassName("RecipeBox")[i].style.display = "none";
                    }
            
                }   
   
        }
        private searchFilterOff(listrecette){
            let list = this.wGame.document.querySelector('.ItemRecipesWindow .rightCol .recipesWrapper .scrollerContent')         
                for(var i = 0; i < listrecette.length; i++){
                    list.getElementsByClassName("RecipeBox")[i].style.display = "block";
            }   
        }

       
    
        private checkBox(){   
            let boutondroit = this.wGame.document.querySelector('.ItemRecipesWindow .rightCol .PaginationUI .next.Button')
            let checkboxic = document.createElement("div");
                checkboxic.setAttribute("type", "checkbox");
                checkboxic.className = "checkboxitemcraftable";
                checkboxic.innerText = "Afficher les items craftable";
            this.styleTag = this.wGame.document.createElement("style");
            this.wGame.document.getElementsByTagName("head")[0].appendChild(this.styleTag);
                let onClick = () => {
                    this.statusCheckBox()
                };
            this.styleTag.innerHTML += `
            .checkboxitemcraftable {
                text-align: left;
                padding: 3px 3px 3px 30px;
                background-position: -24px calc(50% - 2px);
                background-size: 18px 18px;
                background-repeat: no-repeat;
                background-origin: content-box;
                background-image: url("./assets/ui/checkbox.png")
            }
            `
                boutondroit.parentNode.insertBefore(checkboxic, null);
                checkboxic.addEventListener('click', onClick);
        }

        private statusCheckBox(){
            if(this.statuscheckbox == false){
                this.verifRecette(this.statuscheckbox);
                this.statuscheckbox = true
                this.styleTag.innerHTML = `
                .checkboxitemcraftable {
                text-align: left;
                padding: 3px 3px 3px 30px;
                background-position: -24px calc(50% - 2px);
                background-size: 18px 18px;
                background-repeat: no-repeat;
                background-origin: content-box;
                background-image: url("./assets/ui/checkbox_checked.png");
                    ` 
            }
            else {
                this.verifRecette(this.statuscheckbox);
                this.statuscheckbox = false
                this.styleTag.innerHTML = `
                .checkboxitemcraftable {
                    text-align: left;
                    padding: 3px 3px 3px 30px;
                    background-position: -24px calc(50% - 2px);
                    background-size: 18px 18px;
                    background-repeat: no-repeat;
                    background-origin: content-box;
                    background-image: url("./assets/ui/checkbox.png")
                    ` 
            }
        } 
 }
