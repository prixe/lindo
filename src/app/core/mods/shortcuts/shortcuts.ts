import { NgZone } from '@angular/core';
import * as async from 'async';
import { Mods } from "../mods";
import { ShortcutsHelper } from "app/core/helpers/shortcuts.helper";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";

export class Shortcuts extends Mods {

    private params: Option.Shortcuts;
    private shortcutsHelper: ShortcutsHelper;

    constructor(wGame: any, params: Option.Shortcuts) {
        super(wGame);
        this.params = params;
        this.shortcutsHelper = new ShortcutsHelper(this.wGame);

        this.bindAll();
    }

    private bindAll() {
        Logger.info('bindAll');

        // End turn
        this.shortcutsHelper.bind(this.params.diver.end_turn, () => {
            if (this.wGame.gui.fightManager.fightState == 0) {
              this.wGame.gui.timeline.fightControlButtons.toggleReadyForFight();
            } else if (this.wGame.gui.fightManager.fightState == 1) {
              this.wGame.gui.fightManager.finishTurn();
            }
        });

        // Open chat
        this.shortcutsHelper.bind(this.params.diver.open_chat, () => {
            if (!this.wGame.gui.numberInputPad.isVisible()) {
              this.wGame.gui.chat.activate()
            }
        });

        // Open menu
        this.shortcutsHelper.bind(this.params.diver.open_menu, () => {
            this.wGame.gui.mainControls.buttonBox._childrenList[14].tap()
        });

        // Spell
        async.forEachOf(this.params.spell, (shortcut: string, index: number) => {
            this.shortcutsHelper.bind(shortcut, () => {
                this.wGame.gui.shortcutBar._panels.spell.slotList[index].tap();
                //this.tab.window.gui.shortcutBar.panels.spell.slotList[index].tap();
            });
        });

        // Item
        async.forEachOf(this.params.item, (shortcut: string, index: number) => {
            this.shortcutsHelper.bind(shortcut, () => {
                //this.tab.window.gui.shortcutBar.panels.item.slotList[index].tap();
                this.wGame.gui.shortcutBar._panels.item.slotList[index].tap();
            });
        });

        // Interfaces
        async.forEachOf(this.params.interface.getAll(), (inter: any) => {
            this.wGame.gui.menuBar._icons._childrenList.forEach((element: any, index: number) => {
                if (element.id.toUpperCase() == inter.key.toUpperCase()) {
                    this.shortcutsHelper.bind(inter.value, () => {
                        let newIndex = index;
                        this.wGame.gui.menuBar._icons._childrenList[newIndex].tap();
                    });
                    return;
                }
            });
        });

        // Close interfaces
        this.shortcutsHelper.bindVanilla('escape', () => {
            if (this.wGame.gui.chat.active) {
                this.wGame.gui.chat.deactivate();
            } else {
                let winClosed = 0;
                for (let i = this.wGame.gui.windowsContainer._childrenList.length - 1; i >= 0; i--) {
                    let win = this.wGame.gui.windowsContainer._childrenList[i];
                    if (win.isVisible()) {
                        win.close();
                        winClosed++;
                        break;
                    }
                }
                if (!winClosed) {
                    // If no window closed open menu
                    this.wGame.gui.mainControls.buttonBox._childrenList[14].tap()
                }
            }
        });
        // Prevent using tab key
        this.shortcutsHelper.bindVanilla('tab', (e: KeyboardEvent) => {
            e.preventDefault();
        });
    }

    public reset() {
        super.reset();
        this.shortcutsHelper.unBindAll();
    }
}
