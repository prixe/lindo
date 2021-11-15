import {Mod} from "../mod";
import { ObjectItem, EffectInstance, ExchangeCraftResultMagicWithObjectDescMessage } from "./interfaces";
import runeSlotMap from './runes.map'

const MAGIC_POOL_INCREASE = 2
const MAGIC_POOL_LOSS = 3

// depth clone object to remove all refs
const clone = (obj) =>{
  if(!obj) return obj;
  return JSON.parse(JSON.stringify(obj))
}

export class ForgeMageExtend extends Mod {
    private styleTag: HTMLDivElement;
    private isInitialized = false;
    private tableContainer: HTMLDivElement;
    private historyContainer: HTMLDivElement;
    private currentItemRowEffects = {}
    private currentItemEffects = {}
    private currentItemId = null;
    private currentItemRunes = {}
    private inventoryRunes = {}
    private sink = 0;
    private buttonsContainer:HTMLDivElement;
    private basicWindow: HTMLDivElement;
    private advancedWindow: HTMLDivElement;
    private dropArea: HTMLDivElement;
    private currentRune: ObjectItem;
    private customDomElements = [];
    private sinkElement;

    startMod(): void {
        console.log("ForgeMageExtend started");
        this.loadStyles()
        this.registerHandlers();
    }

    public reset() {
      super.reset();
      this.cleanup();
    }

    getCurrentRuneInTable(){
      const runeUID = this.wGame.gui.playerData.jobs._getRuneOrPotionOnMagicTable()
      if(runeUID){
        return this.wGame.gui.playerData.inventory.objects[runeUID];
      }
    }
    // get all item effects to display in rows
    getItemEffects(objItem: ObjectItem){
      const itemPossibleEffects = clone(objItem.item.possibleEffectsMap);
      const itemEffects = clone(objItem.effectsMap)

      const allEffects = {
        ...itemPossibleEffects,
        ...itemEffects,
      }
      const mappedEffects = {}
      for(const k of Object.keys(allEffects)){
          const effect = itemEffects[k] || itemPossibleEffects[k];
          //append dicenum and diceside
          mappedEffects[k] = {...itemPossibleEffects[k], ...effect}
      }

      return mappedEffects;
    }
    // display item effects in table rows
    loadItemEffects(objItem: ObjectItem){
      this.currentItemRowEffects = {};
      this.currentItemEffects = this.getItemEffects(objItem);
      this.tableContainer.innerHTML = "";

      for(const k of Object.keys(this.currentItemEffects)){
        const effect = this.currentItemEffects[k];
        this.addItemEffect(effect);
      }

    }

    findCraftWindowBody(){
        const fmWindow = this.wGame.document.querySelector("#fm-window")
        if(fmWindow){
            this.isInitialized = true;
            return fmWindow;
        }
        const craftWindows = this.wGame.document.querySelectorAll(".CraftMagusWindow") || []
        for(let i=0;i<craftWindows.length; i++) {
            const craftW = craftWindows[i];
            if(!craftW.className.includes("CraftMagusMultiWindow")){
                return craftW.querySelector(".windowBody");
            }
        }
    }
   
    private createDefaultRow(){
      const cell: HTMLTableRowElement =  this.wGame.document.createElement("tr");
      cell.style.padding = "5px";
      // create columns
      cell.innerHTML = `
     <td colspan="2"></td>
     <td colspan="2"></td>
     <td colspan="4" style="text-align:left;"></td>
     <td colspan="2"></td>
     <td><div class="Slot ItemSlot itemType78" style="margin:auto;">
      <div class="slotIcon" style="background-image: none;"></div>
      <div class="quantity" style=""></div>
     </div></td>
    <td><div class="Slot ItemSlot itemType78" style="margin:auto;">
       <div class="slotIcon" style="background-image: none;"></div>
       <div class="quantity" style=""></div>
     </div></td>
     <td><div class="Slot ItemSlot itemType78" style="margin:auto;">
     <div class="slotIcon" style="background-image: none;"></div>
     <div class="quantity" style=""></div>
   </div></td>`

        return cell;
    }

