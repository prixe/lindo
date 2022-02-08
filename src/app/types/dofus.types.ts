// Used for accept all
interface Base {
    [key: string]: any
}

interface DofusCommunication extends Base {
    connectionManager: ConnectionManager,
    sendMessage: (message: string, data: any) => void,
}

interface FighterDataStats extends Base {
    actionPoints: number,
    maxActionPoints: number,
}

interface FighterDataDisposition extends Base {
    cellId: string,
}

interface FighterData extends Base {
    alive: boolean,
    disposition: FighterDataDisposition,
    isCreature: boolean,
    stats: FighterDataStats,
    teamId: number,
}

interface Fighter extends Base {
    data: FighterData,
    id: number,
}

interface FightManager extends Base {
    fightId: number,
    fightState: number,
    finishTurn: () => void,
    getFighter: (fighterId: number) => Fighter,
    getFighters: () => number[],
    turnCount: number,
    _fighters: { [actorId: number]: Fighter },
}

interface ClassicParty extends Base {
    partyLeaderId: number,
}

interface MemberData extends Base {
    id: number,
    level: number,
    mapId: number,
    prospecting: number,
}

interface PartyMember extends GuiObject {
    memberData: MemberData,
}

interface CurrentParty extends Base {
    partyLeaderId: number,
    getChildren: () => PartyMember[],
    _childrenList: PartyMember[],
}

interface Party extends Base {
    classicParty: ClassicParty,
    currentParty: CurrentParty,
}

interface CharacterBreed extends Base {
    id: number,
    descriptionId: string,
    longNameId: string,
    shortNameId: string,
}

interface EntityLook extends Base {
    _type: string,
    bonesId: number,
    skins: any,
    indexedColors: any,
    scales: any,
    subentities: any,
    speed: number,
}
interface CharacterBaseInformations extends Base {
    _type: string,
    breed: number,
    entityLook: EntityLook,
    id: number,
    level: number,
    name: string,
    speed: number,
    sex: boolean
}

interface Wisdom extends Base {
    getTotalStat: () => number,
}

interface PlayerCharacterCharacteristics extends Base {
    actionPointsCurrent: number,
    energyPoints: number,
    experience: number,
    kamas: number,
    lifePoints: number,
    maxLifePoints: number,
    wisdom: Wisdom,
    statsPoints: number,
    experienceNextLevelFloor: number,
    experienceLevelFloor: number
}

interface SpellDesc extends Base {
    id: number,
    nameId: string,
}

interface Spell extends Base {
    id: number,
    isItem: boolean,
    isLoaded: boolean,
    level: number,
    ownerId: number,
    position: number,
    spell: SpellDesc,
}

interface SpellData extends Base {
    spells: Spell[],
}

interface PlayerCharacter extends Base {
    characteristics: PlayerCharacterCharacteristics,
    spellData: SpellData,
}

interface Characters extends Base {
    mainCharacter: PlayerCharacter,
    mainCharacterId: number,
    regenRate: number,
    regenTimer: number,
}

interface Position2D extends Base {
    posX: number,
    posY: number
}

interface MapPosition extends Position2D {
    _type: string,
    id: number,
    outdoor: boolean,
    capabilities: number,
    subAreaId: number,
    worldMap: number,
    hasPriorityOnWorldmap: boolean,
}

interface Area extends Base {
    _type: string,
    id: number,
    nameId: string,
    superAreaId: number,
    containHouses: boolean,
    containPaddocks: boolean,
    bounds: any
}

interface SubArea extends Base {
    _type: string,
    id: number,
    nameId: string,
    areaId: number,
    level: number,
    capturable: boolean,
}

interface SuperArea extends Base {
    id: number,
    nameId: string,
    worldmapId: number
}

interface Position extends Base {
    area: Area,
    coordinates: Position2D,
    isInMyHouse: boolean,
    mapId: number,
    mapPosition: MapPosition,
    subAreaId: number,
    subArea: SubArea,
    superArea: SuperArea,
    worldmapId: number,
}

interface Identification extends Base {
    accountCreation: number,
    accountId: number,
    login: string,
    subscriptionEndDate: number,
}

interface ItemType extends Base {
    id: number,
    nameId: string,
}

interface Item extends Base {
    id: number,
    level: number,
    type: ItemType,
    typeId: number,
}

interface InventoryItem extends Base {
    id: number,
    item: Item,
    objectGID: number,
    objectUID: number,
    position: number,
    quantity: number,
    shortName: string,
    weight: number,
}

interface EquippedItem extends Base {
    id: number,
    objectUID: number,
    shortName: string,
    weight: number
}

interface Inventory extends Base {
    goultines: number,
    isLoaded: boolean,
    kamas: number,
    maxWeight: number,
    objects: {[objectUID: number]: InventoryItem},
    weight: number,
    equippedItems: {[objectPlaceId: number]: EquippedItem},
}

