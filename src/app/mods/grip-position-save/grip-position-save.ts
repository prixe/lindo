import { SettingsService } from "@services/settings.service";
import { TranslateService } from "@ngx-translate/core";

import { Mod } from "../mod";

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
    translate: TranslateService
  ) {
    super(wGame, settings, translate);

    this.registerEvent(this.wGame.gui.isConnected);

    wGame.addEventListener('storage', (e) => {
      if(e.key.includes('Position')) {
        const target = e.key.slice(0, -8);
        this.moveElement(target);
      }
    });
  }

  startMod(): void {
    return;
  }

  public registerEvent(skipLogin = false): void {
    const onCharacterSelectedSuccess = () => {
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
    if (localStorage.getItem(target + "Position") && this.wGame?.gui?.isConnected) {
      const position = JSON.parse(localStorage.getItem(target + "Position"));
      const mapScene = this.wGame.document.querySelector('#mapScene-canvas');
      let availableWidth = mapScene.clientWidth;
      const availableHeight = mapScene.clientHeight;
      if (mapScene.offsetLeft) {
        availableWidth = availableWidth + mapScene.offsetLeft;
      }
      const cssTarget = '.' + target.charAt(0).toUpperCase() + target.slice(1);
      const targetWidth = this.wGame.document?.querySelector?.(cssTarget)?.clientWidth;
      const targetHeight = this.wGame.document?.querySelector?.(cssTarget)?.clientHeight;
      if (targetWidth !== undefined && targetHeight !== undefined && availableWidth !== undefined && availableHeight !== undefined) {
        const left = (position.left.slice(0, -2) < (availableWidth - targetWidth)) ? position.left.slice(0, -2) : availableWidth - targetWidth;
        const top = (position.top.slice(0, -2) < (availableHeight - targetHeight)) ? position.top.slice(0, -2) : availableHeight - targetHeight;

        // Removing existing stylesheet
        this.wGame?.document?.querySelector?.('#' + target + 'stylesheet')?.remove?.();

        const stylesheet = this.wGame.document.createElement('style');
        stylesheet.id = target + 'stylesheet';
        stylesheet.innerHTML = cssTarget;
        stylesheet.innerHTML += '{';
        stylesheet.innerHTML += 'top:' + top + 'px !important;';
        stylesheet.innerHTML += 'left:' + left + 'px !important;';
        stylesheet.innerHTML += '}';
        this.wGame.document.head.appendChild(stylesheet);
      }
    }
  }

  private savePosition(element, top, left) {
    const obj = { top, left };
    localStorage.setItem(element + "Position", JSON.stringify(obj));
  }

  private registerGrip(grip: any) {
    this.on(this.wGame.gui[grip], 'dragEnd', () => {
      this.savePosition(grip, this.wGame.gui[grip].rootElement.style.top, this.wGame.gui[grip].rootElement.style.left);
    });

    if(grip === 'timeline') {
      this.on(this.wGame.gui[grip], 'resized', () => {
        this.moveElement(grip);
      })
    }

    if (JSON.parse(localStorage.getItem(grip + "Position"))) {
      this.moveElement(grip);
    }
  }

}
