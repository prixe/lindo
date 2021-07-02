import {Mod} from "../mod";

/**
* This mod add the possibility to hide mount and pet durring fight
*/
export class HideMount extends Mod
{
    private static removeMountToPlayer(player): void {
        player.look.bonesId = 1;

        // Character size
        player.look.scales = [140];

        // Colors
        if (player.look.subentities["0"].subEntityLook.indexedColors.length > 0) {
            player.look.indexedColors = player.look.subentities["0"].subEntityLook.indexedColors;
        }

        // Remove mount
        if (player.look.subentities["0"].subEntityLook.skins.length > 0) {
            player.look.skins = player.look.subentities["0"].subEntityLook.skins;
        }

        // Remove pet and mount
        player.look.subentities = null;
    }

    startMod(): void {
        this.params = this.settings.option.vip.general.hidden_mount;
        if (this.params) {
            Logger.info('- enable Hide-Mount');
            const hideMount = () => {
                try {
                    let actionNeeded = false;
                    // Main character
                    if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities != null) {
                        if (this.wGame.actorManager.userActor.actorManager.userActor.look.subentities.length > 0) {
                            actionNeeded = true;
                            HideMount.removeMountToPlayer(this.wGame.actorManager.userActor.actorManager.userActor);
                        }
                    }
                    // Other characters
                    for (const key in this.wGame.actorManager.actors) {
                        if (+key > 0) {
                            if (this.wGame.actorManager.actors[key].look.subentities != null) {
                                actionNeeded = true;
                                HideMount.removeMountToPlayer(this.wGame.actorManager.actors[key]);
                            }
                        }
                    }
                    if (actionNeeded) {
                        this.wGame.gui.mainControls._creatureModeButton.tap();
                        setTimeout(() => {
                            this.wGame.gui.mainControls._creatureModeButton.tap();
                        }, 200);
                    }
                } catch (ex) {
                    Logger.error(ex);
                }
            };

            // Wait begin fight
            this.on(this.wGame.dofus.connectionManager, 'GameFightStartMessage', hideMount);
        }
    }
}
