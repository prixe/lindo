import { Mod } from "../mod";
import { SettingsService } from "app/core/service/settings.service";
import { TranslateService } from "@ngx-translate/core";

export class CssOverload extends Mod {
    private styleTag: HTMLDivElement;

    constructor(
        wGame: any|Window,
        settings: SettingsService,
        translate: TranslateService
    ) {
        super(wGame);
        this.settings = settings;
        this.translate = translate;

        this.run();
    }

    private run(): void {
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
