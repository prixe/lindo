import { _PartyMemberInformations } from '../dofus'

export interface GUIPartyMember {
  memberData: _PartyMemberInformations
}

export interface Party {
  currentParty?: {
    _childrenList: Array<GUIPartyMember>
  }
}
