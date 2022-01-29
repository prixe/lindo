import { SettingsService } from "@services/settings.service";
import {Mod} from "../mod";

export class QtyInventoryBidHouse extends Mod {

  startMod(): void {

    const tradeItemWindow = this.wGame.gui.windowsContainer.getChildren().find(w => w.id == 'tradeItem');

    const evObjectQuantityMessage = (msg) => {
      const table = tradeItemWindow?.bidHouseBuyerBox?.table;
      if(table) {
        table.header.row.icon.content.rootElement.innerHTML = '(' + msg.quantity + ')';
      }
    }

    const evObjectAddedMessage = (msg) => {
      const table = tradeItemWindow?.bidHouseBuyerBox?.table;
      if(table) {
        table.header.row.icon.content.rootElement.innerHTML = '(' + msg.object.quantity + ')';
      }
    }

    const evExchangeTypesItemsExchangerDescriptionForUserMessage = () => {
      const inventory = this.wGame.gui.playerData.inventory.objects;
      const viewedItem = tradeItemWindow.item;
      const inventoryItemQuantity = (<any>Object).values(inventory).filter(i => i.id === viewedItem.id)?.reduce((qt, { quantity }) => qt + quantity, 0);
      const quantity = inventoryItemQuantity ? inventoryItemQuantity : 0;
      const table = tradeItemWindow.bidHouseBuyerBox.table;
      const sorter = table.header.row.icon.sorter;
      sorter.rootElement.classList.remove('noText');
      sorter.rootElement.style.left = 'auto';
      table.header.row.icon.content.rootElement.innerHTML = '(' + quantity + ')';
    }

    this.on(this.wGame.dofus.connectionManager, 'ObjectQuantityMessage', evObjectQuantityMessage);
    this.on(this.wGame.dofus.connectionManager, 'ObjectAddedMessage', evObjectAddedMessage);
    this.on(this.wGame.dofus.connectionManager, 'ExchangeTypesItemsExchangerDescriptionForUserMessage', evExchangeTypesItemsExchangerDescriptionForUserMessage);
  }

  public reset() {
    super.reset();
  }
}
