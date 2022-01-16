import {Mod} from "../mod";

export class EstimationPrix extends Mod {
    private mapPrice = null
   
    startMod(): void {
            this.on(this.wGame.dofus.connectionManager, "ObjectAveragePricesMessage", (e) => {
                    this.createMap(e.ids, e.avgPrices);
             });
            
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


     private getInformation() {
         let monitem = this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="itemRecipes")
        if(monitem.recipeBox == undefined || monitem.recipeBox == NaN){
            return ;
        }
        let listeingredient = monitem.recipeBox.rawRecipe.ingredientIds;
        let tableautotalprix = []
        var listequantiter = monitem.recipeBox.rawRecipe.quantities;
        let totalprix = 0
        let totalpods = 0
        let tableaupods = []
        let podsreunit = []
        let finish = []
        
        for(var i = 0; i < listeingredient.length; i++){
            listeingredient[i] = this.getPrice(listeingredient[i])
            tableaupods[i] = monitem.recipeBox.ingredients[i].data.realWeight
         }

        for(var i = 0; i < listeingredient.length; i++){
            let array3 = listeingredient[i] * listequantiter[i]
            let pods3 = tableaupods[i] * listequantiter[i]
            tableautotalprix.push(array3);
            podsreunit.push(pods3);
         }
         for(var i = 0; i < tableautotalprix.length; i++){
             totalprix += tableautotalprix[i] 
             totalpods += podsreunit[i]
            
         }
         finish.push(totalprix);
         finish.push(totalpods);
         return finish;
        
    }

    private afficherprix(prix): void {
        let thePrice = this.getInformation()
        let totalprix = thePrice[0]
        let totalpods = thePrice[1]
        if(totalprix != NaN && totalprix != null && totalprix != undefined && totalprix.toString() != "NaN"){
            let estimationprix = document.createElement("div");
            estimationprix.className = "estimationprix";
            estimationprix.id = "estimationprix";
        estimationprix.innerHTML = "Prix moyen du craft : " + this.formatNumber(totalprix) + ' <div style="background: url(./assets/ui/icons/kama.png) no-repeat;width: 20px;display: inline-block;height: 16px;background-size: 18px;"></div>' + " (" + totalpods + " Pods).";
                requestAnimationFrame(() => {
                    this.wGame.document.getElementsByClassName("RecipeBox")[0].parentNode.insertBefore(estimationprix, null);      
                })
        } 
            else {
            return ;
            }
        
   };

 }
