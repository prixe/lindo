export class Resources {
    public readonly name: string;
    private typeId: number;
    private resources: {elemId: number, state: State}[] = [];

    constructor(resource: Resource) {
        this.name = resource.name;
        this.typeId = resource.elementTypeId;
        this.addOrUpdateResource(resource);
    }

    public addOrUpdateResource(resource: Resource) {
        const ref = this.resources.find(r => r.elemId == resource.elementId);
        if (ref) ref.state = resource.elementState;
        else this.resources.push({elemId: resource.elementId, state: resource.elementState});
    }

    public getCount(): string {
        return this.getCountOfRessourcesCanBeUsed() + '/' + this.getTotalCount();
    }

    public getIcon(): string {
        const iconId = iconIdByTypeId[this.typeId];
        return (iconId != undefined) ? 'https://dofustouch.cdn.ankama.com/assets/2.34.8_kbu_6h45kmUJaqYJSzE(uwaos..pYYKs/gfx/items/' + iconId + '.png' : './assets/ui/icons/fail.png';
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

export const ressourcesToSkip: number[] = [
    -1,     // undefined
    2,      // Scie
    11,     // Table de confection
    12,     // Atelier
    13,     // Etabli
    16,     // Zaap
    22,     // Four
    27,     // Moule
    41,     // Meule
    50,     // Concasseur
    57,     // Enclume
    86,     // Machine à Coudre
    90,     // Alambic
    96,     // Plan de Travail
    97,     // Plan de Travail
    105,    // Poubelle
    106,    // Zaapi
    117,    // Atelier Magique
    119,    // Liste des artisans
    120,    // Enclos
    122,    // Atelier de bricolage
    128,    // Statue de classe
    138,    // Fabrique de Trophées
    145,    // Atelier d'Emballage
    208,    // Krosmaster
]