export class Resources {
  public readonly name: string
  public readonly typeId: number
  private resources: { elemId: number; state: State }[] = []

  constructor(resource: Resource) {
    this.name = resource.name
    this.typeId = resource.elementTypeId
    this.addOrUpdateResource(resource)
  }

  public addOrUpdateResource(resource: Resource) {
    const ref = this.resources.find((r) => r.elemId === resource.elementId)
    if (ref) ref.state = resource.elementState
    else this.resources.push({ elemId: resource.elementId, state: resource.elementState })
  }

  public getCount(): string {
    return this.getCountOfRessourcesCanBeUsed() + '/' + this.getTotalCount()
  }

  public getIcon(): Array<string> {
    const iconId = iconIdByTypeId[this.typeId]
    const result: Array<string> = []

    if (iconId === undefined) {
      result.push('./assets/ui/icons/fail.png')
    } else if (typeof iconId === 'string') {
      result.push(
        'https://dofustouch.cdn.ankama.com/assets/2.34.8_kbu_6h45kmUJaqYJSzE(uwaos..pYYKs/gfx/items/' + iconId + '.png'
      )
    } else {
      iconId.forEach((iconId: string) => {
        result.push(
          'https://dofustouch.cdn.ankama.com/assets/2.34.8_kbu_6h45kmUJaqYJSzE(uwaos..pYYKs/gfx/items/' +
            iconId +
            '.png'
        )
      })
    }

    return result
  }

  public getTotalCount(): number {
    return this.resources.length
  }

  public getCountOfRessourcesCanBeUsed(): number {
    return this.resources.filter((r) => r.state === State.canUse).length
  }
}

export interface Resource {
  elementId: number
  elementTypeId: number
  name: string
  elementState: State
}

export enum State {
  canUse,
  cantUse,
  inUse
}

export const iconIdByTypeId: Record<number, string | Array<string>> = {
  // General
  84: '15026', // eau
  146: '89002', // paquet cadeau

  // Paysan
  38: '34009', // blé
  39: '34080', // houblon
  42: [
    // lin
    '34122', // paysan
    '35117' // alchimiste
  ],
  43: '34082', // orge
  44: '34082', // seigle
  45: '34154', // avoine
  46: [
    // chanvre
    '34121', // paysan
    '35156' // alchimiste
  ],
  47: '34083', // malt
  111: '34010', // riz
  134: '34552', // frostiz

  // Bucheron
  1: '38017', // frêne
  8: '38092', // chêne
  28: '38094', // if
  29: '38073', // ebène
  30: '38140', // orme
  31: '38153', // erable
  32: '38138', // charme
  33: '38086', // châtaignier
  34: '38095', // noyer
  35: '38139', // merisier
  98: '38482', // bombu
  101: '38481', // oliviolet
  108: '38673', // bambou
  109: '38672', // bambou sombre
  110: '38671', // bambou sacré
  121: '38001', // kaliptus
  133: '38677', // trembe

  // Alchimiste
  61: '35191', // edelweiss
  66: '36052', // menthe sauvages
  67: '36067', // trèfle à 5 feuilles
  68: '35192', // orchidée freyesque
  112: '58067', // pandouille
  131: '35635', // perce-neige

  // Mineur
  17: '39024', // fer
  24: '39028', // argent
  25: '39022', // or
  26: '39076', // pierre de beauxite
  37: '39077', // pierre de kobalte
  52: '39078', // etain
  53: '39108', // pierre cuivrée
  54: '39397', // manganèse
  55: '39109', // bronze
  113: '39110', // dolomite
  114: '39111', // silicate
  135: '39112', // obsidienne

  // Pecheur
  71: [
    // Petits poissons (mer)
    '41292', // greu-vette
    '41273', // crabe sourimi
    '41269' // poisson pané
  ],
  74: [
    // Poissons (rivière)
    '41394', // truite
    '41277', // poisson-Chaton
    '41305', // carpe d'iem
    '41400' // brochet
  ],
  75: [
    // Petits poissons (rivière)
    '41294', // goujon
    '41394', // truite
    '41277' // poisson-Chaton
  ],
  76: [
    // Gros poissons (rivière)
    '41277', // poisson-Chaton
    '41305', // carpe d'iem
    '41400', // brochet
    '41290' // bar rikain
  ],
  77: [
    // Poissons (mer)
    '41273', // crabe sourimi
    '41269', // poisson pané
    '41309', // kralamoure
    '41317' // sardine brillante
  ],
  78: [
    // Gros poissons (mer)
    '41269', // poisson pané
    '41317', // sardine brillante
    '41309', // kralamoure
    '41296' // raie bleue
  ],
  79: [
    // Poissons géant (rivière)
    '41400', // brochet
    '41305', // carpe d'iem
    '41290', // bar rikain
    '41313' // perche
  ],
  80: '41395', // Truite Vaseuse
  81: [
    // Poissons géants (mer)
    '41317', // sardine brillante
    '41309', // kralamoure
    '41296', // raie bleue
    '41322' // requin marteau-faucille
  ],
  132: [
    // Poisson de Frigost
    '41403', // poisskaille
    '41271' // poisson igloo
  ],
  225: '170877' // piraniak
  /*
    ??:'41405',     // pichon Eud'Compet
     */
}

