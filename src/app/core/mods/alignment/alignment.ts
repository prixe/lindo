import { Mods } from "../mods";
import { Logger } from "app/core/electron/logger.helper";
import { alignmentUIContainer } from "./alignmentUIContainer";

/**
 * This mod add the possibility to show alignment
 */
export class Alignment extends Mods {
    private lastScan;
    private container : alignmentUIContainer;

    constructor (wGame: any | Window) {
        super(wGame);
        this.lastScan = 0;

        /* Add <style>*/
        let alignmentbarCss = document.createElement('style');
        alignmentbarCss.id = 'alignmentBarCss';
        alignmentbarCss.innerHTML = `
        .alignmentBarsContainer {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
            visibility: hidden;
        }

        .alignmentBarContainer {
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

        .alignmentBar {
            transition-duration: 300ms;
            height: 100%;
            width: 0%;
            background-color: #333;
        }
        `;
        this.wGame.document.getElementsByTagName('head')[0].appendChild(alignmentbarCss);
    }

    public scan() {
        // When you active the mod
        let currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > this.lastScan + 1) {
            // Is last scan was more than 1 second
            this.lastScan = currentTime;
            if (this.container != null) {
                this.container.destroy();
            }
            this.container = new alignmentUIContainer(this.wGame);
            this.container.show(); // Scan
        }
    }

    public destroy() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }

    public reset() {
        super.reset();
        if (this.container) {
            this.container.destroy();
        }
        let alignmentbarCss = this.wGame.document.getElementById('alignmentBarCss');
        if (alignmentbarCss && alignmentbarCss.parentElement) {
            alignmentbarCss.parentElement.removeChild(alignmentbarCss);
        }
    }

}
