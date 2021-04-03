import {Mod} from "../mod";

export class CssOverload extends Mod {
    private styleTag: HTMLDivElement;

    startMod(): void {
        this.styleTag = this.wGame.document.createElement('style');
        this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag);

        this.pageNumberSelection();
        this.menuStyleFix();
    }

    private pageNumberSelection() {
        this.styleTag.innerHTML += `
            .NumberInputBox[readonly=readonly] {
                -webkit-user-select: none;
            }
        `;
    }

    private menuStyleFix() {
        this.styleTag.innerHTML += `
            .topBorder {
                max-width: 0;
            }

            .PingBtn .borderBox .emoteBtn::before {
                border-width: 20px;
                border-image-slice: 40;
            }
        `;
    }

    public reset() {
        super.reset();
        if (this.styleTag.parentElement) {
            this.styleTag.parentElement.removeChild(this.styleTag)
        }
    }
}