    private updateRowEffect(row: HTMLTableRowElement, effect: EffectInstance){
      const value = effect.effect.bonusType * effect.value;
      const description =  effect.description
      const isExo = effect.diceNum === undefined
      let effectColor = ""
      if(!isExo){
        effectColor = value > 0 ? "#65e563" : (value === 0 ? "#5d5d5d" : "#f00")
      }else{
        effectColor = "#9ab3e5"
      }
      const col: any = row.children[2];
      col.innerText = description;
      col.style.color = effectColor;
    }

    private updateRowModif(row: HTMLTableRowElement, modif: number){
      const text: string = modif > 0 ? `+${modif}` : `${modif}`
      const col:any = row.children[3];
      col.innerText = text;
    }

    private updateRuneSlot(row, index, rune: ObjectItem = undefined) {
      if(!rune) return;
      const col: HTMLTableColElement = row.children[4 + index];
      const iconContainer:HTMLDivElement = col.querySelector(".slotIcon");
      const quantity:any = col.querySelector(".quantity");
      iconContainer.style.backgroundImage = rune.item.image || "none";
      quantity.textContent = rune.quantity || ""
      col.ondblclick = () => {
        this.placeRune(rune);
      }
    }
 
    private addItemEffect(effect: EffectInstance, difference:any = ""){
      const row = this.createDefaultRow();
      const cols = row.children;
      cols[0].textContent =  `${effect.diceNum || "-"}`;
      cols[1].textContent =  `${effect.diceSide || effect.diceNum || "-"}`;
      if(difference !== ""){
        if(difference > 0){
          row.className = "row-success"
        }else{
          row.className = "row-fail"
        }
      }
      this.updateRowEffect(row, effect)
      this.updateRowModif(row, difference)
      this.updateRuneSlot(row, 0)
      this.updateRuneSlot(row, 1)
      this.updateRuneSlot(row, 2)
      this.currentItemRowEffects[effect.effectId] = row;
      this.tableContainer.appendChild(row);
    }

    private resetObjectRunes(){
      this.currentItemRowEffects = {}
      if(this.tableContainer){
      const template = `
      <tr style="padding: 5px;">
                  <td colspan="2"></td>
                  <td colspan="2"></td>
                  <td colspan="4" style="text-align:left; color:green;"></td>
                  <td colspan="2"></td>
                  <td><div class="Slot ItemSlot itemType78" style="margin:auto;">
                    <div class="slotIcon" style="background-image: none;"></div>
                    <div class="quantity" style=""></div>
                  </div></td>
                  <td><div class="Slot ItemSlot itemType78" style="margin:auto;">
                    <div class="slotIcon" style="background-image: none;"></div>
                    <div class="quantity" style=""></div>
                  </div></td>
                  <td ><div class="Slot ItemSlot itemType78" style="margin:auto;">
                    <div class="slotIcon" style="background-image: none;"></div>
                    <div class="quantity" style=""></div>
                  </div></td>
                </tr>
      `
      let t = ""
      for(let i=0;i<10;i++)
      t+=template;
      this.tableContainer.innerHTML = t;
      }

    }
    
    onOpen = () => {
      this.historyContainer.scrollTo(0, this.historyContainer.scrollHeight);
    }

