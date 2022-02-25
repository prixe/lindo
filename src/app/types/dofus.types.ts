interface DofusCommunication {
    connectionManager: any,
    sendMessage: (message: string, data: any) => void,
    [key: string]: any,
}

interface FighterDataStats {
    actionPoints: number,
    maxActionPoints: number,
    [key: string]: any,
}

interface FighterDataDisposition {
    cellId: string,
    [key: string]: any,
}

interface FighterData {
    alive: boolean,
    disposition: FighterDataDisposition,
    isCreature: boolean,
    stats: FighterDataStats,
    teamId: number,
    [key: string]: any,
}

interface Fighter {
    data: FighterData,
    id: number,
    [key: string]: any,
}

interface FightManager {
    fightId: number,
    fightState: number,
    finishTurn: () => void,
    getFighter: (fighterId: number) => Fighter,
    getFighters: () => [number],
    turnCount: number,
    _fighters: { [actorId: number]: Fighter },
    [key: string]: any,
}

interface ClassicParty {
    partyLeaderId: number,
    [key: string]: any,
}

interface MemberData {
    id: number,
    level: number,
    mapId: number,
    prospecting: number,
    [key: string]: any,
}

interface PartyMember extends GuiObject {
    memberData: MemberData,
    [key: string]: any,
}

interface CurrentParty {
    getChildren: () => [PartyMember],
    _childrenList: [PartyMember],
    [key: string]: any,
}

interface Party {
    classicParty: ClassicParty,
    currentParty: CurrentParty,
    [key: string]: any,
}

interface CharacterBreed {
    shortNameId: string,
    [key: string]: any,
}

interface CharacterBaseInformations {
    id: number,
    level: number,
    name: string,
    [key: string]: any,
}

interface Wisdom {
    getTotalStat: () => number,
    [key: string]: any,
}

interface PlayerCharacterCharacteristics {
    actionPointsCurrent: number,
    energyPoints: number,
    experience: number,
    kamas: number,
    lifePoints: number,
    maxLifePoints: number,
    wisdom: Wisdom,
    [key: string]: any,
}

interface SpellDesc {
    id: number,
    nameId: string,
    [key: string]: any,
}

interface Spell {
    id: number,
    isItem: boolean,
    isLoaded: boolean,
    level: number,
    ownerId: number,
    position: number,
    spell: SpellDesc,
    [key: string]: any,
}

interface SpellData {
    spells: [Spell],
    [key: string]: any,
}

interface PlayerCharacter {
    characteristics: PlayerCharacterCharacteristics,
    spellData: SpellData,
    [key: string]: any,
}

interface Characters {
    mainCharacter: PlayerCharacter,
    mainCharacterId: number,
    regenRate: number,
    regenTimer: number,
    [key: string]: any,
}

interface Position2D {
    posX: number,
    posY: number,
    [key: string]: any,
}

interface Position {
    coordinates: Position2D,
    mapId: number,
    subAreaId: number,
    worldmapId: number,
    [key: string]: any,
}

interface Identification {
    subscriptionEndDate: number,
    [key: string]: any,
}

interface ItemType {
    id: number,
    nameId: string,
    [key: string]: any,
}

interface Item {
    id: number,
    level: number,
    type: ItemType,
    typeId: number,
    [key: string]: any,
}

interface InventoryItem {
    id: number,
    item: Item,
    objectGID: number,
    objectUID: number,
    position: number,
    quantity: number,
    shortName: string,
    weight: number,
    [key: string]: any,
}

interface Inventory {
    goultines: number,
    kamas: number,
    maxWeight: number,
    objects: {[objectUID: number]: InventoryItem},
    weight: number,
    [key: string]: any,
}

interface Alliance {
    getPrismBonusPercent: (subAreaId: number) => number,
    [key: string]: any,
}

interface GuildMemberInfo {
    experienceGivenPercent: number,
    [key: string]: any,
}

interface Guild {
    current: number|null,
    getGuildMemberInfo: (playerId: number) => GuildMemberInfo,
    [key: string]: any,
}

interface PlayerData {
    alliance: Alliance,
    characterBreed: CharacterBreed
    characterBaseInformations: CharacterBaseInformations,
    characters: Characters,
    guild: Guild,
    id: number,
    identification: Identification,
    inventory: Inventory,
    isRiding: boolean,
    experienceFactor: number,
    jobs: any,
    mountXpRatio: number,
    partyData: any,
    position: Position,
    [key: string]: any,
}

interface GuiObject {
    rootElement: HTMLElement,
    getChildren: () => [GuiObject],
    _childrenList: [GuiObject],
    setValue?: (any) => void,
    tap?: () => void,
    [key: string]: any,
}

interface InteractGuiObject extends GuiObject {
    tap: () => void,
    [key: string]: any,
}

interface NpcDialogUI {
    replies: [string],
    replyBoxes: [GuiObject],
    [key: string]: any,
}

interface GuiWindow extends GuiObject {
    close: () => void,
    id: string,
    isVisible: () => boolean,
    [key: string]: any,
}

interface WindowsContainer {
    getChildren: () => [GuiWindow],
    [key: string]: any,
}

interface ShortcutBarSlot extends InteractGuiObject {
    on: (action: string, callback: () => void) => void,
    [key: string]: any,
}

interface ShortcutBarSlots {
    slotList: [ShortcutBarSlot],
    [key: string]: any,
}

interface ShortcutBarPanels {
    item: ShortcutBarSlots,
    spell: ShortcutBarSlots,
    [key: string]: any,
}

interface ShortcutBar {
    _panels: ShortcutBarPanels,
    [key: string]: any,
}

