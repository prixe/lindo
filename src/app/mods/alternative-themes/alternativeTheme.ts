import { Select } from "@helpers/windowHelper/inputDtHelper/inputs/select";
import { Mod } from "../mod";

import { neoDark } from "./themes/neoDark";
import { neoGlassTheme } from "./themes/neoGlass";

export class AlternativeTheme extends Mod {

    private optionsWindow: any;
    private themeList: any[];

    async startMod(): Promise<void> {
        // Set parent windows
        this.optionsWindow = this.wGame.gui.windowsContainer.getChildren().find(c => c.id === "options");

        // Define gui listener
        this.optionsWindow.on("open", () => this.onOpen());

        // Set Theme list
        this.themeList = [
            {id: 'default', text: 'Défaut'},
            {id: 'neoBlack', text: 'Noir transparent'},
            {id: 'neoGlass', text: 'Glass'},
        ];

        this.init();
    }

    private init() {
        const selectTheme: string = localStorage.getItem('alternativeTheme');

        if (selectTheme) {
            this.applyTheme(selectTheme);
            let theme = this.themeList.find(theme => theme.id == selectTheme);
            theme['ticked'] = true;
        }
    }

    private onOpen() {
        const selectHelper: Select = new Select(this.wGame);
        const content = this.optionsWindow.rootElement.getElementsByClassName('miscSection')[0].getElementsByClassName('allOptions')[0];

        // Create new elements
        const headTitle = this.wGame.document.createElement('div');
        headTitle.innerText = 'Choix du thème (LINDO)';
        headTitle.className = "header";

        // Create select
        const select = selectHelper.createSelect('theme-selector', this.themeList);
        select.style.marginBottom = "15px";

        // Insert in parent
        content.append(headTitle);
        content.append(select);

        // Add event on select
        let onClickSelect = (data: any) => { this.applyTheme(data.id) };
        selectHelper.addSelectEvent(select, (data: any) => {onClickSelect(data)});
    }

    private applyTheme(themeId: string) {
        // Remove previous theme if exist
        this.wGame.document.getElementById('alternativeTheme')?.remove();

        // Create new style element for theme
        const theme = this.wGame.document.createElement('style');
        theme.id = 'alternativeTheme';

        switch (themeId) {
            case 'neoBlack': theme.innerHTML = neoDark; break;
            case 'neoGlass': theme.innerHTML = neoGlassTheme(); break;
        }

        this.wGame.document.head.appendChild(theme);
        localStorage.setItem('alternativeTheme', themeId);

        // Update to display name of selected choice in input
        const oldTheme = this.themeList.find(t => t.ticked);
        if (oldTheme?.ticked) oldTheme.ticked = false;
        const newTheme = this.themeList.find(t => t.id == themeId);
        newTheme['ticked'] = true;
    }
}