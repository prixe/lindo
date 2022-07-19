export enum EffectCategory {
  undefined = -1,
  miscellaneous = 0,
  resistance = 1,
  damage = 2,
  special = 3
}

export interface EffectInstance {
  effect: {
    category: EffectCategory
    characteristic: number
  }
  effectId: number
  min: number
  max: number
}

export interface SpellEffect {
  trigger: boolean
  effectId: number
  diceNum: number
  diceSide: number
  value: number
  description: string
  effect: {
    category: EffectCategory
    characteristic: number
  }
}

export interface SpellBuff {
  source: number
  duration: number
  stack: Array<SpellBuff>
  effect: SpellEffect
  castingSpell: {
    spell: Spell
  }
}
export interface Spell {
  id: number
  isItem: boolean
  spellLevel: {
    effects: Array<SpellEffect>
    criticalEffect: Array<SpellEffect | undefined>
  }
  effectInstances: Record<string, EffectInstance>
  _item: {
    item: {
      criticalHitBonus: number
    }
  }
}
