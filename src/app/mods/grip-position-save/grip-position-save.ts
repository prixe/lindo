// TODO :
//
// - Use ipcRendererService instead of wGame.addEventListener('storage', ...
// Can't make ipcRendererService works : this.ipcRendererService is well instanciated
// If you log this.ipcRendererService you see in Listener on move-grip
// But this.ipcRendererService.send('move-grip', target) doesn't make anything
//
// - Calculate max top/left of grips to not overlap foreground

import { SettingsService } from "@services/settings.service";
import { TranslateService } from "@ngx-translate/core";

import { Mod } from "../mod";
import { IpcRendererService } from "@services/electron/ipcrenderer.service";

export class GripPositionSave extends Mod {

  private grips = [
    'timeline',
    'party',
    'notificationBar',
    'challengeIndicator',
    'roleplayBuffs'
  ]

  constructor(
    wGame: any,
    settings: SettingsService,
    translate: TranslateService,
    public ipcRendererService: IpcRendererService
  ) {
    super(wGame, settings, translate);
    this.ipcRendererService = ipcRendererService;

    this.registerEvent(this.wGame.gui.isConnected);

    // This is a temporary fix because ipcRendererService doesn't work
    // It works only for accounts in same Lindo window, not in multiple Lindo
    // E.G :
    // - You have 2 windows (A, B) of 4 accounts each
    // - You move Party in Window A, Account 1
    // - Party is moved on every accounts logged in Window A, not in accounts on Window B
    wGame.addEventListener('storage', (e) => {
      const target = e.key.slice(0, -8);
      this.moveElement(target);
    });
  }

  startMod(): void {
    return;
  }

  public registerEvent(skipLogin = false): void {
    const onCharacterSelectedSuccess = () => {
      // This doesn't work, the event is never fired
      this.on(this.ipcRendererService, 'move-grip', (event: Event, target: any) => {
        // Never displayed in console, this.moveElement never called.
        console.log('Got event! ' + target);
        this.moveElement(target);
      });

      // Register events for each grips
      this.grips.forEach(grip => {
        this.registerGrip(grip);
      });
    };

    const onResize = () => {
      // Move grips to not overlap foreground
      this.grips.forEach(grip => {
        this.moveElement(grip);
      });
    }

    if (skipLogin) {
      onCharacterSelectedSuccess();
    }

    this.on(this.wGame.gui.playerData, "characterSelectedSuccess", onCharacterSelectedSuccess);
    this.on(this.wGame.gui, "resize", onResize);
  }

  private moveElement(target) {
    if (localStorage.getItem(target + "Position")) {
      const position = JSON.parse(localStorage.getItem(target + "Position"));

      // Removing existing stylesheet
      this.wGame?.document?.querySelector?.('#' + target + 'stylesheet')?.remove?.();

      const stylesheet = this.wGame.document.createElement('style');
      stylesheet.id = target + 'stylesheet';
      // Convert first letter to uppercase to use default class
      stylesheet.innerHTML = '.' + target.charAt(0).toUpperCase() + target.slice(1);
      stylesheet.innerHTML += '{';
      stylesheet.innerHTML += 'top:' + position.top + ' !important;'; // Calculate max top position to be fully and always visible
      stylesheet.innerHTML += 'left:' + position.left + ' !important;'; // Calculate max left position to be fully and always visible
      stylesheet.innerHTML += '}';
      this.wGame.document.head.appendChild(stylesheet);
    }
  }

  private savePosition(element, top, left) {
    const obj = { top, left };
    localStorage.setItem(element + "Position", JSON.stringify(obj));
  }

  private registerGrip(grip: any) {
    this.on(this.wGame.gui[grip], 'dragEnd', () => {
      this.ipcRendererService.send('move-grip', grip);
      this.savePosition(grip, this.wGame.gui[grip].rootElement.style.top, this.wGame.gui[grip].rootElement.style.left);
    });

    if (JSON.parse(localStorage.getItem(grip + "Position"))) {
      this.moveElement(grip);
    }
  }

}
