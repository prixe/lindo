import {Mod} from "../mod";

export class EstimationPrix extends Mod {
    private mapPrice = null
    private recipes = null
    private itemWindow = null
    private styleTag: HTMLStyleElement;
    
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

            let kamaslogo = document.createElement("div");
            kamaslogo.className = "kamaslogo";
            kamaslogo.id = "kamaslogo";

            let textpods = document.createElement("div");
            textpods.className = "pods";
            textpods.id = "pods";

            
            this.styleTag = this.wGame.document.createElement("style");
            this.wGame.document.getElementsByTagName("head")[0].appendChild(this.styleTag);
            this.styleTag.innerHTML += `
            .kamaslogo { 
                -webkit-flex: 1;
                flex: 1;
                min-height: 1px;
                background: url(./assets/ui/icons/kama.png)  no-repeat;
                background-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;     
        }
        `
        estimationprix.innerText = "Prix moyen du craft : " + this.formatNumber(totalprix);
            textpods.innerText = " (" + totalpods + " Pods).";
                requestAnimationFrame(() => {
                    this.wGame.document.getElementsByClassName("RecipeBox")[0].parentNode.insertBefore(estimationprix, null);
                    this.wGame.document.getElementsByClassName("estimationprix")[0].parentNode.insertBefore(kamaslogo, null);
                    this.wGame.document.getElementsByClassName("kamaslogo")[0].parentNode.insertBefore(textpods, null);


                    
                })
        } 
            else {
            return ;
            }
        
   };

 }
