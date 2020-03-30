import { SettingsService } from "app/core/service/settings.service";
import { TranslateService } from "@ngx-translate/core";

import { Mod } from "../mod";

import * as Mods from ".";

export class General extends Mod {
    private mods: Mod[] = [];

    constructor(
        wGame: any|Window,
        settings: SettingsService,
        translate: TranslateService
    ) {
        super(wGame, settings, translate)

        // Init mods
        this.mods = [];
        for (let mod in Mods) {
            this.mods.push(new Mods[mod](this.wGame, this.settings, this.translate))
        }
    }

    startMod(): void {}

    public reset() {
        super.reset();
        for (let i in this.mods) {
            this.mods[i].reset();
        }
    }
}
