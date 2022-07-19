import { _EntityLook } from './actor'
import { _BasicGuildInformations } from './guild'
import { _PlayerStatus } from './status'

export interface _PartyMemberInformations {
  alignmentSide: number
  breed: number
  entityLook: _EntityLook
  guildInfo: _BasicGuildInformations
  id: number
  initiative: number
  level: number
  lifePoints: number
  mapId: number
  maxLifePoints: number
  name: string
  prospecting: number
  regenRate: number
  sex: boolean
  status: _PlayerStatus
  subAreaId: number
  worldX: number
  worldY: number
  _type: 'PartyMemberInformations'
}
