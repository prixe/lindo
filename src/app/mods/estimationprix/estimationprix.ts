import {Mod} from "../mod";

export class EstimationPrix extends Mod {
    private mapPrice = null
    private recipes = null
    private itemWindow = null

    
    startMod(): void {
            this.on(this.wGame.dofus.connectionManager, "ObjectAveragePricesMessage", (e) => {
                    this.createMap(e.ids, e.avgPrices);
             });
            this.itemWindow = this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="itemRecipes")
            this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="itemRecipes").on("open",(e)=>{
            e = this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="itemRecipes").on("open",(e)=>{})
            let prix = this.getPrice(e.dbItemId)
            setTimeout(() => {
                this.afficherprix(prix);
            }, 200);                  
        })
    }

    private createMap(array1, array2) {
        const length = array1.length;
        this.mapPrice = new Map();
        for (var k = 0; k < length; k++) {
            this.mapPrice.set(array1[k], array2[k]);
        }
    }

    private getPrice(id) {
        return this.mapPrice.get(id);
    }

    formatNumber(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

     private KeyTurRecette() {
         let monitem = this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="itemRecipes")
        if(monitem.recipeBox == undefined || monitem.recipeBox == NaN){
            return ;
        }
        let array1 = monitem.recipeBox.rawRecipe.ingredientIds;
        let array4 = []
        var array2 = monitem.recipeBox.rawRecipe.quantities;
        let totalprix = 0

        for(var i = 0; i < array1.length; i++){
            array1[i] = this.getPrice(array1[i])
         }

        for(var i = 0; i < array1.length; i++){
            let array3 = array1[i] * array2[i]
            array4.push(array3);
         }
         for(var i = 0; i < array4.length; i++){
             totalprix += array4[i] 
         }
         return totalprix;
        
    }

    private afficherprix(prix): void {
        let thePrice = this.KeyTurRecette()
        if(thePrice != NaN && thePrice != null && thePrice != undefined && thePrice.toString() != "NaN"){
            let leftdiv = document.createElement("div");
            leftdiv.className = "estimationprix";
            leftdiv.id = "eprix";
            leftdiv.innerText = "Prix moyen du craft : " + this.formatNumber(thePrice) + " Kamas";
                requestAnimationFrame(() => {
                    this.wGame.document.getElementsByClassName("RecipeBox")[0].parentNode.insertBefore(leftdiv, null);
                })
        } 
            else {
                return ;
            }      
   };
 }