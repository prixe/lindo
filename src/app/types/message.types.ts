export interface InteractiveElementData {
    elementId: number,
    elementTypeId: number,
    _name: string
}

export interface StatedElementData {
    elementId: number,
    elementCellId: number,
    elementState: number
}

export interface ChatSmileyMessage {
    entityId: number,
    smileyId: number
}

export interface ChatServerMessage {
    channel: number,
    content: string,
    senderName: string
}

export interface GameFightTurnStartMessage {
    id: number
}

export interface TaxCollectorAttackedMessage {
    guild: {
        guildName: string
    },
    worldX: number,
    worldY: number,
    enrichData: {
        subAreaName: string,
        firstName: string,
        lastName: string
    }
}

export interface GameRolePlayAggressionMessage {
    defenderId: number
}

export interface TextInformationMessage {
    msgId: number
    parameters: [number]
}

export interface PartyInvitationMessage {
    fromName: string,
    partyId: number
}

export interface GameActionFightDeathMessage {
    targetId: number
}

export interface StatedElementUpdatedMessage {
    statedElement: StatedElementData
}

export interface InteractiveUsedMessage {
    duration: number,
    elemId: number,
    entityId: number
}

export interface JobExperienceUpdateMessage {
    experiencesUpdate: {
        jobXpNextLevelFloor: number
    }
}

export interface MapComplementaryInformationsDataMessage {
    interactiveElements: [],
    statedElements: []
}

export interface ExchangeObjectAddedMessage {
    remote: string,
    object: {
        objectUID: number,
        quantity: number
    }
}

export interface GameRolePlayShowActorMessage {
    id: number,
    informations: {
        contextualId: number
    }
}

export interface GameContextRemoveElementMessage {
    id: number,
    informations: {
        contextualId: number
    }
}