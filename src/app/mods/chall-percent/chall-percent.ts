import { SettingsService } from "@services/settings.service";
import {Mod} from "../mod";

export class ChallPercent extends Mod {

  private stylesheet: HTMLStyleElement;

  startMod(): void {
    this.params = this.settings.option.vip.general.challpercent;

    if (this.params) {
      Logger.info('- enable ChallPercent');
      this.stylesheet = window.document.createElement('style');
      this.stylesheet.id = 'ChallPercent';
      this.stylesheet.innerHTML = `
      .challPercentOnIcon .challengeIcon {
        background-size: contain;
        background-position: left center;
      }

      .challPercentOnIcon,
      .challPercentOnIcon .challengeSlot {
        width: 100px;
      }

      .challPercentOnIconDetails {
        position: absolute;
        width: 45px;
        left: 45px;
        top: 11px;
      }
      `;

      this.wGame.document.head.appendChild(this.stylesheet);

      this.wGame.gui.challengeIndicator.rootElement.classList.add('challPercentOnIcon');

      this.on(this.wGame.dofus.connectionManager, 'ChallengeInfoMessage', (msg) => {
        const challengeText = document.createElement('div');
        challengeText.className = 'challPercentOnIconDetails';
        challengeText.innerHTML = '+' + msg.xpBonus + '%';
        this.wGame.gui.challengeIndicator?.iconDetailsListByChallengeId?.[msg.challengeId]?.icon?.rootElement.appendChild(challengeText);
      });

    }
  }

  public reset() {
    if (this.params) {
      this.stylesheet?.remove?.();

      if (this.wGame.gui.challengeIndicator) {
        this.wGame.gui?.challengeIndicator?.rootElement?.classList?.remove?.('kedaChallPercentOnIcon');
      }

    }
    super.reset();
  }
}
