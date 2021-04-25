import {Mod} from "../mod";

export class ZaapSearchFilter extends Mod {
    private styleTag: HTMLStyleElement;
    private zaapSearchContainer: HTMLDivElement;
    private zaapSearchInput: HTMLInputElement;
    private inputPlaceholder: string;
    private placeholderZaapi: string;
    private placeholderPrisme: string;


    startMod(): void {
        this.params = this.settings.option.vip.general.zaapsearchfilter;
        this.inputPlaceholder = this.translate.instant("app.option.vip.zaapsearchfilter.placeholder");
        this.placeholderZaapi = this.translate.instant("app.option.vip.zaapsearchfilter.placeholderZaapi");
        this.placeholderPrisme = this.translate.instant("app.option.vip.zaapsearchfilter.placeholderPrisme");

        if (this.params) {
            Logger.info("- enable ZaapSearchFilter");

            this.on(this.wGame.dofus.connectionManager, "ZaapListMessage", () => {
                this.createSearchFilter();
            });

            this.on(this.wGame.dofus.connectionManager, "TeleportDestinationsListMessage", (arg) => {
                if (arg.teleporterType === 1) {
                    this.createSearchFilterZaapi();
                }
            });

            this.on(this.wGame.dofus.connectionManager, "TeleportDestinationsListMessage", (arg) => {
                if (arg.teleporterType === 2) { // Merci TonTonJS
                    this.createSearchFilterPrisme();
                }
            });

            this.on(this.wGame.connectionManager, "LeaveDialogMessage", () => {
                this.resetSearchFilter();
            });
            const favori = localStorage.getItem('zaapFav')
            if (favori == null || favori == '') {
                localStorage.setItem('zaapFav', '')
            }
        }
    }

