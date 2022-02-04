import {Mod} from "../mod";
import {iconIdByTypeId, Resource, Resources, ressourcesToSkip} from "./resources";
import {ShortcutsHelper} from "@helpers/shortcuts.helper";

import {MapComplementaryInformationsDataMessage, StatedElementUpdatedMessage, InteractiveElementData, StatedElementData} from "../../types/message.types";

export class ShowResources extends Mod {
    private shortcutsHelper: ShortcutsHelper;
    private loadDataTry: number = 0;

    private data: Map<number, Resources> = new Map();
    private elemIdToTypeid: Map<number, number> = new Map();

    private resourcesBox: HTMLDivElement;
    private enabled: boolean = true;
    private isHide: boolean = false;

    startMod(): void {
        this.params = this.settings.option.vip.general;

        if(this.params.show_resources) {
            Logger.info('- Enabled ShowRessources');

            const resourcesBoxCss = document.createElement('style');
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
                    background: rgba(120, 120, 120, 0.25);
                    box-shadow: #505050 1px 1px 2px;
                    text-shadow: 0 0 5px #000;
                }

                .resource-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0 5px;
                    margin: 0 5px;
                    border-radius: 4px;
                    background-color: #6b6b6b33;
                    font-weight: bold;
                    font-size: 12px;
                }

                .resource-item div {
                    height: 35px;
                }

                .resource-item p {
                    margin: 0;
                }

                .resource-item img {
                    width: 35px;
                }
            `;

            this.wGame.document.querySelector('head').appendChild(resourcesBoxCss);

            this.shortcutsHelper = new ShortcutsHelper(this.wGame);
            this.shortcutsHelper.bind(this.params.show_resources_shortcut, () => this.toggle());

            this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', (e: MapComplementaryInformationsDataMessage) => this.onMapComplementaryInfos(e.interactiveElements, e.statedElements));
            this.on(this.wGame.dofus.connectionManager, 'StatedElementUpdatedMessage', (e: StatedElementUpdatedMessage) => this.onStatedElementUpdated(e.statedElement));
            this.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', () => {
                if (this.enabled) {
                    this.toggle();
                }
            });

            this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage', () => this.isHide = false);
            this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', () => this.isHide = false);

            setTimeout(() => this.loadMapInfoOnStart(), 100);
        }
    }

    /**
     * Use to load map informations when player activate mod in game
     */
    private loadMapInfoOnStart() {
        if (this.wGame.isoEngine.mapRenderer.isReady) {
            const interactiveElements = [];
            const statedElements = [];

            // Get data from isoEngine
            const interactives = this.wGame.isoEngine.mapRenderer.interactiveElements;
            const stated = this.wGame.isoEngine.mapRenderer.statedElements;

            // Push data in Array
            for(const i in interactives) { interactiveElements.push(interactives[i]); }
            for(const s in stated) { statedElements.push({elementId: stated[s].id, elementState: stated[s].state}); }

            this.loadDataTry = 0;
            this.onMapComplementaryInfos(interactiveElements, statedElements);
        } else if (this.loadDataTry < 15) {
            this.loadDataTry++;
            setTimeout(() => this.loadMapInfoOnStart(), 100);
        } else {
            this.loadDataTry = 0;
        }
    }

    private onMapComplementaryInfos(interactiveElements: InteractiveElementData[], statedElements: StatedElementData[]) {
        this.clear();

        const statedMap: Map<number, number> = new Map();
        statedElements.forEach((s) => statedMap.set(s.elementId, s.elementState));

        // create all resources and add state
        interactiveElements.forEach((i) => {
            const r: Resource = {elementId: i.elementId,
                                 elementTypeId: i.elementTypeId,
                                 name: i._name,
                                 elementState: statedMap.get(i.elementId)};

            // update resource if exist else create new
            if (this.data.has(r.elementTypeId)) {
                this.data.get(r.elementTypeId).addOrUpdateResource(r);
            } else if (!ressourcesToSkip.includes(r.elementTypeId)) {
                this.data.set(r.elementTypeId, new Resources(r));
                if (iconIdByTypeId[r.elementTypeId] == undefined) console.log('Unknow ressource "' + r.name + '" with typeId = ' + r.elementTypeId);
            }

            this.elemIdToTypeid.set(i.elementId, i.elementTypeId);
        });

        if (this.enabled && !this.isHide) {
            this.create();
        }
    }

    /**
     * Update the target element
     * @param statedElement Element to update
     */
    private onStatedElementUpdated(statedElement: any) {
        setTimeout(() => {
            const typeId: number = this.elemIdToTypeid.get(statedElement.elementId);

            try {
                this.data.get(typeId).addOrUpdateResource({elementId: statedElement.elementId,
                    elementTypeId: typeId,
                    elementState: statedElement.elementState,
                    name: ''});
            } catch {
                console.error('Unabled to update resource with typeId = ' + typeId);
            }

            if (this.enabled) this.updateResourceInDom(typeId);
        }, 500);
    }

    private updateResourceInDom(typeId: number) {
        const r: HTMLElement = this.wGame.document.getElementById('sr_' + typeId + '_count');
        r.innerText = this.data.get(typeId).getCount();
    }

    private create() {
        this.isHide = false;
        this.enabled = true;

        this.resourcesBox = this.wGame.document.createElement('div');
        this.resourcesBox.id = 'resourcesBox';

        this.data.forEach(resource => {
            let item = `<div class="resource-item"> <div>`;

            resource.getIcon().forEach((icon) => {
                item += `<img src="${icon}" alt=""/>`;
            });

            item += `</div>
                    <p>${resource.name}</p>
                    <p id="sr_${resource.typeId}_count">${resource.getCount()}</p>
                </div>
            `;
            this.resourcesBox.insertAdjacentHTML('beforeend', item);
        });

        // Insert element in DOM & center
        if (this.resourcesBox.innerHTML != '') {
            this.wGame.foreground.rootElement.appendChild(this.resourcesBox);
            const boxWidth: number = this.resourcesBox.offsetWidth / 2;
            this.resourcesBox.style.left = `calc(50% - ${boxWidth}px)`;
        }
    }

    private toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.isHide = true;
            this.clearHtml();
        } else {
            this.isHide = false;
            this.create();
        }
    }

    private clearHtml() {
        if (this.resourcesBox && this.resourcesBox.parentElement) {
            this.resourcesBox.parentElement.removeChild(this.resourcesBox);
        }
    }

    private clear() {
        if (this.data) this.data.clear();
        this.clearHtml();
    }

    public reset(): void {
        super.reset();
        this.wGame.document.getElementById('resourcesBoxCss')?.remove();
        this.clear();
    }
}
