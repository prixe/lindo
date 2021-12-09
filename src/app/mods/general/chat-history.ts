import {Mod} from "../mod";

export class ChatHistory extends Mod {
    private input;
    private listener;

    startMod(): void {
        // up & down for chat history
        if (!this.input) {
            this.input = this.wGame.document.getElementsByClassName('inputChat')[0];
        }

        if (!this.listener) {
            this.listener = (e) => {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.wGame.gui.chat.chatInput.sentMessageHistory.goBack();
                    this.wGame.gui.chat.chatInput.inputChat.setValue(this.wGame.gui.chat.chatInput.sentMessageHistory.getCurrentEntry()['message']);
                    return false;
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.wGame.gui.chat.chatInput.sentMessageHistory.goForward();
                    this.wGame.gui.chat.chatInput.inputChat.setValue(this.wGame.gui.chat.chatInput.sentMessageHistory.getCurrentEntry()['message']);
                    return false;
                }
            };
        }
        this.input.addEventListener("keydown", this.listener, false);
    }

    public reset() {
        super.reset();
        this.input.removeEventListener("keydown", this.listener, false);
    }
}