    // Zaap
    private createSearchFilter(): void {
        this.injectInputInDom();
        this.addFavInDom();

        this.zaapSearchInput.addEventListener("keyup", () => {
            const zaapWanted = this.zaapSearchInput.value.toLowerCase();

            const zaapList = this.wGame.document.getElementsByClassName("lindo_zaapBodyHeight__custom")[0].getElementsByClassName("row");

            for (const currentZaap of zaapList) {
                const destination = currentZaap.getElementsByClassName("destinationName");

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

        const zaapPanels = this.wGame.document.getElementsByClassName("zaapBody")[0]
            .getElementsByClassName("panels")[0];

        zaapPanels.classList.add("lindo_zaapBodyHeight__custom");

        this.zaapSearchContainer = this.wGame.document.createElement("div");
        this.zaapSearchInput = this.wGame.document.createElement("input");

        this.zaapSearchInput.setAttribute("placeholder", this.inputPlaceholder);
        this.zaapSearchInput.setAttribute("id", "zaapName");

        this.zaapSearchContainer.classList.add("lindo_zaapSearch__container");
        this.zaapSearchInput.classList.add("lindo_zaapSearch__input");

        this.zaapSearchContainer.append(this.zaapSearchInput);
        this.wGame.document.getElementsByClassName("zaapBody")[0].prepend(this.zaapSearchContainer);
         requestAnimationFrame(() => {
            this.zaapSearchInput.focus()
            this.zaapSearchInput.select()
        });
        
    }

    private addFavInDom() {
        let zaapList = this.wGame.document.getElementsByClassName("lindo_zaapBodyHeight__custom")[0].getElementsByClassName("row");

        // Ajout de l'étoile fovori (rempli ou non)
        for (let index = 1; index < zaapList.length - 1; index++) {
            const currentZaap = zaapList[index];

            const divVide = currentZaap.getElementsByClassName("col")[0]
            if (divVide.innerHTML == '') {
                const idzaap = currentZaap.getElementsByClassName("col")[1].getElementsByClassName("destinationName")[0]
                if (idzaap != undefined) {
                    const actionButton = (divButton, zaap) => {
                        const favori = localStorage.getItem('zaapFav')
                        const favoriArray = favori.split(',')
                        let unfav = 0
                        for (let index = 0; index < favoriArray.length; index++) {
                            if (favoriArray[index] == zaap) {
                                unfav = index
                            }
                        }
                        if (unfav != 0) {
                            favoriArray.splice(unfav, 1)
                            divButton.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                    <path fill="none" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                </svg>
                                `
                        } else {
                            /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="yellow" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                            divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/starYellow.png">
                            `
                            favoriArray.push(zaap)
                        }
                        localStorage.setItem('zaapFav', favoriArray.toString())
                    }

                    const divButton = document.createElement('div')
                    divButton.onclick = () => {
                        actionButton(divButton, idzaap.innerHTML)
                    }

                    const favorii = localStorage.getItem('zaapFav')
                    const favoriArrayy = favorii.split(',')
                    let trouver = false
                    for (let index = 0; index < favoriArrayy.length; index++) {
                        if (favoriArrayy[index] == idzaap.innerHTML) {
                            trouver = true
                        }
                    }

                    if (trouver) {
                        /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="yellow" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                        divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/starYellow.png">
                        `
                    } else {
                        /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="none" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                        divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/starOff.png">
                        `
                    }

                    divVide.appendChild(divButton)
                }
            }
        }

        //on met les favori "en haut"
        zaapList = this.wGame.document.getElementsByClassName("lindo_zaapBodyHeight__custom")[0].getElementsByClassName("row");
        let saveIndex = 1
        for (let index = 1; index < zaapList.length - 1; index++) {
            const currentZaap = zaapList[index];
            const idzaap = currentZaap.getElementsByClassName("col")[1].getElementsByClassName("destinationName")[0];
            const favorii = localStorage.getItem('zaapFav');
            const favoriArrayy = favorii.split(',');
            let trouver = false
            for (let index = 0; index < favoriArrayy.length; index++) {
                if (idzaap != undefined)
                    if (favoriArrayy[index] == idzaap.innerHTML) {
                        trouver = true
                    }
            }
            if (trouver) {
                currentZaap.parentNode.prepend(currentZaap);
                saveIndex++
                index = saveIndex
            }
        }
    }

    // Prisme
    private createSearchFilterPrisme(): void {
        this.injectInputInDomPrisme();
        this.addFavInDomPrism(); // Fav Prisme

        this.zaapSearchInput.addEventListener("keyup", () => {
            const zaapWanted = this.zaapSearchInput.value.toLowerCase();

            const zaapList = this.wGame.document.getElementsByClassName("lindo_prismeBodyHeight__custom")[0]
                .getElementsByClassName("row");

            for (const currentZaap of zaapList) {
                const destination = currentZaap.getElementsByClassName("destinationName");

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

    private injectInputInDomPrisme(): void {
        this.styleTag = this.wGame.document.createElement("style");
        this.wGame.document.getElementsByTagName("head")[0].appendChild(this.styleTag);

        this.styleTag.innerHTML += `
        .lindo_prismeBodyHeight__custom{
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

        const zaapPanels = this.wGame.document.getElementsByClassName("zaapBody")[0]
            .getElementsByClassName("panels")[0];

        zaapPanels.classList.add("lindo_prismeBodyHeight__custom");

        this.zaapSearchContainer = this.wGame.document.createElement("div");
        this.zaapSearchInput = this.wGame.document.createElement("input");

        this.zaapSearchInput.setAttribute("placeholder", this.placeholderPrisme);
        this.zaapSearchInput.setAttribute("id", "zaapName");

        this.zaapSearchContainer.classList.add("lindo_zaapSearch__container");
        this.zaapSearchInput.classList.add("lindo_zaapSearch__input");

        this.zaapSearchContainer.append(this.zaapSearchInput);
        this.wGame.document.getElementsByClassName("zaapBody")[0].prepend(this.zaapSearchContainer);
         requestAnimationFrame(() => {
            this.zaapSearchInput.focus()
            this.zaapSearchInput.select()
        });
    }

    private addFavInDomPrism() {
        let zaapList = this.wGame.document.getElementsByClassName("lindo_prismeBodyHeight__custom")[0].getElementsByClassName("row");

        // Ajout de l'étoile fovori (rempli ou non)
        for (let index = 1; index < zaapList.length - 1; index++) {
            const currentZaap = zaapList[index];

            const divVide = currentZaap.getElementsByClassName("col")[0]
            if (divVide.innerHTML == '') {
                const idzaap = currentZaap.getElementsByClassName("col")[1].getElementsByClassName("destinationName")[0]
                if (idzaap != undefined) {
                    const actionButton = (divButton, zaap) => {
                        const favori = localStorage.getItem('zaapFav')
                        const favoriArray = favori.split(',')
                        let unfav = 0
                        for (let index = 0; index < favoriArray.length; index++) {
                            if (favoriArray[index] == zaap) {
                                unfav = index
                            }
                        }
                        if (unfav != 0) {
                            favoriArray.splice(unfav, 1)
                            divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/starOff.png">
                            `
                        } else {
                            /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="yellow" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                            divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/starYellow.png">
                            `
                            favoriArray.push(zaap)
                        }
                        localStorage.setItem('zaapFav', favoriArray.toString())
                    }

                    const divButton = document.createElement('div')
                    divButton.onclick = () => {
                        actionButton(divButton, idzaap.innerHTML)
                    }

                    const favorii = localStorage.getItem('zaapFav')
                    const favoriArrayy = favorii.split(',')
                    let trouver = false
                    for (let index = 0; index < favoriArrayy.length; index++) {
                        if (favoriArrayy[index] == idzaap.innerHTML) {
                            trouver = true
                        }
                    }

                    if (trouver) {
                        /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="yellow" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                        divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/starYellow.png">
                        `
                    } else {
                        /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="none" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                        divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/starOff.png">
                        `
                    }

                    divVide.appendChild(divButton)
                }
            }
        }

        //on met les favori "en haut"
        zaapList = this.wGame.document.getElementsByClassName("lindo_prismeBodyHeight__custom")[0].getElementsByClassName("row");
        let saveIndex = 1
        for (let index = 1; index < zaapList.length - 1; index++) {
            const currentZaap = zaapList[index];
            const idzaap = currentZaap.getElementsByClassName("col")[1].getElementsByClassName("destinationName")[0];
            const favorii = localStorage.getItem('zaapFav');
            const favoriArrayy = favorii.split(',');
            let trouver = false
            for (let index = 0; index < favoriArrayy.length; index++) {
                if (idzaap != undefined)
                    if (favoriArrayy[index] == idzaap.innerHTML) {
                        trouver = true
                    }
            }
            if (trouver) {
                currentZaap.parentNode.prepend(currentZaap);
                saveIndex++
                index = saveIndex
            }
        }
    }

    // Zaapi
    private createSearchFilterZaapi(): void {
        this.injectInputInDomZaapi();
        this.addFavInDomZaapi(); // Fav Zaapi

        this.zaapSearchInput.addEventListener("keyup", () => {
            const zaapWanted = this.zaapSearchInput.value.toLowerCase();

            const zaapList = this.wGame.document.getElementsByClassName("lindo_subwayBodyHeight__custom")[0]
                .getElementsByClassName("row");

            for (const currentZaap of zaapList) {
                const destination = currentZaap.getElementsByClassName("destinationName");

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

        const zaapPanels = this.wGame.document.getElementsByClassName("subwayBody")[0]
            .getElementsByClassName("panels")[0];

        zaapPanels.classList.add("lindo_subwayBodyHeight__custom");

        this.zaapSearchContainer = this.wGame.document.createElement("div");
        this.zaapSearchInput = this.wGame.document.createElement("input");

        this.zaapSearchInput.setAttribute("placeholder", this.placeholderZaapi);
        this.zaapSearchInput.setAttribute("id", "zaapName");

        this.zaapSearchContainer.classList.add("lindo_zaapSearch__container");
        this.zaapSearchInput.classList.add("lindo_zaapSearch__input");

        this.zaapSearchContainer.append(this.zaapSearchInput);
        this.wGame.document.getElementsByClassName("subwayBody")[0].prepend(this.zaapSearchContainer);
         requestAnimationFrame(() => {
            this.zaapSearchInput.focus()
            this.zaapSearchInput.select()
        });
    }

    // Zaapi Favoris
    private addFavInDomZaapi() {
        let zaapList = this.wGame.document.getElementsByClassName("lindo_subwayBodyHeight__custom")[0].getElementsByClassName("row");

        // Ajout de l'étoile fovori (rempli ou non)
        for (let index = 1; index < zaapList.length - 1; index++) {
            const currentZaap = zaapList[index];

            const divVide = currentZaap.getElementsByClassName("col")[0]
            if (divVide.innerHTML == '') {
                const idzaap = currentZaap.getElementsByClassName("col")[1].getElementsByClassName("destinationName")[0]
                if (idzaap != undefined) {
                    const actionButton = (divButton, zaap) => {
                        const favori = localStorage.getItem('zaapFav')
                        const favoriArray = favori.split(',')
                        let unfav = 0
                        for (let index = 0; index < favoriArray.length; index++) {
                            if (favoriArray[index] == zaap) {
                                unfav = index
                            }
                        }
                        if (unfav != 0) {
                            favoriArray.splice(unfav, 1)
                            divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/starOff.png">
                            `
                        } else {
                            /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="yellow" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                            divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/starYellow.png">
                            `
                            favoriArray.push(zaap)
                        }
                        localStorage.setItem('zaapFav', favoriArray.toString())
                    }

                    const divButton = document.createElement('div')
                    divButton.onclick = () => {
                        actionButton(divButton, idzaap.innerHTML)
                    }

                    const favorii = localStorage.getItem('zaapFav')
                    const favoriArrayy = favorii.split(',')
                    let trouver = false
                    for (let index = 0; index < favoriArrayy.length; index++) {
                        if (favoriArrayy[index] == idzaap.innerHTML) {
                            trouver = true
                        }
                    }

                    if (trouver) {
                        /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="yellow" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                        divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/starYellow.png">
                        `
                    } else {
                        /*divButton.innerHTML = `
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 51 48">
                                          <path fill="none" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
                                      </svg>
                                      `*/
                        divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/starOff.png">
                        `
                    }

                    divVide.appendChild(divButton)
                }
            }
        }

        // On met les favori "en haut"
        zaapList = this.wGame.document.getElementsByClassName("lindo_subwayBodyHeight__custom")[0].getElementsByClassName("row");
        let saveIndex = 1
        for (let index = 1; index < zaapList.length - 1; index++) {
            const currentZaap = zaapList[index];
            const idzaap = currentZaap.getElementsByClassName("col")[1].getElementsByClassName("destinationName")[0];
            const favorii = localStorage.getItem('zaapFav');
            const favoriArrayy = favorii.split(',');
            let trouver = false
            for (let index = 0; index < favoriArrayy.length; index++) {
                if (idzaap != undefined)
                    if (favoriArrayy[index] == idzaap.innerHTML) {
                        trouver = true
                    }
            }
            if (trouver) {
                currentZaap.parentNode.prepend(currentZaap);
                saveIndex++
                index = saveIndex
            }
        }
    }

    private resetSearchFilter(): void {
        if (this.styleTag) {
            this.styleTag.remove();
            this.zaapSearchInput.remove();
            this.zaapSearchContainer.remove();
        }
    }

    public reset(): void {
        this.resetSearchFilter()
        super.reset();
    }
}