    registerHandlers(){
      const craftMagusInstance = this.wGame.gui.windowsContainer._childrenList.filter(x => x.id === "craftMagus")[0]
      if(!craftMagusInstance){
        console.log("Couldn't find craft magus windows something went wrong :(");
        return;
      }
      this.on(craftMagusInstance, "open", () => {
        const title = craftMagusInstance.windowTitle;
        const domTitle:HTMLDivElement = title.rootElement;
        const fm = domTitle.classList.contains("fm")
        if(fm) {
            this.onOpen();
            return;
        }
        const switchBtn:HTMLLabelElement = this.wGame.document.createElement("label");
        const switchLabel:HTMLLabelElement = this.wGame.document.createElement("label");
        switchLabel.className = "advanced-mode"
        switchLabel.textContent = "Advanced Mode"

        switchBtn.className = "switch";
        switchBtn.style.fontSize = "0.5rem";
        switchBtn.innerHTML = `
        <input type="checkbox">
        <span class="slider round"></span>
        `
        domTitle.classList.add("fm");
        domTitle.appendChild(switchLabel);
        domTitle.appendChild(switchBtn);
        
        switchBtn.onchange = (event) => {
          const isChecked = event.target["checked"]
          this.onToggleMode(isChecked, craftMagusInstance);
        } 
        this.customDomElements.push(switchBtn, switchLabel)
      })

      this.on(craftMagusInstance, "close", () => {
        this.currentRune = null;
        this.currentItemId = null;
        this.resetObjectRunes()
      })
      
       this.on(this.wGame.gui, "ExchangeObjectAddedMessage", this.onObjectAdded.bind(this))
       this.on(this.wGame.gui, "ExchangeObjectRemovedMessage", (msg) => {
         if(this.currentRune && this.currentRune.objectUID === msg.objectUID) {
           this.currentRune = null;
         }
         if(msg.objectUID === this.currentItemId){
           this.resetObjectRunes()
           this.currentItemId = null;
         }
       })
       this.on(this.wGame.gui, "ExchangeCraftResultMagicWithObjectDescMessage", this.onMageResult.bind(this))
    }

    private onToggleMode(advancedMode: boolean, craftMagusInstance: any){
        this.show(advancedMode, craftMagusInstance);
    }

    private show(isAdvancedMode: boolean, craftMagusInstance : any){
      if(isAdvancedMode){
        this.showAdvanced(craftMagusInstance);
      }else{
        this.showBasic();
      }
    }
    private showAdvanced(craftMagusInstance: any){
      if(!this.isInitialized){
        this._initialize(craftMagusInstance);
      }
      this._show(true);
    }

    private showBasic(){
      if(!this.isInitialized) return;
      this._show(false);
    }

    private _show(isAdvancedMode: boolean){
      if(isAdvancedMode){
        this.basicWindow.style.display = "none";
        this.advancedWindow.style.display = ""
        this.updateContainerControls();
      }else{
        this.basicWindow.style.display = "";
        this.advancedWindow.style.display = "none"        
        this.resetContainerControls();
      }
    }

    private _initialize(craftMagusInstance){
      
      const container = craftMagusInstance.windowBodyWrapper.rootElement;
      const body = craftMagusInstance.windowBody.rootElement;
      // clone craftingBox nodes
      this.dropArea = body.querySelector(".craftingBoxDropArea")
      this.buttonsContainer = body.querySelector(".buttonsContainer")


      const fmBody:HTMLDivElement = this.wGame.document.createElement("div");
      this.basicWindow = body;
      this.advancedWindow = fmBody;
      fmBody.id = "fm-window";
      fmBody.className = "windowBody fm"

      const myCol1: HTMLDivElement = this.wGame.document.createElement("div");
      myCol1.className = "col1"
      myCol1.style.maxWidth = "30%"
      myCol1.innerHTML = `
            <div class="mage-title">
            <span style="font-size:1.2rem">History</span>
            <div class="delete-btn" id="delete-btn" style="width:24px;height:24px">
            <svg fill="#fff" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"/></svg>
            </div>
            </div>
            <div class="history-wrapper">
              <div
                id="fm-history-container"
                class="mage-history"
              ></div>
              <div class="sink-container"">
              <label for="sink">Sink:</label>
              <input type="number" id="sink" name="sink" value="0" max="250">
              <div style="width:24px;height:24px;" class="edit-btn" id="edit">
              <svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
              </div>
            </div>
            `
      this.sinkElement = myCol1.querySelector("#sink");
      const editSinkBtn = myCol1.querySelector("#edit");
      editSinkBtn.addEventListener("click", () => {
        this.sinkElement.readOnly = false;
        this.sinkElement.focus();
      })
      this.sinkElement.readOnly = true;
      this.sinkElement.addEventListener("blur", () => {
        this.sinkElement.readOnly = true;
        const value = parseFloat(this.sinkElement.value) || 0;
        this.sinkElement.value = value;
        this.sink = value;
      })

      this.historyContainer = myCol1.querySelector("#fm-history-container");

      const deleteBtn = myCol1.querySelector("#delete-btn");
      deleteBtn.addEventListener("click", () => {
        this.historyContainer.innerHTML = "";
      })

      const myCol2 = this.wGame.document.createElement("div");
      myCol2.className = "col2"
      myCol2.innerHTML = 
            `
            <div class="flex flex-col">
            <div class="craftingBoxContainer"  id="fm-container">

            </div>
              <div id="fm-table">
                <table style="width: 100%; margin-top: 5px">
                  <thead>
                    <tr>
                      <th colspan="2">Min</th>
                      <th colspan="2">Max</th>
                      <th colspan="4" style="text-align: left">Effects</th>
                      <th>Modif.</th>
                      <th colspan="2"></th>
                      <th>Pa</th>
                      <th>Ra</th>
                    </tr>
                  </thead>
                  <tbody style="text-align: center" id="item-data"></tbody>
                </table>
              </div>
            </div>`
            const table = myCol2.querySelector("#fm-table")
            fmBody.appendChild(myCol1)
            fmBody.appendChild(myCol2)

           
            this.tableContainer = table.querySelector("#item-data")
            this.resetObjectRunes();

            container.appendChild(fmBody);
            this.customDomElements.push(fmBody);
            this.isInitialized = true;
    }

