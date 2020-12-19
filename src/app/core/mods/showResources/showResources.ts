import { Logger } from "app/core/electron/logger.helper";
import { Mod } from "../mod";

export class ShowResources extends Mod {
    private data: Map<number, Resources> = new Map();
    private elemIdToTypeid: Map<number, number> = new Map();
    private resourceTotal: number = 0;
    private ressourcesToSkip: number[] = [-1, 16, 105, 106, 120, 128, 168, 208];

    private resourcesBox: HTMLDivElement;

    startMod(): void {
        this.params = this.settings.option.vip.general;

        if(/*this.params*/true) {
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

        this.create();
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
            this.create();
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

export class Resources {
    private name: string;
    private typeId: number;
    private resources: {elemId: number, state: State}[] = [];

    constructor(resource: Resource) {
        this.name = resource.name;
        this.typeId = resource.elementTypeId;
        this.addOrUpdateResource(resource);
    }

    public addOrUpdateResource(resource: Resource) {
        if (this.resources.length > 0 && this.resources.find(r => r.elemId == resource.elementId) != undefined) {
            this.resources.find(r => r.elemId == resource.elementId).state = resource.elementState;
        } else {
            this.resources.push({elemId: resource.elementId, state: resource.elementState});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCount(): string {
        return this.getCountOfRessourcesCanBeUsed() + '/' + this.getTotalCount();
    }

    public getIcon(): string {
        const iconId = iconIdByTypeId[this.typeId];
        return (iconId != undefined) ? 'https://dofustouch.cdn.ankama.com/assets/2.34.8_kbu_6h45kmUJaqYJSzE(uwaos..pYYKs/gfx/items/' + iconId + '.png' : '';
    }

    public getTotalCount():number {
        return this.resources.length;
    }

    public getCountOfRessourcesCanBeUsed(): number {
        return this.resources.filter(r => r.state == State.canUse).length;
    }
}

export interface Resource {
    elementId: number;
    elementTypeId: number;
    name: string;
    elementState: State;
}

export enum State { canUse, cantUse, inUse }

export const iconIdByTypeId: any = {
    // General
    84: '15026',    // eau
    // Paysan
    38: '34009',    // blé
    39: '34080',    // houblon
    42: '34122',    // lin
    43: '34082',    // orge
    44: '34082',    // seigle
    45: '34154',    // avoine
    46: '34121',    // chanvre
    47: '34083',    // malt
    111: '34010',   // riz
    134: '34552',   // frostiz
    // Bucheron
    1: '38017',     // frêne
    8: '38092',     // chêne
    28: '38094',    // if
    29: '38073',    // ebène
    30: '38140',    // orme
    31: '38153',    // erable
    32: '38138',    // charme
    33: '38086',    // châtaignier
    34: '38095',    // noyer
    35: '38139',    // merisier
    98: '38482',    // bombu
    101: '38481',   // oliviolet
    108: '38673',   // bambou
    109: '38672',   // bambou sombre
    110: '38671',   // bambou sacré
    121: '38001',   // kaliptus
    133: '38677',   // trembe
    // Alchimiste
    //42: '35117',    // lin
    //46: '35156',    // chanvre
    61: '35191',    // edelweiss
    66: '36052',    // menthe sauvages
    67: '36067',    // trèfle à 5 feuilles
    68: '35192',    // orchidée freyesque
    112: '58067',   // pandouille
    131: '35635',   // perce-neige
    // Mineur
    17: '39024',    // fer
    24: '39028',    // argent
    25: '39022',    // or
    26: '39076',    // pierre de beauxite
    37: '39077',    // pierre de kobalte
    52: '39078',    // etain
    53: '39108',    // pierre cuivrée
    54: '39397',    // manganèse
    55: '39109',    // bronze
    113: '39110',   // dolomite
    114: '39111',   // silicate
    135: '39112',   // obsidienne
}