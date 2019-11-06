import {Mods} from "../mods";

export class Popup extends Mods{

    constructor (wGame: any) {
        super(wGame);

        let windows = this.wGame.gui.windowsContainer.getChildren();
        windows.forEach((window: any) => {
            if (window.id === 'tradeItemConfirm') {
                window.on('opened', () => {
                    window.buyBtn.tap();
                });
            } else if (window.id === 'fightEnd') {
                window.on('opened', () => {
                    window.closeButton.tap();
                });
            } else if (window.id === 'fightEndRewards') {
                // when append ?
                window.on('opened', () => {
                    console.log('fightEndRewards')
                });
            } else if (window.id === 'levelup') {
                window.on('opened', () => {
                    window.closeButton.tap();
                });
            } else if (window.id === 'popup') {
                window.on('opened', () => {
                    window.closeButton.tap();
                });
            } else if (window.id !== undefined) {
                window.on('opened', () => {
                    console.log(window);
                    console.log(window.id);
                });
            }
        });
    }
}
