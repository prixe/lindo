import { Mods } from "../mods";
import { Logger } from "app/core/electron/logger.helper";
import { alignementUIContainer } from "./alignementUIContainer";

/**
 * This mod add the possibility to show alignement
 */
export class Alignement extends Mods {

    private container : alignementUIContainer;

    constructor (wGame: any | Window) {
        super(wGame);
        /* Add <style>*/
        let alignementbarCss = document.createElement('style');
        alignementbarCss.id = 'AlignementBarCss';
        alignementbarCss.innerHTML = `
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
        this.wGame.document.getElementsByTagName('head')[0].appendChild(alignementbarCss);
    }

    public scan() {
        // When you active the mod
        if (this.container != null) {
            this.container.destroy();
        }
        this.container = new alignementUIContainer(this.wGame);
        this.container.show(); // Scan
    }

    public destroy() {
        this.container.destroy();
        this.container = null;
    }

    public reset() {
        super.reset();
        if (this.container) {
            this.container.destroy();
        }
        let alignementbarCss = this.wGame.document.getElementById('AlignementBarCss');
        if (alignementbarCss && alignementbarCss.parentElement) {
            alignementbarCss.parentElement.removeChild(alignementbarCss);
        }
    }

}
