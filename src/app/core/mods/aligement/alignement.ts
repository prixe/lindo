import {Mods} from "../mods";
import { Logger } from "app/core/electron/logger.helper";
import { alignementUIContainer } from "./alignementUIContainer";

/**
 * This mod add the possibility to show alignement
 */
export class Alignement extends Mods{

    private AlignementBarContainer : HTMLDivElement;
    private AlignementBar : HTMLDivElement;
    private shieldBar : HTMLDivElement;
    private lifePointsText : HTMLDivElement;
    private container : alignementUIContainer;

    constructor (wGame: any | Window) {
        super(wGame);

       //Side definition :
       // 0 => neutre
       // 1 => Bonta
       // 2 => Brakmar
       // 
       //Grade :
       //0 = aussi les ailes cachés.
       // de 0 à 10
        //Value Currently unknown





        let healthbarCss = document.createElement('style');
        healthbarCss.id = 'AlignementBarCss';
        healthbarCss.innerHTML = `
        .AlignementBarsContainer {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
            visibility: hidden;
        }

        .AlignementBarContainer {
            box-sizing: border-box;
            border: 1px gray solid;
            background-color: #222;
            height: 6px;
            width: 30px;
            position: absolute;
            border-radius: 3px;
            overflow: hidden;
            transition-duration: 500ms;
            margin-top: 10px;
        }

        .AlignementBar {
            transition-duration: 300ms;
            height: 100%;
            width: 0%;
            background-color: #333;
        }
        `;
        this.wGame.document.getElementsByTagName('head')[0].appendChild(healthbarCss);
       
    }
    public scan(){
        if(this.container!=null)
            this.container.destroy();
        this.container = new alignementUIContainer(this.wGame);
        this.container.show();
        setTimeout(() => {
        this.container.destroy();
        }, 20000);
    }
    public reset() {
        super.reset();
            if (this.container) this.container.destroy();
            let healthbarCss = this.wGame.document.getElementById('AlignementBarCss');
            if (healthbarCss && healthbarCss.parentElement) healthbarCss.parentElement.removeChild(healthbarCss);
    }

}