    updateContainerControls() {
        const controlsContainer:HTMLDivElement = this.advancedWindow.querySelector("#fm-container")
        this.buttonsContainer.className = "btn-box"
        controlsContainer.append(this.dropArea)
        controlsContainer.append(this.buttonsContainer)

        for(let i=0;i<this.buttonsContainer.children.length;i++){
          const button = this.buttonsContainer.children[i]
          button.classList.add("w-100")
        }
    }

    resetContainerControls(){
      const col1 = this.basicWindow.querySelector(".col1");
      this.buttonsContainer.className = "buttonsContainer"
      const container = col1.querySelector(".craftingBoxContainer");
      container.append(this.dropArea);
      col1.appendChild(this.buttonsContainer);
    }

    getRow(effectId:number){
      return this.currentItemRowEffects[effectId]
    }

    updateEffects(effects: any){
      this.tableContainer.innerHTML = "";
      for(const k of Object.keys(effects)){
        const effect = effects[k];
        this.addItemEffect(effect, effect.difference || "");
      }
    }

    loadInventoryRunes(){
        this.inventoryRunes = {}
        const items = this.wGame.gui.playerData.inventory.objects
        for(const k of Object.keys(items)){
            const obj = items[k]
            if(obj.item.typeId === 78){
                this.inventoryRunes = obj.effects.reduce((acc, x) => {
                    if(!acc[x.actionId]){
                        acc[x.actionId] = {}
                    }
                    const runeInfo = runeSlotMap[x.actionId];
                    if(!runeInfo) return acc;
                    const {slot} = runeInfo[obj.id]
                    acc[x.actionId][slot] = obj;
                    return acc
                }, this.inventoryRunes)
            }
        }
    }

    loadRunesForItem(objectItem: ObjectItem){
      this.currentItemRunes = {}
      if(!objectItem){
          return;
      }
      const effects = this.getItemEffects(objectItem)
     
      for(const effectId in effects){
        const runes = this.inventoryRunes[effectId]
          if(runes){
              this.currentItemRunes[effectId] =  runes
          }
      }
     
      for(const effectId in this.currentItemRunes){
        const itemRunes = this.currentItemRunes[effectId];
        const row = this.currentItemRowEffects[effectId]
        if(row){
          this.updateRuneSlot(row, 0, itemRunes[0])
          this.updateRuneSlot(row, 1, itemRunes[1])
          this.updateRuneSlot(row, 2, itemRunes[2])
        }
      }
  }

