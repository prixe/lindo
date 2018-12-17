import { Mods } from "../mods";
import { TranslateService } from "@ngx-translate/core";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";
/**
 * This mod add the possibility to show party level and prospection count
 */
export class PartyInfo extends Mods {
	
	private partyInitialized:boolean;
	private container: any;
	
	constructor(
		wGame: any,
		private party_info: boolean,
		private translate: TranslateService
	) {
		super(wGame);
		this.translate = translate;
		Logger.info("-partyInfo");
		Logger.info(this.party_info);
		if(this.party_info){
		this.partyInitialized = (this.wGame.document.querySelector("#party-info-container") === null ? false : true);
		setTimeout(()=>{this.onPartyJoin()},100);
		this.on(this.wGame.dofus.connectionManager, 'PartyJoinMessage', this.onPartyJoin.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyUpdateMessage',this.updatePartyInfo.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyMemberEjectedMessage',this.updatePartyInfo.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyMemberRemoveMessage',this.updatePartyInfo.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyNewMemberMessage',this.updatePartyInfo.bind(this));
		this.on(this.wGame.dofus.connectionManager,'PartyUpdateMessage',this.updatePartyInfo.bind(this));
		}
	}	
	
	 private onPartyJoin(){
			if (!this.partyInitialized) {
				this.updatePartyInfo();
			}
	}
	//initialize party info container
	private initializePartyInfo() {	
		if (this.partyInitialized)
			return;
		let partyBoxes = this.wGame.document.querySelector(".partyBoxes");
		if(!partyBoxes) return;
		let parent = partyBoxes.parentElement;
		this.container = this.wGame.document.createElement("div");
		this.container.style = "background: #333;border-radius: 5px;margin-bottom: 5px;";
		let partyLevelElement = this.wGame.document.createElement("div");
		let prospectionCountElement = this.wGame.document.createElement("div");
		
		this.container.id = "party-info-container";
		
		partyLevelElement.textContent = "Level:?";
		partyLevelElement.id = "party-level";
		partyLevelElement.style = "user-select: none;cursor: default;"
		
		prospectionCountElement.textContent = "Prospecting:?";
		prospectionCountElement.id = "party-pr";
		prospectionCountElement.style = "font-size: 9px;user-select: none;cursor: default;"
		
		this.container.appendChild(partyLevelElement);
		this.container.appendChild(prospectionCountElement);
		
		parent.insertBefore(this.container, partyBoxes);
		this.partyInitialized = true;
		
	}
	private destroy(){
		this.partyInitialized = false;
		if (this.container && this.container.parentElement) this.container.parentElement.removeChild(this.container);
	}
	
	
	//update party data
	private updatePartyInfo() {
		if(!this.partyInitialized){
			this.initializePartyInfo();
		}
		setTimeout(()=>{
			try{
				var partyLevel = 0;
				var prospecting = 0;
				if(this.wGame.gui.party.currentParty)
					this.wGame.gui.party.currentParty._childrenList.forEach((c) => {
						partyLevel += c.memberData.level;
						prospecting += c.memberData.prospecting;
				});
				this.wGame.document.querySelector("#party-level").textContent = this.translate.instant('app.option.vip.party-info.level') +": "+ (isNaN(partyLevel) ? "?" : partyLevel);
				this.wGame.document.querySelector("#party-pr").textContent = this.translate.instant('app.option.vip.party-info.prospecting') +": "+ (isNaN(prospecting) ? "?":prospecting);
			}catch(e){}
		},Math.random() * (500));
	}
		
	
	 public reset() {
        super.reset();
        if (this.party_info) {
          this.destroy();
        }
    }


}
