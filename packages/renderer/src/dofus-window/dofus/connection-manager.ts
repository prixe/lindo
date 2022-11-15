import TypedEmitter from 'typed-emitter'
import { GameFightTurnStartMessage } from '../gui'
import { InteractiveElement, StatedElement } from '../iso-engine'
import { _GameRolePlayActor } from './actor'
import { _CharacterBaseInformations } from './character'

export interface DataSchema {
  _messageType: 'ObjectQuantityMessage' | 'InventoryWeightMessage' | 'ObjectUseMessage'
}
export interface ChatMessage {
  channel: number
  senderName: string
  content: string
}
export interface PartyInvitationMessage {
  fromName: string
  partyId: number
}
export interface GameRolePlayAggressionMessage {
  defenderId: number
}
export interface TextInformationMessage {
  msgId: number
  parameters: Array<string>
}
export interface TaxMessage {
  guild: {
    id: string
    guildName: string
  }
  worldX: number
  worldY: number
  enrichData: {
    subAreaName: string
    firstName: string
    lastName: string
  }
}
export interface ChallengeInfoMessage {
  xpBonus: number
  challengeId: number
}
export interface InventoryWeightMessage extends DataSchema {
  weightMax: number
  weight: number
  _messageType: 'InventoryWeightMessage'
}
export interface StatedElementUpdatedMessage {
  statedElement: StatedElement
}
export interface InteractiveUsedMessage {
  elemId: number
  entityId: number
  skillId: number
  duration: number
}

export interface ChatSmileyMessage {
  entityId: number
  smileyId: number
}

export interface FightLoot {
  kamas: number
}

export interface FightResultPlayer {
  alive: boolean
  id: number
  level: number
  rewards: FightLoot
}

export interface GameFightEndMessage {
  results: Array<FightResultPlayer>
  duration: number
}

export interface JobExperienceUpdateMessage {
  experiencesUpdate: {
    jobXpNextLevelFloor: number
  }
}
export interface MapComplementaryInformationsDataMessage {
  actors: Array<_GameRolePlayActor>
  interactiveElements: Array<InteractiveElement>
  statedElements: Array<StatedElement>
  fights: Record<
    string,
    {
      fightId: number
      fightTeams: Record<
        string,
        {
          leaderId: number
        }
      >
    }
  >
}
export interface ExchangeStartOkHumanVendorMessage {
  sellerId: number
}
export interface GameRolePlayShowActorMessage {
  id: number
  informations: _GameRolePlayActor
}
export interface GameMapMovementMessage {
  actorId: number
  keyMovements: Array<number>
}

export interface CurrentMapMessage {}
export interface GameContextRemoveElementMessage {
  id: number
  informations: _GameRolePlayActor
}
export interface CharactersListMessage {
  characters: Array<_CharacterBaseInformations>
  _isInitialized: boolean
  _type: 'CharactersListMessage'
  hasStartupActions: boolean
}

export interface BasicWhoIsMessage {
  playerState: number
}

export interface PartyMemberInFightMessage {
  memberId: number
  fightId: number
  fightMap: {
    mapId: number
  }
}
export interface MapComplementaryInformationsWithCoordsMessage extends MapComplementaryInformationsDataMessage {}

export interface PartyJoinMessage {}
export interface PartyUpdateMessage {}
export interface PartyMemberEjectedMessage {}
export interface PartyMemberRemoveMessage {}
export interface PartyNewMemberMessage {}
export interface PartyNewGuestMessage {}
export interface PartyLeaderUpdateMessage {}

export interface ExchangeItemAddMessage {
  itemInfo: {
    objectPrice: number
  }
}

export interface ObjectQuantityMessage extends DataSchema {
  objectUID: number
  quantity: number
  _messageType: 'ObjectQuantityMessage'
}
export interface ObjectUseMessage extends DataSchema {
  objectUID: number
  _messageType: 'ObjectUseMessage'
}

export type Data = ObjectUseMessage | InventoryWeightMessage | ObjectQuantityMessage