  // Place object rune in crafting window
  placeRune(rune: ObjectItem) {
    if (rune) {
        this.currentRune = rune;
        this.wGame.gui.playerData.jobs.moveItemToCraft("craftInventory", rune, rune.quantity)
    }
  }
    // Get item modified properties and call update log
    onMageResult(mageResult: ExchangeCraftResultMagicWithObjectDescMessage){
        this.wGame.gui.playerData.inventory.once("itemModified", (item: ObjectItem)=>{
            const newItemEffects = this.getItemEffects(item);
            const oldItemEffects = this.currentItemEffects;
            const updatedEffects = {}
            for(const k in newItemEffects){
              const effect: EffectInstance = newItemEffects[k];
              const oldEffect = oldItemEffects[k];
              let diff = 0;
              if(oldEffect){
                diff = effect.value - oldEffect.value;
              }else{
                diff = effect.value;
              }
              updatedEffects[k] = {...effect, difference: diff}
            }
            const newK = Object.keys(newItemEffects)
            const oldK = Object.keys(oldItemEffects)

            const missing = oldK.filter((x) =>  !newK.includes(x))
            const missingEffects = {}
            for(const k of missing){
              const v = -oldItemEffects[k].value
              missingEffects[k] = {...oldItemEffects[k], difference: v}
            }
            const roweffects = {
              ...updatedEffects,
              ...missingEffects,
            }
            this.updateEffects({
              ...updatedEffects,
              ...missingEffects,
            })
            const modified = []
            for(const k in roweffects){
                if(roweffects[k].difference){
                    modified.push(roweffects[k])
                }
            }
            

            this.updateLog(modified, mageResult)
            
            this.currentItemEffects = newItemEffects;
            this.update(item);
        })
    }
    
    getCurrentRuneWeight(){
      if(this.currentRune){
        const runeEffect = this.currentRune.effects.sort((a,b) => a.effectId - b.effectId)[0]
        const runeInfo = runeSlotMap[runeEffect.actionId];
        const total = runeInfo["weight"] * runeEffect.value;
        return total; 
      }
      return 0;
    }

    calculateSink(effectIntances: EffectInstance[]){
      const rune = this.currentRune;
      let totalSink = 0;
      if (rune){
        const runeEffect = rune.effects.sort((a,b) => a.effectId - b.effectId)[0]
        for(const effect of effectIntances){
          // we don't want to calculate sink of current rune
          if (effect.effectId === runeEffect.effectId) continue;
          const newValue = effect["difference"];
          const runeInfo = runeSlotMap[effect.effectId]
          const w = runeInfo["weight"]
          const ds = Math.abs(w * newValue);
          totalSink += ds;
        }
          const currentInfo = runeSlotMap[runeEffect.effectId]
          const currentWeight = currentInfo["weight"]
          totalSink -= currentWeight * runeEffect.value; 
        }
      return totalSink;
    }

    updateSink(newVal: number) {
      this.sink = newVal;
      if(this.sinkElement){
        this.sinkElement.value = Math.max(newVal, 0);
      }
    }
    
    // Update log container
    updateLog(effectIntances: EffectInstance[], mageResult: ExchangeCraftResultMagicWithObjectDescMessage){
      const logResult:any = {}
      const effectModifiers = [];
      const log = [];
      const rune:ObjectItem = this.getCurrentRuneInTable();
      logResult.runeIMG = rune ? rune.item.image : "none";
      logResult.pool = mageResult.magicPoolStatus
      for(const effect of effectIntances){
        const name = this.getEffectName(effect);
        const newValue = effect["difference"];
        const sign = newValue > 0 ? "+" : "";
        effectModifiers.push(newValue);
        log.push(`${sign}${newValue} ${name}`)
      }
      if(mageResult.magicPoolStatus === MAGIC_POOL_INCREASE){
        this.sink += this.calculateSink(effectIntances);
      }else if (mageResult.magicPoolStatus === MAGIC_POOL_LOSS) {
        const weight = this.getCurrentRuneWeight();
        this.sink = Math.max(this.sink - weight, 0);
      }
      this.updateSink(this.sink);

      const min = Math.min(...effectModifiers)
      const max = Math.max(...effectModifiers);
      if(min > 0 && max > 0){
        logResult.status = "success"
      }else if(min < 0 && max < 0){
        logResult.status = "fail"
      }else{
        logResult.status = "neutral"
      }

      if(mageResult.magicPoolStatus === MAGIC_POOL_LOSS){
        log.push("-sink")
      }else if(mageResult.magicPoolStatus === MAGIC_POOL_INCREASE){
        log.push("+sink")
      }

      logResult.logs = log.join(","); 
      if(logResult.logs.length === 0){
        logResult.logs = "Fail"
        logResult.status = "fail"
      }
      this.appendHistoryResult(logResult);
    }

