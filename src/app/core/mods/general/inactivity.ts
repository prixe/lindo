import {Mods} from "../mods";

export class Inactivity extends Mods {
    private disable_inactivity: boolean;
    private idInt: any;

    constructor(
        wGame:any|Window,
        options:any
    ) {
        super(wGame);
        this.disable_inactivity = options.disable_inactivity;

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