interface MenuBar extends GuiObject {
    _icons: GuiObject,
    [key: string]: any,
}

interface MainControls {
    buttonBox: GuiObject,
    getChildren: () => [GuiWindow],
    _childrenList: [GuiWindow],
    _creatureModeButton: GuiObject,
    [key: string]: any,
}

interface FightControlButtons {
    toggleReadyForFight: () => void,
    [key: string]: any,
}

interface IScrollIndicator {
    options: {
        listenX: boolean,
        listenY: boolean
    },
    wrapper: HTMLElement,
    [key: string]: any,
}

interface IScroll extends GuiObject {
    indicators: [IScrollIndicator],
    refresh: () => void,
    options: {
        scrollX: boolean,
        scrollY: boolean
    },
    [key: string]: any,
}

interface FighterListScrollerGui extends GuiObject {
    iScroll: IScroll,
    [key: string]: any,
}

interface Timeline {
    fightControlButtons: FightControlButtons
    fighterList: GuiObject,
    fighterListScroller: FighterListScrollerGui,
    [key: string]: any,
}

interface NumberInputPad {
    isVisible: () => boolean,
    [key: string]: any,
}

interface SentMessage {
    message: string,
    [key: string]: any,
}

interface SentMessageHistory {
    getCurrentEntry: () => [SentMessage],
    goBack: () => void,
    goForward: () => void,
    [key: string]: any,
}

interface ChatInput {
    inputChat: GuiObject,
    sentMessageHistory: SentMessageHistory,
    [key: string]: any,
}

interface Chat {
    activate: () => void,
    active: boolean,
    chatInput: ChatInput,
    deactivate: () => void,
    logMsg: (message: string) => void,
    [key: string]: any,
}

interface NotificationBar {
    currentOpenedId: number,
    dialogs: [GuiObject],
    _elementIsVisible: boolean,
    [key: string]: any,
}

interface ShopFloatingToolbar {
    hide: () => void,
    show: () => void,
    [key: string]: any,
}

interface DofusGUI {
    chat: Chat,
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
    windowsContainer: WindowsContainer,
    [key: string]: any,
}

interface DofusState {
    activityInterval: number,
    hasSeenActivity: boolean,
    isConnected: boolean,
    isInactive: boolean,
    isListening: boolean,
    lastActivityTime: number,
    pingInterval: number,
    recordActivity: () => void,
    [key: string]: any,
}

interface DofusConfig {
    assetsUrl: string,
    dataUrl: string,
    [key: string]: any,
}

interface ActorLook {
    subentities: [any],
    [key: string]: any,
}

interface Actor {
    actorManager: ActorManager,
    canMoveDiagonally: boolean,
    cancelMovement: (newMovement: () => void) => void,
    cellId: number,
    isMerchant: () => boolean,
    look: ActorLook,
    moving: boolean,
    [key: string]: any,
}

interface ActorManager {
    actors: [Actor],
    getActor: (userId: number) => Actor,
    getIndexedVisibleActors(): () => { [actorId: number]: Actor },
    getOccupiedCells: (cellId: number) => { [cellId: number]: [Cell]},
    userActor: Actor,
    userId: number,
    _occupiedCells: { [id: number]: [Cell] },
    [key: string]: any,
}

interface Coord2D {
    x: number,
    y: number,
    [key: string]: any,
}

interface Cell {
    actorId: number,
    cellId: number,
    direction: string,
    [key: string]: any,
}

interface MapCellData {
    l?: number,
    [key: string]: any,
}

interface MapCells {
    cells: [MapCellData[]],
    [key: string]: any,
}

interface MapGrid {
    grid: [Cell[]],
    [key: string]: any,
}

interface EnabledSkill {
    skillId: number,
    skillInstanceUid: number,
    [key: string]: any,
}

export interface InteractiveElement {
    elementId: number,
    elementTypeId: number,
    enabledSkills: [EnabledSkill],
    _name: string,
    _type: string,
    [key: string]: any,
}

export interface StatedElement {
    id: number,
    isDisplayed: boolean,
    _x: number,
    _y: number,
    [key: string]: any,
}

interface MapRenderer {
    getCellSceneCoordinate: (cellId: number) => Coord2D,
    getChangeMapFlags: (cellId: number) => [string],
    grid: MapGrid,
    interactiveElements: { [id: number]: InteractiveElement },
    isWalkable: (cellId: number) => boolean,
    map: MapCells,
    mapId: number,
    statedElements: [StatedElement],
    [key: string]: any,
}

interface LindoMapScene {
    _refreshAreasBackup: () => void,
    [key: string]: any,
}

interface MapScene extends LindoMapScene {
    convertSceneToCanvasCoordinate: (x: number, y: number) => Coord2D,
    _refreshAreas: () => void,
    [key: string]: any,
}

interface Background {
    render: () => void,
    [key: string]: any,
}

type Direction = "top" | "bottom" | "left" | "right" | false;

interface IsoEngine {
    actorManager: ActorManager,
    background: Background,
    gotoNeighbourMap: (direction: Direction, cellId: number, x: number, y: number) => void,
    mapRenderer: MapRenderer,
    mapScene: MapScene,
    useInteractive: (elemId: number, skillInstanceUid: number) => void,
    userId: number,
    _castSpellImmediately: (number) => void,
    _movePlayerOnMap: (cellId: number, arg: boolean, callback: () => void) => void,
    [key: string]: any,
}

export interface WGame extends Window {
    actorManager: ActorManager,
    Config: DofusConfig,
    d: DofusState,
    dofus: DofusCommunication,
    connectionManager: any,
    foreground: GuiObject
    gui: DofusGUI,
    isoEngine: IsoEngine,
    [key: string]: any,
}
