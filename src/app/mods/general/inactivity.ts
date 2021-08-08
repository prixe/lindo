import {Mod} from "../mod";

export class Inactivity extends Mod {
    private disable_inactivity: boolean;
    private idInt: any;

    startMod(): void {
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
