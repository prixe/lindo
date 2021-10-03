// TODO :
// - Use ipcRendererService instead of wGame.addEventListener('storage', ...
// Can't make ipcRendererService works : this.ipcRendererService is well instantiate
// If you log this.ipcRendererService you see in Listener on move-grip
// But this.ipcRendererService.send('move-grip', target) doesn't ùake anything

import { SettingsService } from "@services/settings.service";
import { TranslateService } from "@ngx-translate/core";

import { Mod } from "../mod";
import { IpcRendererService } from "@services/electron/ipcrenderer.service";

export class GripPositionSave extends Mod {

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
    // - You have 2 windows (A, B) of 4 accounts (1, 2, 3 ...)
    // - You move Party in Window A, Account 1
    // - Party is moved on every accounts logged in Window A, not in Window B
    wGame.addEventListener('storage', (e) => {
      const target = e.key.substr(0, e.key.length - 8);
      this.moveElement(target);
    });
  }

  startMod(): void {
    return;
  }

  public registerEvent(skipLogin: boolean = false): void {
    const onCharacterSelectedSuccess = () => {

      // This doesn't work, the event is never fired
      this.on(this.ipcRendererService, 'move-grip', (event: Event, target: any) => {
        // Never displayed in console, this.moveElement never called.
        console.log('Got event! ' + target);
        this.moveElement(target);
      });

      // Timeline
      this.on(this.wGame.gui.timeline, 'dragEnd', () => { this.timelineDragEnd() });

      if (JSON.parse(localStorage.getItem("timelinePosition"))) {
        setTimeout(() => {
          this.moveElement('timeline');
        }, this.getRandomTime(2, 3));
      }

      // Party
      this.on(this.wGame.gui.party, 'dragEnd', () => {
        this.ipcRendererService.send('move-grip', 'party');
        this.partyDragEnd();
      });

      if (JSON.parse(localStorage.getItem("partyPosition"))) {
        setTimeout(() => {
          this.moveElement('party');
        }, this.getRandomTime(2, 3));
      }

      // Observer to move party when visible, because allways pushed at right.
      const partyObserver = new MutationObserver(() => {
        if (this.wGame.gui.party.rootElement.style.display != 'none') {
          this.moveElement('party');
        }
      });
      partyObserver.observe(this.wGame.gui.party.rootElement, { attributes: true, childList: true });

      // notificationBar
      this.on(this.wGame.gui.notificationBar, 'dragEnd', () => { this.notificationBarDragEnd() });

      if (JSON.parse(localStorage.getItem("notificationBarPosition"))) {
        setTimeout(() => {
          this.moveElement('notificationBar');
        }, this.getRandomTime(2, 3));
      }

      // challengeIndicator
      this.on(this.wGame.gui.challengeIndicator, 'dragEnd', () => { this.challengeIndicatorDragEnd() });

      if (JSON.parse(localStorage.getItem("challengeIndicatorPosition"))) {
        setTimeout(() => {
          this.moveElement('challengeIndicator');
        }, this.getRandomTime(2, 3));
      }

      // Observer to move challengeIndicator when visible, because allways pushed at right.
      const challengeIndicatorObserver = new MutationObserver(() => {
        if (this.wGame.gui.challengeIndicator.rootElement.style.display != 'none') {
          this.moveElement('challengeIndicator');
        }
      });
      challengeIndicatorObserver.observe(this.wGame.gui.challengeIndicator.rootElement, { attributes: true, childList: true });

      // roleplayBuffs
      this.on(this.wGame.gui.roleplayBuffs, 'dragEnd', () => { this.roleplayBuffsDragEnd() });

      if (JSON.parse(localStorage.getItem("roleplayBuffsPosition"))) {
        setTimeout(() => {
          this.moveElement('roleplayBuffs');
        }, this.getRandomTime(2, 3));
      }

      // Observer to move roleplayBuffs when visible, because allways pushed at right.
      const roleplayBuffsObserver = new MutationObserver(() => {
        if (this.wGame.gui.roleplayBuffs.rootElement.style.display != 'none') {
          this.moveElement('roleplayBuffs');
        }
      });
      roleplayBuffsObserver.observe(this.wGame.gui.roleplayBuffs.rootElement, { attributes: true, childList: true });

    };

    if (skipLogin) {
      onCharacterSelectedSuccess();
    }

    this.on(this.wGame.gui.playerData, "characterSelectedSuccess", onCharacterSelectedSuccess);
  }

  private moveElement(target) {
    if (localStorage.getItem(target + "Position")) {
      const position = JSON.parse(localStorage.getItem(target + "Position"));

      this.wGame.gui[target] ?.setStyles({
        left: position.left,
        top: position.top
      });
    }
  }

  private savePosition(element, top, left) {
    const obj = {} as any;
    obj.top = top;
    obj.left = left;

    localStorage.setItem(element + "Position", JSON.stringify(obj));
  }

  private timelineDragEnd() {
    // This doesn't work : maybe event is not send, or is not listened ?
    this.ipcRendererService.send('move-grip', 'timeline');
    this.savePosition('timeline', this.wGame.gui.timeline.rootElement.style.top, this.wGame.gui.timeline.rootElement.style.left);
  }

  private partyDragEnd() {
    // This doesn't work : maybe event is not send, or is not listened ?
    this.ipcRendererService.send('move-grip', 'party');
    this.savePosition('party', this.wGame.gui.party.rootElement.style.top, this.wGame.gui.party.rootElement.style.left);
  }

  private notificationBarDragEnd() {
    // This doesn't work : maybe event is not send, or is not listened ?
    this.ipcRendererService.send('move-grip', 'notificationBar');
    this.savePosition('notificationBar', this.wGame.gui.notificationBar.rootElement.style.top, this.wGame.gui.notificationBar.rootElement.style.left);
  }

  private challengeIndicatorDragEnd() {
    // This doesn't work : maybe event is not send, or is not listened ?
    this.ipcRendererService.send('move-grip', 'challengeIndicator');
    this.savePosition('challengeIndicator', this.wGame.gui.challengeIndicator.rootElement.style.top, this.wGame.gui.challengeIndicator.rootElement.style.left);
  }

  private roleplayBuffsDragEnd() {
    // This doesn't work : maybe event is not send, or is not listened ?
    this.ipcRendererService.send('move-grip', 'roleplayBuffs');
    this.savePosition('roleplayBuffs', this.wGame.gui.roleplayBuffs.rootElement.style.top, this.wGame.gui.roleplayBuffs.rootElement.style.left);
  }

}
