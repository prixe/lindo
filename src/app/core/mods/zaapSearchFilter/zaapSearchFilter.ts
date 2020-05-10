import { Logger } from "app/core/electron/logger.helper";

import { Mod } from "../mod";


export class ZaapSearchFilter extends Mod {

    private styleTag: HTMLStyleElement;
    private zaapSearchContainer: HTMLDivElement;
    private zaapSearchInput : HTMLInputElement;
    private inputPlaceholder: string;
    

    startMod(): void {
        this.params = this.settings.option.vip.general.zaapsearchfilter;
        this.inputPlaceholder = this.translate.instant('app.option.vip.zaapsearchfilter.placeholder');

        if(this.params){
            Logger.info('- enable ZaapSearchFilter');

            this.on(this.wGame.dofus.connectionManager, 'ZaapListMessage', () => {
                this.createSearchFilter();
            });
    
            this.on(this.wGame.dofus.connectionManager, 'LeaveDialogMessage', () => {
                this.resetSearchFilter();
            });
        }
    }


    private createSearchFilter(): void{
        this.injectInputInDom();
        this.zaapSearchInput.focus();

        this.zaapSearchInput.addEventListener("input", () => {
            let zaapWanted = this.zaapSearchInput.value.toLowerCase();
            let zaapList = this.wGame.document.getElementsByClassName('lindo_zaapBodyHeight__custom')[0]
                            .getElementsByClassName('row');

            for(const currentZaap of zaapList){
                let destination = currentZaap.getElementsByClassName('destinationName')
                
                /*
                    This case appear where the current value is not a zaap ( ex: Destination, cord, cout )
                */
                if (!destination.length) continue;

                currentZaap.style.display = "none";

                if( currentZaap.innerText.toLowerCase().includes( zaapWanted ) ){
                    currentZaap.style.display = "block";
                }
                
            }
        });
    }


    private injectInputInDom(): void{
        this.styleTag = this.wGame.document.createElement('style');
        this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag);
 
        this.styleTag.innerHTML += `
            .lindo_zaapBodyHeight__custom{
                height: 76% !important;
            }
 
            .lindo_zaapSearch__container{
                padding: 0 10px 10px 10px;
                width: 100%;
                box-sizing: border-box;
            }

            .lindo_zaapSearch__input{
                width: 100%;
                box-sizing: border-box;
                background-color: black;
                border-radius: 5px;
                color: white;
                border-color: black;
                padding: 6px;
            }

            .lindo_zaapSearch__input::placeholder{
                color: #555;
            }
         `;
 
         
        let zaapPanels = this.wGame.document.getElementsByClassName('zaapBody')[0]
                            .getElementsByClassName('panels')[0];
     
        zaapPanels.classList.add('lindo_zaapBodyHeight__custom');
        
        this.zaapSearchContainer = this.wGame.document.createElement('div');
        this.zaapSearchInput     = this.wGame.document.createElement('input');
            
        this.zaapSearchInput.setAttribute('placeholder', this.inputPlaceholder);
        this.zaapSearchInput.setAttribute('id', 'zaapName');
        
        this.zaapSearchContainer.classList.add('lindo_zaapSearch__container');
        this.zaapSearchInput.classList.add('lindo_zaapSearch__input');
 
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
