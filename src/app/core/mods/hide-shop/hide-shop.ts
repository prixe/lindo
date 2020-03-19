import {Mods} from "../mods";
/**
 * This mod add the possibility to hide the floating shop button
 */
export class HideShop extends Mods{
    private hidden_shop: boolean;

    constructor (
        wGame: any | Window,
        options: any
    ) {
        super(wGame);
        this.hidden_shop = options.hidden_shop;

        // That function shows or hides the shop button
        // depending on the variable "hidden_shop"
        let toggle = () => {
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
