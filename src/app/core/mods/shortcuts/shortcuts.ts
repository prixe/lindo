import {NgZone} from '@angular/core';
import * as async from 'async';
import {Mods} from "../mods";
import {ShortcutsHelper} from "app/core/helpers/shortcuts.helper";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";
import { Mover } from "app/core/mods/mover/mover";

export class Shortcuts extends Mods {

    private params: Option.Shortcuts;
    private shortcutsHelper: ShortcutsHelper;
    private mover: Mover;

    constructor(wGame: any, params: Option.Shortcuts) {
        super(wGame);
        this.params = params;
        this.shortcutsHelper = new ShortcutsHelper(this.wGame);
        this.mover = new Mover(this.wGame);

        this.bindAll();
    }

    private bindAll() {

        Logger.info('bindAll');

        // end turn
        this.shortcutsHelper.bind(this.params.diver.end_turn, () => {
            if (this.wGame.gui.fightManager.fightState == 0) this.wGame.gui.timeline.fightControlButtons.toggleReadyForFight();
            else if (this.wGame.gui.fightManager.fightState == 1) this.wGame.gui.fightManager.finishTurn();
        });

        // open chat
        this.shortcutsHelper.bind(this.params.diver.open_chat, () => {
            if (!this.wGame.gui.numberInputPad.isVisible()) this.wGame.gui.chat.activate()
        });

        // go to top map
        this.shortcutsHelper.bind(this.params.diver.goto_up_map, () => {
            this.mover.move("top", () => {
                console.log('Move to Up OK');
            }, (reason: string = '') => {
                console.log('Move to Up Failed... (' + reason + ')');
            });
        });

        // go to bottom map
        this.shortcutsHelper.bind(this.params.diver.goto_bottom_map, () => {
            this.mover.move("bottom", () => {
                console.log('Move to Bottom OK');
            }, (reason: string = '') => {
                console.log('Move to Bottom Failed... (' + reason + ')');
            });
        });

        // go to left map
        this.shortcutsHelper.bind(this.params.diver.goto_left_map, () => {
            this.mover.move("left", () => {
                console.log('Move to Left OK');
            }, (reason: string = '') => {
                console.log('Move to Left Failed... (' + reason + ')');
            });
        });

        // go to right map
        this.shortcutsHelper.bind(this.params.diver.goto_right_map, () => {
            this.mover.move("right", () => {
                console.log('Move to Right OK');
            }, (reason: string = '') => {
                console.log('Move to Right Failed... (' + reason + ')');
            });
        });

        // spell
        async.forEachOf(this.params.spell, (shortcut: string, index: number) => {
            this.shortcutsHelper.bind(shortcut, () => {
                this.wGame.gui.shortcutBar._panels.spell.slotList[index].tap();
                //this.tab.window.gui.shortcutBar.panels.spell.slotList[index].tap();
            });
        });

        // item
        async.forEachOf(this.params.item, (shortcut: string, index: number) => {
            this.shortcutsHelper.bind(shortcut, () => {
                //this.tab.window.gui.shortcutBar.panels.item.slotList[index].tap();
                this.wGame.gui.shortcutBar._panels.item.slotList[index].tap();
            });
        });

        // interfaces
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

        // close interfaces
        this.shortcutsHelper.bindVanilla('escape', () => {
            if (this.wGame.gui.chat.active) {
                this.wGame.gui.chat.deactivate();
            }
            else {
                for (let i = this.wGame.gui.windowsContainer._childrenList.length - 1; i >= 0; i--) {
                    let win = this.wGame.gui.windowsContainer._childrenList[i];
                    if (win.isVisible()) {
                        win.close();
                        break;
                    }
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
        if (this.mover) this.mover.reset();
        this.shortcutsHelper.unBindAll();
    }

}
