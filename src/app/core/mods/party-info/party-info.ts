import { Mods } from "../mods";

/**
 * This mod add the possibility to show party level and prospection count
 */
export class PartyInfo extends Mods {
	
	private partyInitialized:boolean;
	
	constructor(wGame: any) {
		super(wGame);
		
		this.partyInitialized = false;
		this.on(this.wGame.dofus.connectionManager, 'PartyJoinMessage', this.onPartyJoin.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyUpdateMessage',this.updatePartyInfo.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyMemberEjectedMessage',this.updatePartyInfo.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyMemberRemoveMessage',this.updatePartyInfo.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyNewMemberMessage',this.updatePartyInfo.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyUpdateMessage',this.updatePartyInfo.bind(this));
	}	
	
	 private onPartyJoin(msg){
			if (!this.partyInitialized) {
				this.initializePartyInfo();
				this.updatePartyInfo(msg);
			}
	}
	//initialize party info container
	private initializePartyInfo() {
		let partyContainer = this.wGame.document.querySelector("#party-info-container");
		if (partyContainer)
			return;
		let partyBoxes = this.wGame.document.querySelector(".partyBoxes");
		let parent = partyBoxes.parentElement;
		let partyInfoContainer = this.wGame.document.createElement("div");
		partyInfoContainer.style = "background: #333;border-radius: 5px;margin-bottom: 5px;";
		let partyLevelElement = this.wGame.document.createElement("div");
		let prospectionCountElement = this.wGame.document.createElement("div");
		
		partyInfoContainer.id = "party-info-container";
		
		partyLevelElement.textContent = "Level:9999";
		partyLevelElement.id = "party-level";
		partyLevelElement.style = "user-select: none;cursor: default;"
		
		prospectionCountElement.textContent = "Prospection:9999";
		prospectionCountElement.id = "party-pr";
		prospectionCountElement.style = "font-size: 9px;user-select: none;cursor: default;"
		
		partyInfoContainer.appendChild(partyLevelElement);
		partyInfoContainer.appendChild(prospectionCountElement);
		
		parent.insertBefore(partyInfoContainer, partyBoxes);
		this.partyInitialized = true;
	}
	//update party data
	private updatePartyInfo(msg) {
		if(!this.partyInitialized){
			this.initializePartyInfo();
		}
		setTimeout(()=>{
		var partyLevel = 0;
		var prospecting = 0;
		if(this.wGame.gui.party.currentParty)
		this.wGame.gui.party.currentParty._childrenList.forEach((c) => {
			partyLevel += c.memberData.level;
			prospecting += c.memberData.prospecting;
		});
		this.wGame.document.querySelector("#party-level").textContent = "Level:" + partyLevel;
		this.wGame.document.querySelector("#party-pr").textContent = "Prospecting:" + prospecting;
		},100);
	}


}
