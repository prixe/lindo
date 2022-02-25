import { Mod } from "../mod";

export class ShowPods extends Mod {
  private equipmentWindow;
  private podsLabel;
  private evtInventoryWeightMessage = this.onInventoryWeightMessage.bind(this);
  private evtInit = this.init.bind(this);

  startMod(): void {
    this.equipmentWindow = this.wGame.gui.windowsContainer
      .getChildren()
      .find((w) => w.id === "equipment")
      .on("open", () => {
        if (this.equipmentWindow.openState) {
          this.evtInit();
        } else {
          this.equipmentWindow.once("opened", this.evtInit);
        }
      });
  }

  private init() {
    const podContainer = this.equipmentWindow.storageBox._childrenList[0]._childrenList.find((c) =>
      c.hasClassName("podContainer")
    );
    const progressBarContainer = podContainer._childrenList.find((c) => c.hasClassName("progressBarContainer"));
    this.podsLabel = progressBarContainer._childrenList[0];

    const pods = this.formatNumber(
      this.wGame.gui.playerData.inventory.maxWeight - this.wGame.gui.playerData.inventory.weight
    );
    this.podsLabel.setText(`${pods} Pods:`);
    this.wGame.connectionManager.on("InventoryWeightMessage", this.evtInventoryWeightMessage);
  }

  private onInventoryWeightMessage(msg) {
    const pods = this.formatNumber(msg.weightMax - msg.weight);
    this.podsLabel.setText(`${pods} Pods:`);
  }

  private formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  reset() {
    this.wGame.connectionManager.removeListener("InventoryWeightMessage", this.evtInventoryWeightMessage);
    this.equipmentWindow && this.equipmentWindow.removeListener("opened", this.evtInit);
  }
}
