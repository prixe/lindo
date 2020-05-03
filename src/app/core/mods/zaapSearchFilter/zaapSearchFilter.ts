import { Logger } from "app/core/electron/logger.helper";

import { Mod } from "../mod";


export class ZaapSearchFilter extends Mod {

    private styleTag: HTMLDivElement;
    private zaapSearchContainer: HTMLDivElement;
    private zaapSearchInput : HTMLInputElement;
    private inputPlaceholder: string;
    

    startMod(): void {
        this.params = this.settings.option.vip.general.zaapsearchfilter;
        this.inputPlaceholder = this.translate.instant('app.option.vip.zaapsearchfilter.placeholder');

        if(this.params){
            Logger.info('- enable ZaapSearchFilter');

            this.on(this.wGame.dofus.connectionManager, 'ZaapListMessage', (msg: any) => {
                this.createSearchFilter();
            });
    
            this.on(this.wGame.connectionManager, 'LeaveDialogMessage', (msg: any) => {
                this.resetSearchFilter();
            });
        }
    }


    private createSearchFilter(): void{
        this.injectInputInDom();

        this.zaapSearchInput.addEventListener("change", () => {
            let zaapWanted = this.zaapSearchInput.value;
            let zaapList = this.wGame.document.getElementsByClassName('zaapBodyHeight__custom')[0]
                            .getElementsByClassName('row');

            for(let i = 0; i < zaapList.length; i++){
                let currentZaap = zaapList[i];
                let destination = currentZaap.getElementsByClassName('destinationName')
				
				if(destination.length > 0){

                    currentZaap.style.display = "none";

					if( currentZaap.innerHTML.includes( zaapWanted ) ){
                        currentZaap.style.display = "block";
                    } 
                }
            }
        });
    }


    private injectInputInDom(): void{
        this.styleTag = this.wGame.document.createElement('style');
        this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag);
 
        this.styleTag.innerHTML += `
             .zaapBodyHeight__custom{
                 height: 70% !important;
             }
 
             .zaapSearch__container{
                 padding: 10px;
                 width: 100%;
             }
 
             .zaapSearch__input{
                 width: 96%;
                 margin-right: 10px;
                 background-color: black;
                 border-radius: 5px;
                 color: white;
                 border-color: black;
                 height: 34px;
                 font-size: 1em;
             }
         `;
 
         
         let zaapPanels = this.wGame.document.getElementsByClassName('zaapBody')[0]
                             .getElementsByClassName('panels')[0];
     
         zaapPanels.classList.add('zaapBodyHeight__custom');
         
         this.zaapSearchContainer = this.wGame.document.createElement('div');
         this.zaapSearchInput     = this.wGame.document.createElement('input');
             
         this.zaapSearchInput.setAttribute('placeholder', this.inputPlaceholder);
         this.zaapSearchInput.setAttribute('id', 'zaapName');
         
         this.zaapSearchContainer.classList.add('zaapSearch__container');
         this.zaapSearchInput.classList.add('zaapSearch__input');
 
         this.zaapSearchContainer.append(this.zaapSearchInput);
         this.wGame.document.getElementsByClassName('zaapBody')[0].prepend(this.zaapSearchContainer);
    }


    private resetSearchFilter(): void{
        if(this.styleTag){
            this.styleTag.remove();
            this.zaapSearchInput.remove();
            this.zaapSearchContainer.remove();
        }
    }


    public reset() {
        this.resetSearchFilter()
        super.reset();
    }
}
