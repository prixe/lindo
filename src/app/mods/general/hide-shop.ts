import {Mod} from "../mod";

/**
 * This mod add the possibility to hide the floating shop button
 */
export class HideShop extends Mod {
    private hidden_shop: boolean;

    startMod(): void {
        this.hidden_shop = this.settings.option.general.hidden_shop;

        // That function shows or hides the shop button
        // depending on the variable "hidden_shop"
        const toggle = () => {
            if (this.hidden_shop)
                this.wGame.gui.shopFloatingToolbar.hide();
            else
                this.wGame.gui.shopFloatingToolbar.show();
        };

        // Toggle the shop button at the end of a fight
        this.on(this.wGame.gui.fightManager, 'fightEnd', toggle);

        // At the begining, toggle the shop button
        setTimeout(toggle, 1000);
    }
}