export const ressourcesToSkip: number[] = [
  -1, // undefined
  2, // Scie
  11, // Table de confection
  12, // Atelier
  13, // Etabli
  15, // Chaudron
  16, // Zaap
  22, // Four
  27, // Moule
  40, // Moulin
  41, // Meule
  48, // Tas de patates
  49, // Table à Patates
  50, // Concasseur
  56, // Source de jouvence
  57, // Enclume
  58, // Machine à Coudre
  60, // Marmite
  62, // Alembic
  63, // Froment
  64, // Epeautre
  65, // Sorgho
  69, // Mortier & Pilon
  70, // Porte
  72, // Somoon Agressif
  73, // Pwoulpe
  82, // Coton
  83, // Fileuse
  85, // Coffre
  86, // Machine à Coudre
  88, // Etabli en bois
  90, // Alambic
  92, // Enclume magique
  93, // Concasseur Munster
  94, // Plan de Travail
  95, // Plan de travail
  96, // Plan de Travail
  97, // Plan de Travail
  99, // Ombre étrange
  100, // Pichon
  102, // Machine de force
  103, // Etabli Pyrotechnique
  105, // Poubelle
  106, // Zaapi
  107, // Enclume à boucliers
  115, // Quibougent
  116, // Machine à Coudre Magique
  117, // Atelier Magique
  118, // Table Magique
  119, // Liste des artisans
  120, // Enclos
  122, // Atelier de bricolage
  127, // Levier
  128, // Statue de classe
  129, // [NO_TRAD]Any IE
  136, // Coquillage
  137, // Machine à coudre de Poss'Ybel
  138, // Fabrique de Trophées
  139, // Table de cuisine de mauvaise qualité
  140, // Atelier de mauvaise qualité
  141, // Établi de mauvaise qualité
  142, // Machine à coudre de mauvaise qualité
  143, // Machine à jouets
  144, // Pressoir à poisson
  145, // Atelier d'Emballage
  147, // Atelier d'emballage de cadeaux
  148, // Atelier des alchimistes
  149, // Atelier des bijoutiers
  150, // Atelier des bouchers
  151, // Atelier des bouchers et chasseurs
  152, // Atelier des boucliers
  153, // Atelier des boulangers
  154, // Atelier des bricoleurs
  155, // Atelier des bûcherons
  156, // Atelier des chasseurs
  157, // Atelier des cordonniers
  158, // Atelier des forgemages
  159, // Atelier des forgerons
  160, // Atelier des mineurs
  161, // Atelier des paysans
  162, // Atelier des poissonniers
  163, // Atelier des poissonniers et pêcheurs
  164, // Atelier des pêcheurs
  165, // Atelier des sculpteurs
  166, // Atelier des tailleurs
  167, // Arène
  168, // Banque
  169, // Bar Akouda
  170, // Bibliothèque
  171, // Boutiques de Nowel
  172, // Dojo
  173, // Église
  174, // Épicerie
  175, // Fabricant de skis
  176, // Hôtel de ville
  177, // Hôtel des métiers
  178, // Kanojedo
  179, // Kolizéum
  180, // Milice
  181, // Médecin de Frigost
  182, // Taverne
  183, // Taverne Alakarte
  184, // Taverne Atolmond
  185, // Taverne d'Argent
  186, // Taverne de Djaul
  187, // Taverne de la Bagrutte
  188, // Taverne de la Chopenbois
  189, // Taverne de la Misère
  190, // Taverne de la Tabasse
  191, // Taverne de Lisa Kaya
  192, // Taverne de Sakaï
  193, // Taverne du Bwork
  194, // Taverne du Chabrulé
  195, // Taverne du Dernier Refuge
  196, // Taverne du Ferayeur
  197, // Taverne du Feubuk
  198, // Taverne du Pandawa Ivre
  199, // Taverne du Paradis Frigostien
  200, // Taverne du Pinchaut
  201, // Taverne du Ripate
  202, // Temple des guildes
  203, // Tour de Brâkmar
  204, // Tour des archives
  205, // Tour des ordres
  206, // Sous-marin Steamer
  207, // Autel
  208, // Krosmaster
  209, // Atelier d'Isidor Fèvre
  210, // Atelier d'Al Shab
  211, // Atelier de Frigostine
  212, // Atelier de Francky
  213, // Atelier de Dutch
  214, // Atelier de Brokkeitri
  215, // Atelier de Laurent Part
  216, // Atelier de Clarisse Tosha
  217, // Atelier d'Annette Daimpeau
  218, // Atelier de Carla Garfield
  219, // Métier d'Avenir
  220, // Tonneau d'explosifs
  221, // Fleur de Sutol
  222, // Barbecue
  223, // Cawotte fraîche
  224 // Alambic patiné de l'hôtel des métiers
]
