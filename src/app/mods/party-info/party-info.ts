import {Mod} from "../mod";

/**
* This mod add the possibility to show party level and prospection count
*/
export class PartyInfo extends Mod {
    private partyInitialized:boolean;
    private container: any;
    private info_pp: boolean;
    private info_lvl: boolean;

    startMod(): void {
        this.info_pp = this.settings.option.vip.general.party_info_pp;
        this.info_lvl = this.settings.option.vip.general.party_info_lvl;
        if (this.info_pp || this.info_lvl) {
            Logger.info('- enable PartyInfo');

            this.partyInitialized = (this.wGame.document.querySelector("#party-info-container") !== null);
            setTimeout(() => {
                this.updatePartyInfo()
            }, 100);
            this.on(this.wGame.dofus.connectionManager, 'PartyJoinMessage', this.updatePartyInfo.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'PartyUpdateMessage', this.updatePartyInfo.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'PartyMemberEjectedMessage', this.updatePartyInfo.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'PartyMemberRemoveMessage', this.updatePartyInfo.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'PartyNewMemberMessage', this.updatePartyInfo.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'PartyUpdateMessage', this.updatePartyInfo.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'PartyNewGuestMessage', this.updatePartyInfo.bind(this));
            this.on(this.wGame.dofus.connectionManager, 'PartyLeaderUpdateMessage', this.updatePartyInfo.bind(this));
        }
    }

    // Initialize party info container
    private initializePartyInfo() {
        if (this.partyInitialized) {
            return;
        }
        const partyBoxes = this.wGame.document.querySelector(".partyBoxes");
        if (!partyBoxes) {
            return;
        }
        const parent = partyBoxes.parentElement;
        this.container = this.wGame.document.createElement("div");
        this.container.id = "party-info-container";
        this.container.style = `background: rgba(0, 0, 0, 0.6);
        margin: 2px;
        border-radius: 5px;
        margin-bottom: 5px;
        padding: 3px;
        font-weight: bolder;
        color: #ced0bb;
        font-family: berlin_sans_fb_demibold;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 1) inset;`;

        if (this.info_lvl) {
            const partyLevelElement = this.wGame.document.createElement("div");

            partyLevelElement.textContent = this.translate.instant('app.option.vip.party-info.level') + " ?";
            partyLevelElement.id = "party-level";
            partyLevelElement.style = "font-size: 13px;user-select: none;cursor: default;"
            this.container.appendChild(partyLevelElement);
        }

        if (this.info_pp) {
            const prospectionContainerElement = this.wGame.document.createElement("div");
            const prospectionImageElement = this.wGame.document.createElement("img");
            const prospectionTextElement = this.wGame.document.createElement("span");

            prospectionImageElement.src = "./assets/ui/icons/prospecting.png";
            prospectionImageElement.style = "height: 1em; vertical-align: middle;"
            prospectionContainerElement.appendChild(prospectionImageElement);
            prospectionContainerElement.style = "font-size: 13px;user-select: none;cursor: default;"

            prospectionTextElement.textContent = " ?";
            prospectionTextElement.id = "party-pr";
            prospectionTextElement.style = "vertical-align: middle;"

            prospectionContainerElement.appendChild(prospectionTextElement);
            this.container.appendChild(prospectionContainerElement);
        }

        parent.insertBefore(this.container, partyBoxes);
        this.partyInitialized = true;
    }

    private destroy() {
        this.partyInitialized = false;
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }

    // Update party data
    private updatePartyInfo() {
        if (!this.partyInitialized) {
            this.initializePartyInfo();
        }
        try {
            let partyLevel = 0;
            let prospecting = 0;
            if (this.wGame.gui.party.currentParty && this.wGame.gui.party.currentParty._childrenList.length > 0) {
                this.wGame.gui.party.currentParty._childrenList.forEach((c) => {
                    partyLevel += c.memberData.level;
                    prospecting += c.memberData.prospecting;
                });
                if (this.info_lvl) {
                    this.wGame.document.querySelector("#party-level").textContent = this.translate.instant('app.option.vip.party-info.level') +" "+ (isNaN(partyLevel) ? "?" : partyLevel);
                }
                if (this.info_pp) {
                    this.wGame.document.querySelector("#party-pr").textContent = " "+ (isNaN(prospecting) ? "?":prospecting);
                }
            }
        } catch(e) {}
    }

    public reset() {
        super.reset();
        if (this.info_pp || this.info_lvl) {
            this.destroy();
        }
    }
}
