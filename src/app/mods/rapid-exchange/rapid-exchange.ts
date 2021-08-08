import {Mod} from "../mod";

/**
 * Allow the user to hold "control" key and double click
 * items slots in the bank to quickly move items
 */
export class RapidExchange extends Mod {
    // Character's inventory in bank exchange view
    private exchangeInventory: any;

    // Bank's inventory in bank exchange view
    private exchangeStorage: any;

    // Character's inventory in trade view
    private tradeWithPlayerAndNPCInventory: any;

    // Does the "ctrl" key is pressed ?
    private keyPressed: boolean = false;

    // All ids of the window we need
    private supportedWindows: Array<string> = ["exchangeInventory", "exchangeStorage", "tradeWithPlayerAndNPCInventory"];

    startMod(): void {
        this.supportedWindows = ["exchangeInventory", "exchangeStorage", "tradeWithPlayerAndNPCInventory"];

        // Retrieve window from the gui
        const windows = this.wGame.gui.windowsContainer.getChildren();

        windows.forEach((window: any) => {
            if (this.supportedWindows.includes(window.id))
                this[window.id] = window;
        });

        this.setKeyListenner();
        this.setInventoryEventListener();
    }

    // events
    private exchangeInventoryEvent(slot: any) {
        this.moveItem(slot.itemInstance, "exchangeInventory", false);
    }
    private exchangeStorageEvent(slot: any) {
        this.moveItem(slot.itemInstance, "exchangeStorage", true);
    }
    private tradeWithPlayerAndNPCInventoryEvent(slot: any) {
        this.moveItem(slot.itemInstance, "tradeWithPlayerAndNPCInventory", false);
    }

    // Listen to the "ctrl" key, and remember it's state
    private setKeyListenner() {
        const keydown = (event: KeyboardEvent) => {
            if (event.keyCode == 17) {
                this.keyPressed = true;
            }
        };
        const keyup = (event: KeyboardEvent) => {
            if (event.keyCode == 17) {
                this.keyPressed = false;
            }
        };

        this.wGame.addEventListener("keydown", keydown, true);
        this.wGame.addEventListener("keyup", keyup, true);

        this.addOnResetListener(() => {
            this.wGame.removeEventListener("keydown", keydown);
            this.wGame.removeEventListener("keyup", keyup);
        });
    }

    // Listen "slot-doubletap" events on window and when it occurs, call the moveItem function
    private setInventoryEventListener() {
        if (this.exchangeInventory) {
            this.on(this.exchangeInventory, 'slot-doubletap', this.exchangeInventoryEvent.bind(this));
        }

        if (this.exchangeStorage) {
            this.on(this.exchangeStorage, 'slot-doubletap', this.exchangeStorageEvent.bind(this));
        }

        if (this.tradeWithPlayerAndNPCInventory) {
            this.on(this.tradeWithPlayerAndNPCInventory, 'slot-doubletap', this.tradeWithPlayerAndNPCInventoryEvent.bind(this));
        }

        // Special Event for the "common" trade window
        // When a slot is added, add a listener on it, tha will call the move item icon
        this.on(this.wGame.gui, 'ExchangeObjectAddedMessage', (msg: any) => {

            // If the event come from the remote character
            if (msg.remote)
                return;

            const UID = msg.object.objectUID;
            const quantity = msg.object.quantity;

            const remove = () => {
                this.moveItem({objectUID: UID, quantity: quantity}, "tradeWithPlayer", true);
            }

            // Retrieve the trade space window
            const myTradeSpace = this.getWindow("tradeWithPlayer");

            // Sometimes the slot is not added instantly
            // So wait to avoid error
            setTimeout(() => {
                myTradeSpace._allSlots.getChild('slot' + UID).on('doubletap', remove);
            }, 500);
        });
    }

    // Move the item from a window to another
    // And Hide the MinMax selector
    private moveItem(itemInstance: any, inventoryId: string, toStorage: boolean) {
        if (itemInstance.quantity > 1 && this.keyPressed) {
            this.wGame.dofus.sendMessage('ExchangeObjectMoveMessage', {
                objectUID: itemInstance.objectUID,
                quantity: toStorage ? -itemInstance.quantity : itemInstance.quantity
            });

            this.hideMinMaxSelector(inventoryId);
        }
    }

    // Return the window that match the id
    private getWindow(id: string) {
        // Get all window
        const windows = this.wGame.gui.windowsContainer.getChildren();

        let window = null;

        // Loop through them
        for (const i in windows) {
            // If we hit the matching window, save it and break the loop
            if (windows[i].id === id) {
                window = windows[i];
                break;
            }
        }

        // In case we haven't found it
        if (!window)
            return null;

        // in the case of the common trade window
        if (window._myTradeSpace)
            return window._myTradeSpace

        // If everithing is ok, return the matching window
        return window;

    }

    // Hide the Minmax selector
    private hideMinMaxSelector(id: string) {
        const window = this.getWindow(id);

        if (!window) {
            return;
        }

        switch (id) {
            // Simplest case, that get the function in their prototype
            case "exchangeInventory":
            case "exchangeStorage":
                window.closeMinMaxSelector();
                break;

            // For these, fond the MinMax selector in children of the window and call the hide function
            case "tradeWithPlayerAndNPCInventory":
            case "tradeWithPlayer":
                for (const i in window._childrenList) {
                    if (window._childrenList[i].rootElement && window._childrenList[i].rootElement.className == "minMaxSelector") {
                        window._childrenList[i].hide();
                    }
                }
        }
    }
}