// Sent message
export interface MessageSentDataSchema {
  type: 'ObjectUseMessage'
}
export interface SentObjectUseMessage extends MessageSentDataSchema {
  data: {
    objectUID: number
  }
  type: 'ObjectUseMessage'
}

export type MessageSentData = SentObjectUseMessage
export interface MessageSent {
  data: {
    data: MessageSentData
  }
}

export interface InteractiveUseEndedMessage {
  elemId: number
}

export interface ExchangeBidhouseMinimumItemPriceListMessage {
  objectGID: number
  prices: number[]
}

export type ConnectionManagerEvents = {
  ChallengeInfoMessage: (msg: ChallengeInfoMessage) => void
  GameFightEndMessage: (msg: GameFightEndMessage) => void
  GameFightStartMessage: () => void
  GameFightLeaveMessage: () => void
  MapComplementaryInformationsDataMessage: (msg: MapComplementaryInformationsDataMessage) => void
  ChatServerMessage: (msg: ChatMessage) => void
  TaxCollectorAttackedMessage: (tax: TaxMessage) => void
  GameRolePlayArenaFightPropositionMessage: (e: unknown) => void
  PartyInvitationMessage: (msg: PartyInvitationMessage) => void
  GameRolePlayAggressionMessage: (msg: GameRolePlayAggressionMessage) => void
  TextInformationMessage: (msg: TextInformationMessage) => void
  GameActionFightNoSpellCastMessage: () => void
  GameFightTurnStartMessage: (msg: GameFightTurnStartMessage) => void
  GameFightTurnEndMessage: () => void
  GameActionFightLifePointsGainMessage: () => void
  InventoryWeightMessage: (msg: InventoryWeightMessage) => void
  StatedElementUpdatedMessage: (msg: StatedElementUpdatedMessage) => void
  InteractiveUsedMessage: (msg: InteractiveUsedMessage) => void
  InteractiveUseEndedMessage: (msg: InteractiveUseEndedMessage) => void
  GameFightStartingMessage: () => void
  JobExperienceUpdateMessage: (msg: JobExperienceUpdateMessage) => void
  ExchangeStartOkHumanVendorMessage: (msg: ExchangeStartOkHumanVendorMessage) => void
  ExchangeLeaveMessage: () => void
  GameRolePlayShowActorMessage: (msg: GameRolePlayShowActorMessage) => void
  GameMapMovementMessage: (msg: GameMapMovementMessage) => void
  GameContextRemoveElementMessage: (msg: GameContextRemoveElementMessage) => void
  CharactersListMessage: (msg: CharactersListMessage) => void
  ChatSmileyMessage: (msg: ChatSmileyMessage) => void
  BasicWhoIsMessage: (msg: BasicWhoIsMessage) => void
  CurrentMapMessage: (msg: CurrentMapMessage) => void
  PartyMemberInFightMessage: (msg: PartyMemberInFightMessage) => void
  MapComplementaryInformationsWithCoordsMessage: (msg: MapComplementaryInformationsWithCoordsMessage) => void
  PartyJoinMessage: (msg: PartyJoinMessage) => void
  PartyUpdateMessage: (msg: PartyUpdateMessage) => void
  PartyMemberEjectedMessage: (msg: PartyMemberEjectedMessage) => void
  PartyMemberRemoveMessage: (msg: PartyMemberRemoveMessage) => void
  PartyNewMemberMessage: (msg: PartyNewMemberMessage) => void
  PartyNewGuestMessage: (msg: PartyNewGuestMessage) => void
  PartyLeaderUpdateMessage: (msg: PartyLeaderUpdateMessage) => void
  ExchangeBidhouseMinimumItemPriceListMessage: (msg: ExchangeBidhouseMinimumItemPriceListMessage) => void
  ExchangeBidHouseItemAddOkMessage: (msg: ExchangeItemAddMessage) => void
  send: (msg: MessageSent) => void
  data: (msg: Data) => void
}

export interface ConnectionManager extends TypedEmitter<ConnectionManagerEvents> {}
