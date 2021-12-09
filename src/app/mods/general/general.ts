import {SettingsService} from "@services/settings.service";
import {TranslateService} from "@ngx-translate/core";
import {WGame} from "../../types/dofus.types";
import {Mod} from "../mod";
import * as Mods from "./index";

export class General extends Mod {
    private mods: Mod[] = [];

    constructor(
        wGame: WGame,
        settings: SettingsService,
        translate: TranslateService
    ) {
        super(wGame, settings, translate)

        // Init mods
        this.mods = [];
        for (const mod in Mods) {
            this.mods.push(new Mods[mod](this.wGame, this.settings, this.translate))
        }
    }

    public reset() {
        super.reset();
        for (const i in this.mods) {
            this.mods[i].reset();
        }
    }
}