interface Alliance extends Base {
    getPrismBonusPercent: (subAreaId: number) => number,
}

interface GuildMemberInfo extends Base {
    experienceGivenPercent: number,
}

interface Guild extends Base {
    current: number|null,
    getGuildMemberInfo: (playerId: number) => GuildMemberInfo,
}

interface PartyData extends Base {
    _dangerSetting: boolean,
    arenaStats: any,
    _partyFromId: {[partyId: string]: any}
}

interface PlayerData extends Base {
    actionPoints: number,
    alliance: Alliance,
    characterBreed: CharacterBreed
    characterBaseInformations: CharacterBaseInformations,
    characters: Characters,
    guild: Guild,
    id: number,
    identification: Identification,
    inventory: Inventory,
    isFightLeader: boolean,
    isFighting: boolean,
    isRiding: boolean,
    isSpectator: boolean,
    experienceFactor: number,
    jobs: any,
    lifePoints: number,
    maxLifePoints: number,
    movementPoints: number,
    loginName: string,
    mountXpRatio: number,
    partyData: PartyData,
    position: Position,
    state: number,
}

export interface GuiObject extends Base {
    rootElement: HTMLElement,
    getChildren: () => GuiObject[],
    _childrenList: GuiObject[],
    setValue?: (any) => void,
    tap?: () => void,
}

interface InteractGuiObject extends GuiObject {
    tap: () => void,
}

interface NpcDialogUI extends Base {
    replies: string[],
    replyBoxes: GuiObject[],
}

export interface GuiWindow extends GuiObject {
    close: () => void,
    id: string,
    isVisible: () => boolean,
    on: (event: string, callback: (e?: any) => void) => this,
    hide: () => void,
}

interface WindowsContainer extends Base {
    getChildren: () => GuiWindow[],
    _childrenList: GuiWindow[]
}

interface ShortcutBarSlot extends InteractGuiObject {
    on: (action: string, callback: () => void) => void,
    isDisabled: boolean,
    selected: boolean
}

interface ShortcutBarSlots extends Base {
    slotList: ShortcutBarSlot[],
}

interface ShortcutBarPanels extends Base {
    item: ShortcutBarSlots,
    spell: ShortcutBarSlots,
}

interface ShortcutBar extends Base {
    _panels: ShortcutBarPanels,
}

interface MenuBar extends GuiObject {
    _icons: GuiObject,
}

interface MainControls extends Base {
    buttonBox: GuiObject,
    getChildren: () => GuiWindow[],
    _childrenList: GuiWindow[],
    _creatureModeButton: GuiObject,
}

interface FightControlButtons extends Base {
    toggleReadyForFight: () => void,
}

interface IScrollIndicator extends Base {
    options: {
        listenX: boolean,
        listenY: boolean
    },
    wrapper: HTMLElement,
}

interface IScroll extends GuiObject {
    indicators: IScrollIndicator[],
    refresh: () => void,
    options: {
        scrollX: boolean,
        scrollY: boolean
    },
}

interface FighterListScrollerGui extends GuiObject {
    iScroll: IScroll,
}

interface Timeline extends Base {
    fightControlButtons: FightControlButtons
    fighterList: GuiObject,
    fighterListScroller: FighterListScrollerGui,
}

interface NumberInputPad extends Base {
    isVisible: () => boolean,
}

interface SentMessage extends Base {
    message: string,
}

interface SentMessageHistory extends Base {
    getCurrentEntry: () => SentMessage[],
    goBack: () => void,
    goForward: () => void,
}

interface ChatInput extends Base {
    inputChat: GuiObject,
    sentMessageHistory: SentMessageHistory,
}

interface Chat extends Base {
    activate: () => void,
    active: boolean,
    chatInput: ChatInput,
    deactivate: () => void,
    logMsg: (message: string) => void,
}

interface NotificationBar extends Base {
    currentOpenedId: number,
    dialogs: GuiObject[],
    _elementIsVisible: boolean,
}

interface ShopFloatingToolbar extends Base {
    hide: () => void,
    show: () => void,
    _childrenList: GuiObject[]
}

interface Marker extends Base {}

interface Compass {
    markers: {[markerId: string]: Marker}
}

interface DofusGUI extends GuiObject {
    chat: Chat,
    compass: Compass,
    fightManager: FightManager,
    isConnected: boolean,
    mainControls: MainControls,
    menuBar: MenuBar,
    notificationBar: NotificationBar,
    npcDialogUi: NpcDialogUI,
    numberInputPad: NumberInputPad,
    party: Party,
    playerData: PlayerData,
    shopFloatingToolbar: ShopFloatingToolbar
    shortcutBar: ShortcutBar,
    timeline: Timeline,
    windowsContainer: WindowsContainer
}

interface DofusState extends Base {
    activityInterval: number,
    hasSeenActivity: boolean,
    isConnected: boolean,
    isInactive: boolean,
    isListening: boolean,
    lastActivityTime: number,
    pingInterval: number,
    recordActivity: () => void,
}

