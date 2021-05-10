import {Mod} from "../mod";

export class Chat extends Mod {
    public inputBottom: boolean;

    startMod(): void {
        this.inputBottom = this.settings.option.chat.inputBottom;

        if (this.inputBottom) {
            // move input to the bot
            Logger.info('- enable chat inputBottom');
            let stylesheet = this.wGame.document.createElement('style');
            stylesheet.id = "inputBottom";
            stylesheet.innerHTML = `.chat .formChat {order: 6;}
            .chat.open:not(.fightMode) {margin-top: -26px;}`;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(stylesheet);
        }
    }

    public reset() {
        super.reset();
        if (this.inputBottom) {
            let inputBottomCss = this.wGame.document.getElementById('inputBottom');
            if (inputBottomCss && inputBottomCss.parentElement) {
                inputBottomCss.parentElement.removeChild(inputBottomCss);
            }
        }
    }
}
