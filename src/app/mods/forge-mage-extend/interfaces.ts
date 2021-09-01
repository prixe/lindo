export interface ObjectItem {
    objectGID: number;
    objectUID: number;
    quantity: number;
    item: Item;
    effectsMap: Record<string, EffectInstance>;
    effects: EffectInstance[];
  }
  
export  interface Item {
    possibleEffectsMap: Record<number, EffectInstance>
    possibleEffects: EffectInstance[]
    typeId: number;
    image: string;
  }
  
export  interface EffectInstance {
    actionId: number;
    value: number;
    diceNum?: number;
    diceSide?: number;
    effectId: number;
    effect: Effect;
    description: string;
  }
  
export  interface Effect {
    bonusType: number;
    // stat id
    characteristic: number;
    descriptionId: string;
  }
  
export  interface ObjectEffectInteger {
    actionId: number;
    value: number;
  }
  
export interface ExchangeCraftResultMagicWithObjectDescMessage {
    craftResult: number;
    magicPoolStatus: number;
    objectInfo: {
      effects: ObjectEffectInteger[];
      objectGID: number;
      objectUID: number;
      quantity: number;
    }
  }