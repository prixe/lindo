import { _EntityLook } from './actor'

export interface _CharacterBaseInformations {
  id: number
  name: string
  level: string
  bonusXp: number
  breed: number
  entityLook: _EntityLook
  sex: boolean
  _type: 'CharacterBaseInformations'
}
