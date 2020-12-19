import { Logger } from "app/core/electron/logger.helper";
import { ShortcutsHelper } from "app/core/helpers/shortcuts.helper";
import { Mod } from "../mod";
import { Resources, Resource, iconIdByTypeId } from "./resources";

export class ShowResources extends Mod {
    private shortcutsHelper: ShortcutsHelper;
    
    private data: Map<number, Resources> = new Map();
    private elemIdToTypeid: Map<number, number> = new Map();
    private resourceTotal: number = 0;
    private ressourcesToSkip: number[] = [-1, 16, 105, 106, 120, 128, 168, 208];

    private resourcesBox: HTMLDivElement;
    private enabled: boolean = true;

    startMod(): void {
        this.params = this.settings.option.vip.general;

        if(this.params.show_resources) {
            Logger.info('- Enabled ShowRessources');

            let resourcesBoxCss = document.createElement('style');
            resourcesBoxCss.id = 'resourcesBoxCss';
            resourcesBoxCss.innerHTML = `
                #resourcesBox {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                    position: absolute;
                    top: 0;    
                    border: 1px solid #3e3e3e;
                    border-top: none;
                    background-color: rgba(0, 0, 0, 0.55);
                    border-radius: 0 0 5px 5px;
                    padding: 4px 2px;
                }

                .resource-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0 10px;
                }

                .resource-item p {
                    margin: 0;
                }

                .resource-item img {
                    width: 35px;
                }
            `;

            this.wGame.document.getElementsByTagName('head')[0].appendChild(resourcesBoxCss);

            this.shortcutsHelper = new ShortcutsHelper(this.wGame);
            this.shortcutsHelper.bind(this.params.show_resources_shortcut, () => this.toggle() );

            this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', (e: any) => this.onMapComplementaryInfos(e.interactiveElements, e.statedElements));
            this.on(this.wGame.dofus.connectionManager, 'StatedElementUpdatedMessage', ({statedElement}) => this.onStatedElementUpdated(statedElement));
            this.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', () => this.clearHtml());
        }
    }

    private onMapComplementaryInfos(interactiveElements: any[], statedElements: any []) {
        this.clear();

        const statedMap: Map<number, number> = new Map();
        statedElements.forEach((s) => statedMap.set(s.elementId, s.elementState));
        this.resourceTotal = interactiveElements.length;

        interactiveElements.forEach((i) => {
            const r: Resource = {elementId: i.elementId,
                                 elementTypeId: i.elementTypeId,
                                 name: i._name,
                                 elementState: statedMap.get(i.elementId)};

            if (this.data.has(r.elementTypeId)) {
                this.data.get(r.elementTypeId).addOrUpdateResource(r);
            } else if (!this.ressourcesToSkip.includes(r.elementTypeId)) {
                this.data.set(r.elementTypeId, new Resources(r));
                if (iconIdByTypeId[r.elementTypeId] == undefined) console.log('Unknow ressource "' + r.name + '" with typeId = ' + r.elementTypeId);
            }

            this.elemIdToTypeid.set(i.elementId, i.elementTypeId);
        });

        if (this.enabled) this.create();
    }

    private onStatedElementUpdated(statedElement: any) {
        setTimeout(() => {
            this.clearHtml();
            const typeId: number = this.elemIdToTypeid.get(statedElement.elementId);
            try {
                this.data.get(typeId).addOrUpdateResource({elementId: statedElement.elementId,
                    elementTypeId: typeId,
                    elementState: statedElement.elementState,
                    name: ''});
            } catch {
                console.error('Unabled to update resource with typeId = ' + typeId);
            }
            if (this.enabled) this.create();
        }, 500);
    }

    private create() {
        this.resourcesBox = this.wGame.document.createElement('div');
        this.resourcesBox.id = 'resourcesBox';

        this.data.forEach(resource => {
            let item = `
                <div class="resource-item">
                    <img src="${resource.getIcon()}"/>
                    <p>${resource.getName()}</p>
                    <p>${resource.getCount()}</p>
                </div>
            `;
            this.resourcesBox.insertAdjacentHTML('beforeend', item);
        });

        if (this.resourcesBox.innerHTML != '') {
            this.wGame.foreground.rootElement.appendChild(this.resourcesBox);
            let boxWidth: number = this.resourcesBox.offsetWidth / 2;
            this.resourcesBox.style.left = `calc(50% - ${boxWidth}px)`;
        }
    }

    private toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) this.clearHtml();
        else this.create();
    }

    private clearHtml() {
        if (this.resourcesBox && this.resourcesBox.parentElement) this.resourcesBox.parentElement.removeChild(this.resourcesBox);
    }

    private clear() {
        this.resourceTotal = 0;
        this.data.clear();
        this.clearHtml();
    }

    public reset() {
        super.reset();
        this.clear();
    }  
}
