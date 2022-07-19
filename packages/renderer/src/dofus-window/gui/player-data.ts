import TypedEmitter from 'typed-emitter'
import { _ObjectItem } from '../dofus'
import { CharacterStats } from './character-stats'
import { Spell } from './spell'

export type PlayerDataEvents = {
  characterSelectedSuccess: () => void
}

export interface JobSkill {
  info: {
    id: number
    nameId: string
    parentJob: number
    availableInHouse: boolean
    craftableItemIds: Array<number>
    cursor: number
    gatheredRessourceItem: number
    interactiveId: number
    isForgemagus: boolean
    isRepair: boolean
    recipes: Array<unknown>
  }
  maxSlots: number
  probability: number
  _type: string
}

export interface Job {
  id: number
  description: {
    jobId: number
    skills: Array<JobSkill>
    _type: string
  }
  experience?: {
    jobId: number
    jobLevel: number
    jobXP: number
    jobXpLevelFloor: number
    jobXpNextLevelFloor: number
    _type: string
  }
  info: {
    iconId: number
    id: number
    nameId: string
    specializationOfId: number
    toolIds: Array<number>
  }
}

export interface Area {
  bounds: { _type: 'Rectangle'; x: number; y: number; width: number; height: number }
  containHouses: boolean
  containPaddocks: boolean
  id: number
  nameId: string
  superAreaId: number
  _type: 'Area'
}

export interface MapPosition {
  capabilities: number
  hasPriorityOnWorldmap: boolean
  id: number
  outdoor: boolean
  posX: number
  posY: number
  sounds: []
  subAreaId: number
  worldMap: number
  _type: 'MapPosition'
}

export interface GuildMemberInfo {
  experienceGivenPercent: number
}

export interface Guild {
  current: unknown
  getGuildMemberInfo: (id: number) => GuildMemberInfo
}
export interface Alliance {
  current: unknown
  getPrismBonusPercent: (subAreaId: number) => number
}

export interface PartyFrom {
  _guests: {}
  _inviterName: null
  _leaderId: number
  _members: Record<string, { name: string; level: number }>
  _myCharacterId: number
  _partyId: number
  _partyType: number
  _pastMembers: {}
  _timeWhenDisconnected: 0
}
export interface PartyData {
  arenaRegistered: boolean
  arenaStats: { rank: number; bestDailyRank: number; bestRank: number; victoryCount: number; arenaFightCount: number }
  arenaStep: number
  _dangerSetting: boolean
  _followedCharacterId: number
  _maxListeners: undefined
  _partyFights: {}
  _partyFromId: Record<string, PartyFrom>
  _pastParties: {}
}

export interface PlayerData extends TypedEmitter<PlayerDataEvents> {
  id: number
  inventory: {
    maxWeight: number
    weight: number
    objects: Record<number, _ObjectItem>
  }
  alliance: Alliance
  guild: Guild
  partyData?: PartyData
  characters: {
    mainCharacterId: number
    mainCharacter: {
      spellData: {
        spells: Record<number, Spell>
      }
      characteristics: Record<
        keyof CharacterStats,
        {
          getTotalStat: () => number
        }
      >
    }
  }
  identification: {
    accountCreation: number
    accountId: number
    accountSessionUid: string
    communityId: number
    hasConsoleRight: boolean
    hasRights: boolean
    login: string
    secretQuestion: string
    subscriptionEndDate?: number
    uniqueNickname: {
      _isOffi: false
      _logger: unknown
      _nickname: string
      _rawNickname: string
      _rawToken: string
      _token: string
    }
    wasAlreadyConnected: boolean
  }
  experienceFactor: number
  jobs: {
    jobXpBonus: number
    list: Record<string, Job>
  }
  characterBaseInformations: {
    id: number
    level: number
    name: string
    entityLook: unknown
  }
  position: {
    area: Area
    coordinates: { posX: number; posY: number }
    currentMapHouses: unknown
    isInMyHouse: boolean
    mapId: number
    mapPosition: MapPosition
    subArea: unknown
    subAreaId: number
    superArea: unknown
    worldmapId: number
  }
  isRiding: boolean
  mountXpRatio?: number
}
