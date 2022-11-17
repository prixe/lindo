import TypedEmitter from 'typed-emitter'
import { CharacterStats } from '../character-stats'
import { SpellBuff } from '../spell'
import { _EntityDispositionInformations } from '../../dofus'

export interface Fighter {
  id: number
  isCreature: boolean
  buffs: Array<SpellBuff>
  level: number
  name: string
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
  _fighters: { [fighterId: string]: Fighter }
  fightState: number
  isInBattle: () => boolean
  finishTurn: () => void
  getFighters: () => Array<number>
  isFighterOnUsersTeam: (fighterId: number) => boolean
  getFighter: (actorId: number) => Fighter
  turnCount: number
}