interface DofusConfig extends Base {
    assetsUrl: string,
    dataUrl: string,
}

interface ActorLook extends Base {
    subentities: any[],
}

interface ActorStaticInfos extends Base {
    mainCreatureLightInfos: ActorData,
    nameId: string,
    underlings?: ActorData[]
}

interface NpcData extends Base {
    actions: number[],
    actionsName: string[],
    id: number,
    look: string,
    nameId: string,
}

interface ActorData extends Base {
    actorId: number,
    ageBonus: number,
    npcData?: NpcData,
    npcId?: number,
    staticInfos: ActorStaticInfos
    type: string,
}

interface Actor extends Base {
    actorId: number,
    actorManager: ActorManager,
    canMoveDiagonally: boolean,
    cancelMovement: (newMovement: () => void) => void,
    cellId: number,
    data: ActorData,
    direction: number,
    isDead: boolean,
    isDisplayed: boolean,
    isMerchant: () => boolean,
    isRiding: boolean,
    look: ActorLook,
    moving: boolean,
}

interface ActorManager extends Base {
    actors: Actor[],
    getActor: (userId: number) => Actor,
    getIndexedVisibleActors(): () => { [actorId: number]: Actor },
    getOccupiedCells: (cellId: number) => { [cellId: number]: Cell[]},
    userActor: Actor,
    userId: number,
    _occupiedCells: { [id: number]: Cell[] },
}

interface Coord2D extends Base {
    x: number,
    y: number,
}

interface Cell extends Base {
    actorId: number,
    cellId: number,
    direction: string,
}

interface MapCellData extends Base {
    l?: number,
}

interface Map extends Base {
    topNeighbourId: number,
    bottomNeighbourId: number,
    leftNeighbourId: number,
    rightNeighbourId: number,
    shadowBonusOnEntities: number,
    cells: {[cellId: number]: MapCellData[]},
    midgroundLayer: {[cellId: number]: MapCellData[]},
}

interface MapGrid extends Base {
    grid: [Cell[]],
}

interface EnabledSkill extends Base {
    skillId: number,
    skillInstanceUid: number,
}

export interface InteractiveElement extends Base {
    elementId: number,
    elementTypeId: number,
    enabledSkills: EnabledSkill[],
    _name: string,
    _type: string,
}

export interface StatedElement extends Base {
    id: number,
    isDisplayed: boolean,
    _x: number,
    _y: number,
}

interface CellData {
    cell: number
}

interface MapRenderer extends Base {
    getCellId: (posX, posY) => CellData,
    getCellSceneCoordinate: (cellId: number) => Coord2D,
    getChangeMapFlags: (cellId: number) => string[],
    grid: MapGrid,
    interactiveElements: { [id: number]: InteractiveElement },
    isWalkable: (cellId: number) => boolean,
    map: Map,
    mapScene: MapScene,
    mapId: number,
    statedElements: StatedElement[],
}

interface LindoMapScene extends Base {
    _refreshAreasBackup: () => void,
}

interface MapScene extends LindoMapScene {
    name: string,
    viewWidth: number,
    viewHeight: number,
    convertSceneToCanvasCoordinate: (x: number, y: number) => Coord2D,
    _refreshAreas: () => void,
}

interface Background extends Base {
    render: () => void,
}

type Direction = "top" | "bottom" | "left" | "right" | false;

interface CellRangeDataTransformState extends Base {
    a: number,
    r: number,
    g: number,
    b: number
}

interface CellRangeData extends Base {
    transformState: CellRangeDataTransformState
}

interface SpellRangeLayer extends Base {
    cellInfos: {[cellId: number]: CellRangeData }
}

interface IsoEngine extends Base {
    actorManager: ActorManager,
    attackActor: (actorId: number) => void,
    background: Background,
    gotoNeighbourMap: (direction: Direction, cellId: number, x: number, y: number) => void,
    isInGame: boolean,
    mapRenderer: MapRenderer,
    mapScene: MapScene,
    useInteractive: (elemId: number, skillInstanceUid: number) => void,
    userId: number,
    _castSpellImmediately: (number) => void,
    _movePlayerOnMap: (cellId: number, arg?: boolean, callback?: () => void) => void,
    _spellRangeLayer: SpellRangeLayer
}

interface ConnectionManager extends Base {
    eventHandlers: any[],
    lastReceivedMessage: string,
    disconnect: () => void,
    sendMessage: (message: string, data: any) => void,
    removeListener: (message: string, callbackFunction: any) => void
}

export interface WGame extends Window {
    actorManager: ActorManager,
    Config: DofusConfig,
    d: DofusState,
    developmentMode: boolean,
    dofus: DofusCommunication,
    connectionManager: ConnectionManager,
    foreground: GuiObject
    gui: DofusGUI,
    isoEngine: IsoEngine,
}
