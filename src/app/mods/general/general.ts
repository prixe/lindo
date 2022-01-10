import {SettingsService} from "@services/settings.service";
import {TranslateService} from "@services/translate.service";
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

        Logger.info("------------ lang")
        Logger.info(this.translate.currentLang);
        Logger.info(this.translate.getDefaultLang());
        Logger.info(this.translate.getLangs());
        Logger.info(this.translate.getBrowserLang());
        Logger.info(this.translate.getBrowserCultureLang());
    }

    public reset() {
        super.reset();
        for (const i in this.mods) {
            this.mods[i].reset();
        }
    }
}
