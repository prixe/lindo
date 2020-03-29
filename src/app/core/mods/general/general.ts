import { Mod } from "../mod";
import { SettingsService } from "app/core/service/settings.service";
import { TranslateService } from "@ngx-translate/core";

import * as Mods from ".";

export class General extends Mod {
    private mods: Mod[] = [];
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
        // Init mods
        for (let mod in Mods) {
            this.mods.push(new Mods[mod](this.wGame, this.settings, this.translate))
        }
    }

    public reset() {
        super.reset();
        for (let i in this.mods) {
            this.mods[i].reset();
        }
    }
}
