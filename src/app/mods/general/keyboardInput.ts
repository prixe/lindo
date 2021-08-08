import {Mod} from "../mod";

export class KeyboardInput extends Mod {
    // Referece of the number input pad
    private numberInputPad: any;

    // All allowed keys for the number input pad
    private allowedKeys: Array<string> = ["0", "1", "2", "3" ,"4", "5", "6", "7", "8", "9", "Enter", "Backspace"];

    startMod(): void {
        this.numberInputPad = this.wGame.gui.numberInputPad;
        this.setKeyListenner();
    }

    private setKeyListenner() {
        const doInput = (event: KeyboardEvent) => {
            // If The number input pad is not visble or the key pressed is not allowed, don't continue
            if (!this.numberInputPad.isVisible() || !this.allowedKeys.includes(event.key)) {
                return;
            }

            // Call built-in functions
            switch (event.key) {
                case 'Enter': return this.numberInputPad._doEnter();
                case 'Backspace': return  this.numberInputPad._doBackspace();
                default: return  this.numberInputPad._doDigit(event.key);
            }
        };

        this.wGame.addEventListener("keydown", doInput);
        this.addOnResetListener(() => {
            this.wGame.removeEventListener("keydown", doInput);
        });
    }
}
