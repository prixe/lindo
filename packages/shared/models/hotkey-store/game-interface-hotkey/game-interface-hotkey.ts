import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const GameInterfaceHotkeyModel = types
  .model('GameInterfaceHotkey')
  .props({
    carac: types.optional(types.string, 'C'),
    spell: types.optional(types.string, 'S'),
    bag: types.optional(types.string, 'I'),
    bidHouse: types.optional(types.string, 'H'),
    map: types.optional(types.string, 'M'),
    friend: types.optional(types.string, 'F'),
    book: types.optional(types.string, 'Q'),
    dailyQuest: types.optional(types.string, 'X'),
    conquest: types.optional(types.string, 'K'),
    goultine: types.optional(types.string, 'R'),
    job: types.optional(types.string, 'J'),
    guild: types.optional(types.string, 'G'),
    mount: types.optional(types.string, 'N'),
    directory: types.optional(types.string, ''),
    alignment: types.optional(types.string, ''),
    bestiary: types.optional(types.string, 'B'),
    title: types.optional(types.string, 'T'),
    achievement: types.optional(types.string, 'U'),
    alliance: types.optional(types.string, ''),
    spouse: types.optional(types.string, 'L'),
    spells: types.optional(types.array(types.string), [
      '',
      ...Array.from({ length: 9 }, (_, i) => (i + 1).toString()),
      '0',
      ...Array.from({ length: 20 }, () => '')
    ]),
    items: types.optional(types.array(types.string), [
      ...Array.from({ length: 9 }, (_, i) => `CmdOrCtrl+${i + 1}`),
      'CmdOrCtrl+0',
      ...Array.from({ length: 21 }, () => '')
    ])
  })
  .actions((self) => ({
    setCarac(hotkey: string) {
      self.carac = hotkey
    },
    setSpell(hotkey: string) {
      self.spell = hotkey
    },
    setBag(hotkey: string) {
      self.bag = hotkey
    },
    setBidHouse(hotkey: string) {
      self.bidHouse = hotkey
    },
    setMap(hotkey: string) {
      self.map = hotkey
    },
    setFriend(hotkey: string) {
      self.friend = hotkey
    },
    setBook(hotkey: string) {
      self.book = hotkey
    },
    setGuild(hotkey: string) {
      self.guild = hotkey
    },
    setConquest(hotkey: string) {
      self.conquest = hotkey
    },
    setJob(hotkey: string) {
      self.job = hotkey
    },
    setAlliance(hotkey: string) {
      self.alliance = hotkey
    },
    setMount(hotkey: string) {
      self.mount = hotkey
    },
    setDirectory(hotkey: string) {
      self.directory = hotkey
    },
    setAlignment(hotkey: string) {
      self.alignment = hotkey
    },
    setBestiary(hotkey: string) {
      self.bestiary = hotkey
    },
    setTitle(hotkey: string) {
      self.title = hotkey
    },
    setAchievement(hotkey: string) {
      self.achievement = hotkey
    },
    setDailyQuest(hotkey: string) {
      self.dailyQuest = hotkey
    },
    setSpouse(hotkey: string) {
      self.spouse = hotkey
    },
    setGoultine(hotkey: string) {
      self.goultine = hotkey
    },
    setSpells(index: number, hotkey: string) {
      self.spells[index] = hotkey
    },
    setItems(index: number, hotkey: string) {
      self.items[index] = hotkey
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameInterfaceHotkeyType = Instance<typeof GameInterfaceHotkeyModel>

export interface GameInterfaceHotkey extends GameInterfaceHotkeyType {}

type GameInterfaceHotkeySnapshotType = SnapshotOut<typeof GameInterfaceHotkeyModel>

export interface GameInterfaceHotkeySnapshot extends GameInterfaceHotkeySnapshotType {}
