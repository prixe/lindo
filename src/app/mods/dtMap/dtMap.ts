import { ShortcutsHelper } from "../../helpers/shortcuts.helper";
import { CustomWindowHelper } from "../../helpers/windowHelper/customWindow.helper";
import { DraggableWindowHelper } from "../../helpers/windowHelper/draggableWindow.helper";
import { Mod } from "../mod";

export class DtMap extends Mod {
    private shortcutsHelper: ShortcutsHelper;
    
    private windowHelper: CustomWindowHelper;
    private window: DraggableWindowHelper;
    private iframe: HTMLIFrameElement;

    startMod() {
        this.params = this.settings.option.vip.general;

        this.windowHelper = new CustomWindowHelper(this.wGame);
        this.window = this.windowHelper.getWindow();

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

        this.shortcutsHelper = new ShortcutsHelper(this.wGame);
        this.shortcutsHelper.bind(this.params.dtmap_shortcut, () => this.toggle() );

        this.createWindow();
    }

    private createWindow() {
        this.window.createDofusWindow("Dofus Touch Map", "dtmap")
                    .makeDraggable()
                    .makeResizable()
                    .addFullScreenButton();

        this.iframe = document.createElement("iframe");
        this.iframe.id = "dtmap-iframe";
        this.iframe.src = "https://www.dofus-touch-map.com";

        this.window.addContent(this.iframe).hide();
    }

    private toggle() {
        if (this.window.isVisible()) this.window.hide();
        else this.window.show();
    }
    
}