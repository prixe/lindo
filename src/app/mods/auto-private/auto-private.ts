import { SettingsService } from "@services/settings.service";
import {Mod} from "../mod";

export class AutoPrivate extends Mod {

  startMod(): void {
    this.params = this.settings.option.vip.general.autoprivate;

    if (this.params) {
      setTimeout(() => {
        this.wGame.dofus.connectionManager.sendMessage('PlayerStatusUpdateRequestMessage', { status: { statusId: 30 } });
      }, this.getRandomTime(25, 60));
    }
  }
}
