import { Logger } from "app/core/electron/logger.helper";

import { Mod } from "../mod";


export class ZaapSearchFilter extends Mod {
    private styleTag: HTMLStyleElement;
    private zaapSearchContainer: HTMLDivElement;
    private zaapSearchInput : HTMLInputElement;
    private inputPlaceholder: string;
    private placeholderZaapi: string;

    startMod(): void {
        this.params = this.settings.option.vip.general.zaapsearchfilter;
        this.inputPlaceholder = this.translate.instant("app.option.vip.zaapsearchfilter.placeholder");
        this.placeholderZaapi = this.translate.instant("app.option.vip.zaapsearchfilter.placeholderZaapi");

        if (this.params) {
            Logger.info("- enable ZaapSearchFilter");

            this.on(this.wGame.dofus.connectionManager, "ZaapListMessage", () => {
                this.createSearchFilter();
            });

            this.on(this.wGame.dofus.connectionManager, "TeleportDestinationsListMessage", () => {
                this.createSearchFilterZaapi();
            });

            this.on(this.wGame.connectionManager, "LeaveDialogMessage", () => {
                this.resetSearchFilter();
            });
        }
    }


    private createSearchFilter(): void {
        this.injectInputInDom();

        this.zaapSearchInput.addEventListener("keyup", () => {
            let zaapWanted = this.zaapSearchInput.value.toLowerCase();

            let zaapList = this.wGame.document.getElementsByClassName("lindo_zaapBodyHeight__custom")[0].getElementsByClassName("row");

            for (const currentZaap of zaapList) {
                let destination = currentZaap.getElementsByClassName("destinationName");

                if (!destination.length) {
                    continue;
                }

                currentZaap.style.display = "none";

                if (currentZaap.innerText.toLowerCase().includes(zaapWanted)) {
                    currentZaap.style.display = "block";
                }
            }
        });
    }

    private injectInputInDom(): void {
        this.styleTag = this.wGame.document.createElement("style");
        this.wGame.document.getElementsByTagName("head")[0].appendChild(this.styleTag);

        this.styleTag.innerHTML += `
        .lindo_zaapBodyHeight__custom{
            height: 70% !important;
        }

        .lindo_zaapSearch__container{
            padding: 10px;
            width: 100%;
        }

        .lindo_zaapSearch__input{
            text-align: center;
            width: 96%;
            margin-right: 10px;
            background-color: #424242;
            border-radius: 5px;
            color: white;
            border-color: #262626;
            height: 34px;
            font-size: 1em;
        }
        `;

        let zaapPanels = this.wGame.document.getElementsByClassName("zaapBody")[0]
        .getElementsByClassName("panels")[0];

        zaapPanels.classList.add("lindo_zaapBodyHeight__custom");

        this.zaapSearchContainer = this.wGame.document.createElement("div");
        this.zaapSearchInput     = this.wGame.document.createElement("input");

        this.zaapSearchInput.setAttribute("placeholder", this.inputPlaceholder);
        this.zaapSearchInput.setAttribute("autofocus", "true");
        this.zaapSearchInput.setAttribute("id", "zaapName");

        this.zaapSearchContainer.classList.add("lindo_zaapSearch__container");
        this.zaapSearchInput.classList.add("lindo_zaapSearch__input");

        this.zaapSearchContainer.append(this.zaapSearchInput);
        this.wGame.document.getElementsByClassName("zaapBody")[0].prepend(this.zaapSearchContainer);
    }

    private createSearchFilterZaapi(): void {
        this.injectInputInDomZaapi();

        this.zaapSearchInput.addEventListener("keyup", () => {
            let zaapWanted = this.zaapSearchInput.value.toLowerCase();

            let zaapList = this.wGame.document.getElementsByClassName("lindo_subwayBodyHeight__custom")[0]
            .getElementsByClassName("row");

            for (const currentZaap of zaapList) {
                let destination = currentZaap.getElementsByClassName("destinationName");

                if (!destination.length) {
                    continue;
                }

                currentZaap.style.display = "none";
                if (currentZaap.innerText.toLowerCase().includes(zaapWanted)) {
                    currentZaap.style.display = "block";
                }
            }
        });
    }

    private injectInputInDomZaapi(): void {
        this.styleTag = this.wGame.document.createElement("style");
        this.wGame.document.getElementsByTagName("head")[0].appendChild(this.styleTag);

        this.styleTag.innerHTML += `
        .lindo_subwayBodyHeight__custom{
            height: 70% !important;
        }

        .lindo_zaapSearch__container{
            padding: 10px;
            width: 100%;
        }

        .lindo_zaapSearch__input{
            text-align: center;
            width: 96%;
            margin-right: 10px;
            background-color: #424242;
            border-radius: 5px;
            color: white;
            border-color: #262626;
            height: 34px;
            font-size: 1em;
        }
        `;

        let zaapPanels = this.wGame.document.getElementsByClassName("subwayBody")[0]
        .getElementsByClassName("panels")[0];

        zaapPanels.classList.add("lindo_subwayBodyHeight__custom");

        this.zaapSearchContainer = this.wGame.document.createElement("div");
        this.zaapSearchInput     = this.wGame.document.createElement("input");

        this.zaapSearchInput.setAttribute("placeholder", this.placeholderZaapi);
        this.zaapSearchInput.setAttribute("autofocus", "true");
        this.zaapSearchInput.setAttribute("id", "zaapName");

        this.zaapSearchContainer.classList.add("lindo_zaapSearch__container");
        this.zaapSearchInput.classList.add("lindo_zaapSearch__input");

        this.zaapSearchContainer.append(this.zaapSearchInput);
        this.wGame.document.getElementsByClassName("subwayBody")[0].prepend(this.zaapSearchContainer);
    }

    private resetSearchFilter(): void {
        if (this.styleTag) {
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
