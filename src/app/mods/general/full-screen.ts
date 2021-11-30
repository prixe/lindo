import {Mod} from "../mod";


export class Fullscreen extends Mod {
    private full_screen: boolean;

    startMod(): void {
        this.full_screen = this.settings.option.general.full_screen;

        if (this.full_screen) {
            electron.remote.getCurrentWindow().setFullScreen(true);
        } else {
            electron.remote.getCurrentWindow().setFullScreen(false);
        }
    }
}
