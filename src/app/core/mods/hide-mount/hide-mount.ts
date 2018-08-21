import {Mods} from "../mods";
import {Logger} from "app/core/electron/logger.helper";

/**
 * This mod add the possibility to hide mount durring fight
 */
export class HideMount extends Mods
{
    constructor (wGame: any | Window) {
        super(wGame);
        Logger.debug('Mod HideMount - OK');

        // That function shows or hides the shop button
        let toggle = () => {
            try {
                setTimeout(() => {
                    Logger.info('Begin Fight');
                    let actionNeeded = false;
                    if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities != null) {
                        if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities.length > 0) {
                            actionNeeded = true;
                            this.wGame.actorManager.userActor.actorManager.userActor.look.bonesId = 1;
                            this.wGame.actorManager.userActor.actorManager.userActor.look.skins = this.wGame.actorManager.userActor.actorManager.userActor.look.subentities["0"].subEntityLook.skins;
                            this.wGame.actorManager.userActor.actorManager.userActor.look.scales = this.wGame.actorManager.userActor.look.subentities["0"].subEntityLook.scales;
                            this.wGame.actorManager.userActor.actorManager.userActor.look.indexedColors = this.wGame.actorManager.userActor.look.subentities["0"].subEntityLook.indexedColors;
                            this.wGame.actorManager.userActor.actorManager.userActor.look.subentities = null;
                        }
                    }
                    for (let key in this.wGame.actorManager.actors) {
                        if (+key > 0) {
                            if (this.wGame.actorManager.actors[key].look.subentities != null) {
                                actionNeeded = true;
                                this.wGame.actorManager.actors[key].look.bonesId = 1;
                                this.wGame.actorManager.actors[key].look.skins = this.wGame.actorManager.actors[key].look.subentities["0"].subEntityLook.skins;
                                this.wGame.actorManager.actors[key].look.scales = this.wGame.actorManager.actors[key].look.subentities["0"].subEntityLook.scales;
                                this.wGame.actorManager.actors[key].look.indexedColors = this.wGame.actorManager.actors[key].look.subentities["0"].subEntityLook.indexedColors;
                                this.wGame.actorManager.actors[key].look.subentities = null;
                            }
                        }
                    }
                    Logger.debug("SKIN UPDATE DONE");
                    if (actionNeeded) {
                        setTimeout(() => {
                            this.wGame.gui.mainControls._creatureModeButton.tap();
                            setTimeout(() => {
                                this.wGame.gui.mainControls._creatureModeButton.tap();
                            }, (Math.random() * (500) + 1000));
                        }, (Math.random() * (500) + 1000));
                    }
                }, (Math.random() * (500) + 500));
            } catch (ex) {
                Logger.info(ex);
            }
        }

        // Wait begin fight
        this.on(this.wGame.dofus.connectionManager, 'GameFightNewRoundMessage', toggle);
    }
}