    // Get name of rune effect only
    getEffectName(effectInstance: EffectInstance){
      const description = effectInstance.effect.descriptionId;
      const names = description.split(/#\d+/)
      return names[names.length - 1];
    }

    onObjectAdded({object}){
      const currentItem: ObjectItem = this.wGame.gui.playerData.inventory.objects[object.objectUID];
      if (currentItem.item.typeId === 78) {
        this.currentRune = currentItem;
        return;
      }
      // Prevent object reload same item on update
      if(currentItem === this.currentItemId) return;
      this.currentItemId = currentItem.objectGID;
      if(currentItem){
        this.loadItemEffects(currentItem);
        this.update(currentItem);
        this.updateSink(0)
      }
    }

    update(item: ObjectItem){
      this.loadInventoryRunes();
      this.loadRunesForItem(item);
    }

    appendHistoryResult(result){
      const resultElement = this.wGame.document.createElement("div")
      resultElement.className = "mage-result"

      resultElement.innerHTML = `
      <div class="icon"></div>
      <p class="result-${result.status}">${result.logs}</p>
      `
      const img:HTMLDivElement = resultElement.querySelector(".icon")
      img.style.backgroundImage = result.runeIMG
      this.historyContainer.appendChild(resultElement);
      this.historyContainer.scrollTo(0, this.historyContainer.scrollHeight);
    }

    loadStyles() {
        this.styleTag = this.wGame.document.createElement('style');
        this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag);
        const styles = `
        .fm .mage-history{
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
            padding-left: 0.5rem;
            height: 90%;
        }

        .fm .craftingBoxContainer{
            text-align: center!important;
        }

        .fm .craftingBox {
            padding: 7px 10px!important;
            height: auto!important;
        }
        
        .fm .mage-history::-webkit-scrollbar {
            width: 8px;
          }
        
          .fm table {
            border-collapse: collapse;
            width: 100%;
          }
        
          .fm table tbody {
            display: block;
            max-height: 445px;
            overflow-y: auto;
            overflow-x: hidden;
          }
          
          .fm table thead, .fm table tbody tr {
            display: table;
            width: 100%;
            table-layout: fixed;
          }
          
          .fm td {
            white-space: nowrap;
            border:none;
           }
        
           .fm th {
                border:none;
                background-color: #0000003d;
                padding-top: 4px;
                padding-bottom: 4px;
           }
        
           .fm tr:nth-child(even) {
            background-color: #0000003d;
          }
        
          .fm td:not(:first-child) {
           
          }
        
          /* Track */
          .fm .mage-history::-webkit-scrollbar-track {
            background: #f1f1f1; 
          }
           
          /* Handle */
          .fm .mage-history::-webkit-scrollbar-thumb {
            background: rgb(188, 207, 11); 
          }
        
           /* Track */
           .fm table ::-webkit-scrollbar-track {
            background: #f1f1f1; 
          }
           
          /* Handle */
          .fm table ::-webkit-scrollbar-thumb {
            background: rgb(188, 207, 11); 
          }
        
          .fm table ::-webkit-scrollbar {
            width: 2px;
          }
          
          .fm .mage-result{
            width: 100%;
            display:flex;
            flex-direction:row;
            align-items: center;
            padding: 2px;
            margin: 2px;
        }
        .fm .mage-result .icon {
            background-image: none;
            background-repeat: no-repeat;
            width: 24px;
            background-size: contain;
            height: 24px;
            margin-right: 5px;
        }
        
        .fm .mage-result p {
            margin: 0;
            max-width: 85%;
        }
        
        .fm .mage-title{
          margin-bottom: 5px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-bottom: 1px solid;
          padding: 3px;
          justify-content: space-between;
        }
        
        .fm .result-success {
            color: rgb(19, 143, 19);
        }
        
        .fm .result-neutral {
            color: rgb(186, 199, 10);
        }
        
        .fm .result-fail {
            color: rgb(211, 28, 28);
        }
        
        .fm .btn-box{
            display: flex;
            flex-direction: row;
            padding: 0rem 1rem 0.2rem 1rem;
        }
        
        .fm .w-100{
            width: 100%;
        }

        .fm .row-fail {
          background-color: #9a000059!important;;
        }

        .fm .row-success {
          background-color: #309e3859!important;;
        }
        
        .fm .history-wrapper {
            display: flex;
            flex-direction: column;
            height: 95%;
            justify-content: space-between;
        }
        
        .fm .flex {
            display:flex;
        }
        
        .fm .flex-col {
            flex-direction: column;
        }

        .fm .switch {
          position: relative;
          display: inline-block;
          width: 3.75em;
          height: 2.125em;
          font-size: 0.7rem;
          position: absolute;
          left: 12rem;
        }
        
        .fm .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .fm .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
        }
        
        .fm .slider:before {
          position: absolute;
          content: "";
          height: 1.625em;
          width: 1.625em;
          left: 0.25em;
          bottom: 0.25em;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
        }
        
        .fm input:checked + .slider {
          background-color: #2196F3;
        }
        
        .fm input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }
        
        .fm input:checked + .slider:before {
          -webkit-transform: translateX(1.625em);
          -ms-transform: translateX(1.625em);
          transform: translateX(1.625em);
        }
        
        /* Rounded sliders */
        .fm .slider.round {
          border-radius: 2.125em;
        }
        
        .fm .slider.round:before {
          border-radius: 50%;
        }

        .fm .advanced-mode {
          position: absolute;
          left: 3rem;
          font-size: 1rem;
        }

        /* Chrome, Safari, Edge, Opera */
      .fm input::-webkit-outer-spin-button,
      .fm input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      
      /* Firefox */
      .fm input[type=number] {
        -moz-appearance: textfield;
      }
      
      .fm input {
      	font-size: 1.5rem;
      	max-width: 4rem;
      	border: none;
      }
      
      .fm input:-moz-read-only {
      	outline: none;
      	cursor: pointer;
      }
      
      .fm input:read-only {
      	outline: none;
      	cursor: pointer;	
      }
      
      .fm .edit-btn {
      	outline: none;
      	cursor: pointer;
      	width: 24px;
      	height: 24px;
      }
      
      .fm .sink-container{
      	display: flex;
      	flex-direction: row;
      	align-items:center;
        justify-content: space-evenly;
      	width: 200px;
        flex: 1;
      }
      .fm .sink-container label {
        font-size: 1.3rem; 
      }
        `
        this.styleTag.innerHTML = styles;
    }
    private removeChild = (element) => {
      const parent = element.parentElement;
      if(parent){
        parent.removeChild(element);
      }
    }
    private resetValues = () => {
      this.currentItemRowEffects = {}
      this.currentItemEffects = {}
      this.currentItemId = null;
      this.currentItemRunes = {}
      this.inventoryRunes = {}
      this.updateSink(0);
    }
    private cleanup(){
      if(this.isInitialized){
      this.resetValues();
      this.resetContainerControls();
      this.removeChild(this.styleTag);
      for(const element of this.customDomElements){
        this.removeChild(element)
      }
      this.customDomElements = [];
    }
      this.isInitialized = false;
    }
}
