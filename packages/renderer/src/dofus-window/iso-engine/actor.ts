import { _FightTeamMemberInformations, _GroupMonsterStaticInformations, _HumanInformations, _Npc } from '../dofus/actor'
import { AlignmentInfos } from './alignment-infos'

export type ActorType =
  | 'GameRolePlayNpcInformations'
  | 'GameRolePlayGroupMonsterInformations'
  | 'GameRolePlayCharacterInformations'
  | 'GameRolePlayMerchantInformations'
  | 'FightTeamInformations'

export interface ActorSchema {
  actorId: number
  type: ActorType
}

export interface GameRolePlayNpcInformations extends ActorSchema {
  npcId: number
  actorId: number
  _npcData: _Npc
  type: 'GameRolePlayNpcInformations'
}

export interface GameRolePlayMerchantInformations extends ActorSchema {
  type: 'GameRolePlayMerchantInformations'
}

export interface FightTeamInformations extends ActorSchema {
  fightId: number
  leaderId: number
  teamId: number
  teamMembers: Array<_FightTeamMemberInformations>
  teamSide: number
  teamTypeId: number
  type: 'FightTeamInformations'
}

export interface GameRolePlayCharacterInformations extends ActorSchema {
  accountId: number
  name: string
  playerId: number
  alignmentInfos: AlignmentInfos
  humanoidInfo: _HumanInformations
  teamTypeId?: number
  type: 'GameRolePlayCharacterInformations'
}

export interface GameRolePlayGroupMonsterInformations extends ActorSchema {
  actorId: number
  ageBonus: number
  alignmentSide: number
  contextualId: number
  hasHardcoreDrop: boolean
  keyRingBonus: boolean
  lootShare: number
  scaleLevel: number
  staticInfos: _GroupMonsterStaticInformations
  groupBoss?: unknown
  type: 'GameRolePlayGroupMonsterInformations'
}

export type GameRolePlayActor =
  | GameRolePlayGroupMonsterInformations
  | GameRolePlayCharacterInformations
  | GameRolePlayMerchantInformations
  | GameRolePlayNpcInformations
  | FightTeamInformations
