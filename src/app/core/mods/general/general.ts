import { Mod } from "../mod";

// import * as Mod from ".";

import { CssOverload } from "./cssOverload"
import { HideShop } from "./hideShop"
import { Inactivity } from "./inactivity"
import { JsFixes } from "./jsFixes"
import { KeyboardInput } from "./keyboardInput"

export class General extends Mod {
    private mods;

    constructor(
        wGame:any|Window,
        private settingsService
    ) {
        super(wGame);
        this.mods = [
            new CssOverload(wGame),
            new HideShop(wGame, this.settingsService),
            new Inactivity(wGame, this.settingsService),
            new JsFixes(wGame),
            new KeyboardInput(wGame)
        ];
    }

    public reset() {
        super.reset();
        for (let i in this.mods) {
            this.mods[i].reset();
        }
    }
}
