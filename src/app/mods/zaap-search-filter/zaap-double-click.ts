import {Mod} from "../mod";

export class ZaapDoubleClick extends Mod {
 private Zaap;
 private DivList = []

    startMod(): void { 

        this.on(this.wGame.dofus.connectionManager, "ZaapListMessage", (e) => {
            this.getZaap(e);
            this.DivList = []
        });

        this.on(this.wGame.dofus.connectionManager, "TeleportDestinationsListMessage", (e) => {
            this.getZaapiPrism(e);
            this.DivList = []
        });

   }   

private getZaap(e){
   const Zaap = this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="teleporterList")
   const ZaapList = Zaap.zaapBody.panelCollection.Zaap.table.content._childrenList
   const PrismList = Zaap.zaapBody.panelCollection.Prism.table.content._childrenList
      for (var i = 0; i < ZaapList.length - 1; i++) {
          this.DivList.push(ZaapList[i].rootElement)
      }
      for (var i = 0; i < PrismList.length - 1; i++) {
         this.DivList.push(PrismList[i].rootElement)
      }
      this.DivList.forEach(element => {
          element.addEventListener('dblclick', () => { Zaap.windowBody._childrenList.find(e => e.rootElement?.classList?.contains('footer'))._childrenList[0].tap(); })
      })
}



private getZaapiPrism(e){
  const Zaapi =  this.wGame.gui.windowsContainer.getChildren().find(e=>e.id=="teleporterList")
  const ZaapiListC = Zaapi.subwayBody.panelCollection.CraftHouse.table.content._childrenList
  const ZaapiListB = Zaapi.subwayBody.panelCollection.BidHouse.table.content._childrenList
  const ZaapiListM = Zaapi.subwayBody.panelCollection.Misc.table.content._childrenList
  if(e.teleporterType === 1){
    for (var i = 0; i < ZaapiListC.length - 1; i++) {
        this.DivList.push(ZaapiListC[i].rootElement)
    }
    for (var i = 0; i < ZaapiListB.length - 1; i++) {
        this.DivList.push(ZaapiListB[i].rootElement)
    }
    for (var i = 0; i < ZaapiListM.length - 1; i++) {
       this.DivList.push(ZaapiListM[i].rootElement)
    }
    this.DivList.forEach(element => {
       element.addEventListener('dblclick', () => { Zaapi.windowBody._childrenList.find(e => e.rootElement?.classList?.contains('footer'))._childrenList[0].tap(); })
    })
  }
  

}

}
