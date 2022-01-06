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
            e = this.wGame.gui.windowsContainer._childrenList.find(e=>e.id=="itemRecipes")
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
        let totalpods = 0
        let pods = []
        let pods2 = []
        let finish = []
        
        for(var i = 0; i < array1.length; i++){
            array1[i] = this.getPrice(array1[i])
            pods[i] = monitem.recipeBox.ingredients[i].data.realWeight
         }

        for(var i = 0; i < array1.length; i++){
            let array3 = array1[i] * array2[i]
            let pods3 = pods[i] * array2[i]
            array4.push(array3);
            pods2.push(pods3);
         }
         for(var i = 0; i < array4.length; i++){
             totalprix += array4[i] 
             totalpods += pods2[i]
            
         }
         finish.push(totalprix);
         finish.push(totalpods);
         return finish;
        
    }

    private afficherprix(prix): void {
        let thePrice = this.KeyTurRecette()
        let totalprix = thePrice[0]
        let totalpods = thePrice[1]
        if(totalprix != NaN && totalprix != null && totalprix != undefined && totalprix.toString() != "NaN"){
            let leftdiv = document.createElement("div");
            leftdiv.className = "estimationprix";
            leftdiv.id = "eprix";
            leftdiv.innerText = "Prix moyen du craft : " + this.formatNumber(totalprix) + " Kamas" + " (" + totalpods + " Pods).";
                requestAnimationFrame(() => {
                    this.wGame.document.getElementsByClassName("RecipeBox")[0].parentNode.insertBefore(leftdiv, null);
                })
        } 
            else {
            return ;
            }
        
   };

 }
