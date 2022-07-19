import { ActorType } from '../iso-engine'
import { AlignmentInfos } from '../iso-engine/alignment-infos'

export interface MonsterStaticInfos {
  isBoss: boolean
  isMiniBoss: boolean
  level: number
  nameId: string
  xp: number
}

export interface FightTeamMemberSchema {
  id: number
  _type: 'FightTeamMemberMonsterInformations' | 'FightTeamMemberCharacterInformations'
}

export interface _FightTeamMemberMonsterInformations {
  grade: number
  monsterId: number
  _type: 'FightTeamMemberMonsterInformations'
}

export interface _FightTeamMemberCharacterInformations {
  level: number
  name: string
  _type: 'FightTeamMemberCharacterInformations'
}

export type _FightTeamMemberInformations = _FightTeamMemberMonsterInformations | _FightTeamMemberCharacterInformations

export interface _EntityLook {
  bonesId: number
  speed: number
  _type: 'EntityLook'
}

export interface _EntityDispositionInformations {
  cellId: number
  direction: number
  _type: 'EntityDispositionInformations'
}

export interface _MonsterInGroupLightInformations {
  creatureGenericId: number
  grade: number
  level: number
  staticInfos: MonsterStaticInfos
  xp: number
  _type: 'MonsterInGroupLightInformations'
}

export interface _MonsterInGroupInformations {
  creatureGenericId: number
  grade: number
  level: number
  look: _EntityLook
  staticInfos: MonsterStaticInfos
  xp: number
  _type: 'MonsterInGroupInformations'
}

export interface _MonsterInGroupAlternativeInformations {
  playerCount: number
  monsters: Array<_MonsterInGroupInformations>
  _type: 'MonsterInGroupAlternativeInformations'
}

export interface _GroupMonsterStaticInformations {
  mainCreatureLightInfos: _MonsterInGroupLightInformations
  underlings: Array<_MonsterInGroupInformations>
  alternatives?: Array<_MonsterInGroupAlternativeInformations>
  _type: 'GroupMonsterStaticInformations'
}

export interface _Npc {
  id: number
  gender: number
  nameId: string
  _type: 'Npc'
}

export interface _HumanInformations {
  options: Array<unknown>
  sex: true
  restrictions: {
    cantAggress: boolean
    cantAttack: true
    cantAttackMonster: boolean
    cantBeAggressed: boolean
    cantBeAttackedByMutant: boolean
    cantBeChallenged: boolean
    cantChallenge: boolean
    cantChangeZone: boolean
    cantChat: boolean
    cantExchange: boolean
    cantMinimize: boolean
    cantMove: boolean
    cantRun: boolean
    cantSpeakToNPC: boolean
    cantTrade: boolean
    cantUseInteractive: boolean
    cantUseObject: boolean
    cantUseTaxCollector: boolean
    cantWalk8Directions: boolean
    forceSlowWalk: boolean
    _type: 'ActorRestrictionsInformations'
  }
  _type: 'HumanInformations'
}

export interface _ActorSchema {
  contextualId: number
  disposition: _EntityDispositionInformations
  look: _EntityLook
  _type: ActorType
}

export interface _GameRolePlayNpcInformations extends _ActorSchema {
  npcId: number
  sex: false
  specialArtworkId: number
  _npcData: _Npc
  _type: 'GameRolePlayNpcInformations'
}

export interface _GameRolePlayMerchantInformations extends _ActorSchema {
  _type: 'GameRolePlayMerchantInformations'
}

export interface _GameRolePlayCharacterInformations extends _ActorSchema {
  accountId: number
  alignmentInfos: AlignmentInfos
  name: string
  humanoidInfo: _HumanInformations
  _type: 'GameRolePlayCharacterInformations'
}

export interface _GameRolePlayGroupMonsterInformations extends _ActorSchema {
  ageBonus: number
  alignmentSide: number
  hasHardcoreDrop: boolean
  keyRingBonus: boolean
  lootShare: number
  scaleLevel: number
  staticInfos: _GroupMonsterStaticInformations
  _type: 'GameRolePlayGroupMonsterInformations'
}

export type _GameRolePlayActor =
  | _GameRolePlayGroupMonsterInformations
  | _GameRolePlayCharacterInformations
  | _GameRolePlayMerchantInformations
  | _GameRolePlayNpcInformations
