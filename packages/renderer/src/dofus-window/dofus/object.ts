export interface _Item {
  appearanceId: number
  averagePrice: number
  criteriaTarget: string
  descriptionId: string
  dropMonsterIds: Array<number>
  enhanceable: boolean
  exchangeable: boolean
  favoriteSubAreas: Array<number>
  favoriteSubAreasBonus: number
  iconId: number
  id: number
  image: string
  isWeapon: boolean
  level: number
  multiUseUnabled: boolean
  nameId: string
  possibleEffects: Array<unknown>
  possibleEffectsMap: unknown
  price: number
  realWeight: number
  recipeIds: Array<number>
  recipeSlots: number
  secretRecipe: boolean
  shatterResults: Array<unknown>
  shieldBonuses: Array<unknown>
  shieldModelId: number
  type: {
    id: number
  }
  typeId: number
  upgradeEffects: Array<unknown>
  useAnimationId: number
  _type: 'Item'
}

// TODO: maybe the same as item instance ?
export interface _ObjectItem {
  effects: Array<unknown>
  effectsMap: unknown
  eventHandlers: unknown
  exchangeAllowed: boolean
  exchangeable: boolean
  id: number
  isInitialised: boolean
  isItemInstance: boolean
  item: _Item
  objectGID: number
  objectUID: number
  position: number
  quantity: number
  shortName: string
  weight: number
  _type: 'ObjectItem'
}
