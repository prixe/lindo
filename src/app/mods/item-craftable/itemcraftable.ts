import {Mod} from "../mod";

export class ItemCraftable extends Mod {
    private styleTag: HTMLStyleElement;
    private statuscheckbox = false
    private checkBoxDiv;

    startMod(): void {
            this.styleTag = window.document.createElement('style');
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
             
              .checkboxitemcraftable.on {
                background-image: url("./assets/ui/checkbox_checked.png")
             }
            `
            this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="itemRecipes").on("open",(e)=>{
            e = this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="itemRecipes")
            setTimeout(() => {
                this.checkBox();    
            }, 200);           
        })
    }

    private verifRecette(statuscheckbox){
        let listallrecette = this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="itemRecipes")
        let listrecette = listallrecette.recipeList.recipesList.getChildren()
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
            let checkBoxDiv = document.createElement("div");
            checkBoxDiv.setAttribute("type", "checkbox");
            checkBoxDiv.className = "checkboxitemcraftable";
            checkBoxDiv.innerText = "Afficher les items craftable";

            this.wGame.document.head.appendChild(this.styleTag);
                let onClick = () => {
               
               

                if(this.statuscheckbox == false){
                    this.verifRecette(this.statuscheckbox);
                    this.statuscheckbox = true
                    checkBoxDiv.classList.add('on')
                   
                }
                else {
                    this.verifRecette(this.statuscheckbox);
                    this.statuscheckbox = false
                    checkBoxDiv.classList.remove('on')
                }
            };
            
                boutondroit.parentNode.insertBefore(checkBoxDiv, null);
                checkBoxDiv.addEventListener('click', onClick);
        }


        reset(){
            this.styleTag?.remove?.();
        }
 }
