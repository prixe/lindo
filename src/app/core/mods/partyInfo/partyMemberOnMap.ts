import { EMPTY_MAP } from "@angular/core/src/view";
import { Logger } from "app/core/electron/logger.helper";
import { Mod } from "../mod";

export class PartyMember extends Mod{
    private members: Map<number, boolean>;
    private divElement: Array<HTMLDivElement>;

    startMod(): void {
        this.params = this.settings.option.vip.general;

        if (this.params.party_member_on_map) {
            Logger.info('- enabled PartyMember');

            // Init var
            this.members = new Map();
            this.divElement = [];

            const pmomCss = document.createElement('style');
            pmomCss.id = 'pmomCss';
            pmomCss.innerHTML = `
                .pmomStatus {
                    width: 15px;
                    height: 30px;
                    position: absolute;
                    bottom: -6px;
                    right: 12px;
                }
                .pmomOnMap {
                    background: url(./assets/ui/server/state_3.png);
                    background-position: center;
                }
                .pmomNotInMap {
                    background: url(./assets/ui/server/state_1.png);
                    background-position: center;
                }
            `;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(pmomCss);

            // Party listenner
            this.on(this.wGame.dofus.connectionManager, 'PartyJoinMessage', () => this.updatePartyMembers());
            this.on(this.wGame.dofus.connectionManager, 'PartyUpdateMessage', () => this.updatePartyMembers());
            this.on(this.wGame.dofus.connectionManager, 'PartyMemberEjectedMessage', () => this.updatePartyMembers());
            this.on(this.wGame.dofus.connectionManager, 'PartyMemberRemoveMessage', () => this.updatePartyMembers());
            this.on(this.wGame.dofus.connectionManager, 'PartyNewMemberMessage', () => this.updatePartyMembers());

            // Receive when player join the map
            this.on(this.wGame.dofus.connectionManager, 'GameRolePlayShowActorMessage', (e: any) => this.updateMember(e, true));
            // Receive when player leave the map
            this.on(this.wGame.dofus.connectionManager, 'GameContextRemoveElementMessage', (e: any) => this.updateMember(e, false));
            // Receive when your game map change
            this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', (e: any) => this.updateMemberOnMapChange(e));

            // Use here init mod if player already have grp when mod start
            this.updatePartyMembers();
        }
    }

    private updateDOM() {
        let i = 0;
        this.members.forEach((status, memberId) => {
            if (memberId != this.wGame.isoEngine.actorManager.userId) {
                const divMember: HTMLDivElement = this.wGame.document.getElementsByClassName('member')[i];
                this.addStatusToMember(divMember,status);
            }
            i++;
        });
    }

    private addStatusToMember(divMember: HTMLDivElement, memberStatus: boolean) {
        if (divMember != null) {
            const className = memberStatus ? 'pmomOnMap' : 'pmomNotInMap';

            let divStatus: HTMLDivElement = divMember.lastElementChild as any;
            if (divStatus && divStatus.classList.contains('pmomStatus')) {
                // div already exist
                divStatus.classList.replace(divStatus.classList.item(1), className);
            } else {
                divStatus = document.createElement('div');
                divStatus.className = 'pmomStatus';
                divStatus.classList.add(className);
                this.divElement.push(divStatus);
                divMember.appendChild(divStatus);
            }
        }
    }

    // Use for update members list
    private updatePartyMembers() {
        const oldMembers: Map<number, boolean> = this.members;
        this.members.clear();

        if (this.wGame.gui.party.currentParty && this.wGame.gui.party.currentParty._childrenList.length > 0) {
            const mapId: number = this.wGame.isoEngine.mapRenderer.mapId;

            this.wGame.gui.party.currentParty._childrenList.forEach((m) => {
                let isOnMap: boolean = mapId == m.memberData.mapId;
                if (oldMembers.has(m.memberData.id)) isOnMap = oldMembers.get(m.memberData.id);

                this.members.set(m.memberData.id, isOnMap);
            });
            this.updateDOM();
        }
    }

    // Use for update member if join/leave map
    private updateMember(data: any, isOnMap: boolean) {
        if (this.wGame.gui.party.currentParty && this.wGame.gui.party.currentParty._childrenList.length > 0) {
            const playerId: number = isOnMap ? data.informations.contextualId : data.id;
            if (this.members.has(playerId)) this.members.set(playerId, isOnMap);

            this.updateDOM();
        }
    }

    // Use for update member when your map change
    private updateMemberOnMapChange(data: any) {
        if (this.wGame.gui.party.currentParty && this.wGame.gui.party.currentParty._childrenList.length > 0) {
            const actorsId: Array<number> = [];

            // Get all playerId in map
            data.actors.forEach((actor) => { if (actor.contextualId > 0) actorsId.push(actor.contextualId); });
            this.members.forEach((status, member) => this.members.set(member, actorsId.includes(member)) );

            this.updateDOM();
        }
    }

    private destroy() {
        if (this.divElement != null && this.divElement.length > 0) {
            this.divElement.forEach((e) => {
                if (e != null && e.parentElement) e.remove();
            });
            this.divElement = [];
        }
    }

    public reset() {
        super.reset();
        this.destroy();
        let pmomCss = this.wGame.document.getElementById('pmomCss');
        if (pmomCss && pmomCss.parentElement) pmomCss.parentElement.removeChild(pmomCss);
    }
}
