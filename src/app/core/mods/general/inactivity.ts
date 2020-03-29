import { Mod } from "../mod";
import { SettingsService } from "app/core/service/settings.service";
import { TranslateService } from "@ngx-translate/core";

export class Inactivity extends Mod {
    private disable_inactivity: boolean;
    private idInt: any;
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
        this.disable_inactivity = this.settings.option.vip.general.disable_inactivity;

        if (this.disable_inactivity) {
            this.idInt = setInterval(() => {
                this.wGame.d.recordActivity();
            }, 60 * 60 * 3);
        }
    }

    public reset() {
        super.reset();
        clearInterval(this.idInt);
    }
}
