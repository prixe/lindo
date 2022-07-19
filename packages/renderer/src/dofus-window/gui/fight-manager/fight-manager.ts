import TypedEmitter from 'typed-emitter'
import { CharacterStats } from '../character-stats'
import { SpellBuff } from '../spell'
import { _EntityDispositionInformations } from '../../dofus'

export interface Fighter {
  id: number
  isCreature: boolean
  buffs: Array<SpellBuff>
  level: number
  data: {
    teamId: number
    alive: boolean
    disposition: _EntityDispositionInformations
    stats: CharacterStats
  }
}

export type FightManagerEvents = {
  fightEnd: () => void
}

export interface FightManager extends TypedEmitter<FightManagerEvents> {
  fightState: number
  isInBattle: () => boolean
  finishTurn: () => void
  getFighters: () => Array<number>
  isFighterOnUsersTeam: (fighterId: number) => boolean
  getFighter: (actorId: number) => Fighter
}
