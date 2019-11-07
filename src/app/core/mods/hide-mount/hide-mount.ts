import { Mods } from "../mods";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";

/**
* This mod add the possibility to hide mount durring fight
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
            let toggle = () => {
                try {
                    let actionNeeded = false;
                    // Main character
                    if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities != null) {
                        if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities.length > 0) {
                            actionNeeded = true;
                            this.wGame.actorManager.userActor.actorManager.userActor.look.bonesId = 1;
                            if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities["0"].subEntityLook.skins.length > 0) {
                                this.wGame.actorManager.userActor.actorManager.userActor.look.skins = this.wGame.actorManager.userActor.actorManager.userActor.look.subentities["0"].subEntityLook.skins;
                            }
                            // Character size
                            this.wGame.actorManager.userActor.actorManager.userActor.look.scales = [140];
                            if (this.wGame.actorManager.userActor.look.subentities["0"].subEntityLook.indexedColors.length > 0) {
                                this.wGame.actorManager.userActor.actorManager.userActor.look.indexedColors = this.wGame.actorManager.userActor.look.subentities["0"].subEntityLook.indexedColors;
                            }
                            this.wGame.actorManager.userActor.actorManager.userActor.look.subentities = null;
                        }
                    }
                    // Other character
                    for (let key in this.wGame.actorManager.actors) {
                        if (+key > 0) {
                            if (this.wGame.actorManager.actors[key].look.subentities != null) {
                                actionNeeded = true;
                                this.wGame.actorManager.actors[key].look.bonesId = 1;
                                this.wGame.actorManager.actors[key].look.scales = [140];
                                if (this.wGame.actorManager.actors[key].look.subentities["0"].subEntityLook.skins.length > 0) {
                                    this.wGame.actorManager.actors[key].look.skins = this.wGame.actorManager.actors[key].look.subentities["0"].subEntityLook.skins;
                                }
                                if (this.wGame.actorManager.actors[key].look.subentities["0"].subEntityLook.indexedColors.length > 0) {
                                    this.wGame.actorManager.actors[key].look.indexedColors = this.wGame.actorManager.actors[key].look.subentities["0"].subEntityLook.indexedColors;
                                }
                                this.wGame.actorManager.actors[key].look.subentities = null;
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
                    Logger.info(ex);
                }
            };

            // Wait begin fight
            this.on(this.wGame.dofus.connectionManager, 'GameFightStartMessage', toggle);
        }
    }
}
