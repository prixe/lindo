import { MapComplementaryInformationsDataMessage } from "app/types/message.types";
import { ShortcutsHelper } from "../../helpers/shortcuts.helper";
import { CustomWindowHelper } from "../../helpers/windowHelper/customWindow.helper";
import { DraggableWindowHelper } from "../../helpers/windowHelper/draggableWindow.helper";
import { Mod } from "../mod";

export class DtMap extends Mod {
    private readonly dtmapUrl: string = 'https://dev.dofus-touch-map.com';

    private shortcutsHelper: ShortcutsHelper;
    private windowHelper: CustomWindowHelper;

    private window: DraggableWindowHelper;
    private iframe: HTMLIFrameElement;
    private iframeWindow: Window;

    startMod() {
        this.params = this.settings.option.vip.general;

        // Initialize helper
        this.windowHelper = new CustomWindowHelper(this.wGame);
        this.shortcutsHelper = new ShortcutsHelper(this.wGame);

        // Define and apply css
        let dtmapCss = document.createElement('style');
        dtmapCss.id = 'dtmapCss';
        dtmapCss.innerHTML = `
            #dtmap {
                min-width: 50vw; min-height: 30vh;
                left: 0;
                top: 0;
            }
            #dtmap .windowBody {
                padding: 0 0 4px 0 !important;
            }
            #dtmap-iframe {
                border: none;
                width: 100%;
                height: 100%;
            }
        `;
        this.wGame.document.querySelector('head').appendChild(dtmapCss);

        // Set shortcut to open map
        this.shortcutsHelper.bind(this.params.dtmap_shortcut, () => this.toggle() );
        // Create window
        this.window = this.windowHelper.getWindow();

        // Set Listener
        this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', (e: MapComplementaryInformationsDataMessage) => this.updatePlayerMarker(e))

        this.createWindow();
    }

    private createWindow() {
        this.window.createDofusWindow("Dofus Touch Map", "dtmap")
                    .makeDraggable()
                    .makeResizable()
                    .addFullScreenButton();

        this.iframe = this.wGame.document.createElement("iframe");
        this.iframe.id = "dtmap-iframe";
        this.iframe.src = this.dtmapUrl;

        this.window.addContent(this.iframe).hide();

        this.iframe.addEventListener('load', () => {
            this.iframeWindow = this.iframe.contentWindow;
        });
    }

    private updatePlayerMarker(data: MapComplementaryInformationsDataMessage) {
        if (data.mapId === this.wGame?.gui?.playerData?.position?.mapPosition?.id && this.iframeWindow) {
            var pos = {
              // Maybe use "gui.playerData.position.coordinates.posX" for coord in underground map
              x: this.wGame?.gui?.playerData?.position?.mapPosition?.posX,
              y: this.wGame?.gui?.playerData?.position?.mapPosition?.posY,
            };
            // Update marker on dtmap-iframe
            this.iframeWindow.postMessage({type: 'updatePlayerMarker', pos}, this.dtmapUrl);
        }
        else setTimeout(() => this.updatePlayerMarker(data), 200);
    }


    private toggle() {
        if (this.window.isVisible()) this.window.hide();
        else this.window.show();
    }

    public reset() {
        super.reset();
        this.window.destroy();
        this.wGame.document.getElementById('dtmapCss')?.remove;
    }
}