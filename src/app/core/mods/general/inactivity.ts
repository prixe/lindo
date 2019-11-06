import {Mods} from "../mods";

export class Inactivity extends Mods {

    private idInt: any;

    constructor(wGame:any|Window, enable:boolean) {
        super(wGame);

        if (enable) {
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
