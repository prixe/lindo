import { Mods } from "../mods";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";

/**
* This mod add the possibility to hide mount and pet durring fight
*/
export class HideMount extends Mods
{
    constructor (
        wGame: any,
        private params: Option.VIP.General
    ) {
        super(wGame);

        if (this.params.hidden_mount) {
            Logger.info('- enable Hide-Mount');
            let hideMount = () => {
                try {
                    let actionNeeded = false;
                    // Main character
                    if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities != null) {
                        if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities.length > 0) {
                            actionNeeded = true;
                            this.removeMountToPlayer(this.wGame.actorManager.userActor.actorManager.userActor);
                        }
                    }
                    // Other characters
                    for (let key in this.wGame.actorManager.actors) {
                        if (+key > 0) {
                            if (this.wGame.actorManager.actors[key].look.subentities != null) {
                                actionNeeded = true;
                                this.removeMountToPlayer(this.wGame.actorManager.actors[key]);
                            }
                        }
                    }
                    if (actionNeeded) {
                        this.wGame.gui.mainControls._creatureModeButton.tap();
                        setTimeout(() => {
                            this.wGame.gui.mainControls._creatureModeButton.tap();
                        }, 100);
                    }
                } catch (ex) {
                    Logger.error(ex);
                }
            };

            // Wait begin fight
            this.on(this.wGame.dofus.connectionManager, 'GameFightStartMessage', hideMount);
        }
    }

    private removeMountToPlayer(player): void {
        this.wGame.actorManager.userActor.actorManager.userActor.look.bonesId = 1;

        // Character size
        this.wGame.actorManager.userActor.actorManager.userActor.look.scales = [140];

        // Colors
        if (this.wGame.actorManager.userActor.look.subentities["0"].subEntityLook.indexedColors.length > 0) {
            this.wGame.actorManager.userActor.actorManager.userActor.look.indexedColors = this.wGame.actorManager.userActor.look.subentities["0"].subEntityLook.indexedColors;
        }

        // Remove mount
        if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities["0"].subEntityLook.skins.length > 0) {
            this.wGame.actorManager.userActor.actorManager.userActor.look.skins = this.wGame.actorManager.userActor.actorManager.userActor.look.subentities["0"].subEntityLook.skins;
        }

        // Remove pet and mount
        this.wGame.actorManager.userActor.actorManager.userActor.look.subentities = null;
    }
}
