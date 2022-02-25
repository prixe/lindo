import { Table } from "../../helpers/windowHelper/componentDtHelper/components/table";
import { CustomWindowHelper } from "../../helpers/windowHelper/customWindow.helper";
import { DraggableWindowHelper } from "../../helpers/windowHelper/draggableWindow.helper";
import { Mod } from "../mod";
import axios from 'axios';

export class SalesSummary extends Mod {
    private sales: any[][] = [];
    private awaitingSales: {id: number, price: number, quantity: number}[] = [];
    private totalSales: number = 0;
    private resourcesKnow: Item[] = [];

    private debounce: ReturnType<typeof setTimeout>;

    // Helper for ui
    private windowHelper: CustomWindowHelper;

    // Ui element
    private window: DraggableWindowHelper;
    private table: Table;
    private resumeBox: HTMLDivElement;

    startMod() {
        // Init global variable
        this.windowHelper = new CustomWindowHelper(this.wGame);
        this.window = this.windowHelper.getWindow();

        let salesSummaryCss = document.createElement('style');
        salesSummaryCss.id = 'salesSummaryCss';
        salesSummaryCss.innerHTML = `
            #sales-summary {
                min-width: 600px; min-height: 60vh;
                left: calc(50vw - 300px);
                top: calc(50vh - 35vh);
            }
            .sls-smy-img, .sls-smy-img img {
                width: 35px;
                height: 35px;
            }

            #sales-summary .windowContent .windowBodyWrapper .windowBody {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            #sls-smy-total {
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 15px;
            }
            .sls-smy-total-text {
                margin: 10px;
            }
        `;
        this.wGame.document.querySelector('head').appendChild(salesSummaryCss);

        this.createWindow();
        this.onTextInformationMessage();
    }

    /**
     * Build the window of sales summary
     */
    private createWindow() {
        this.window.createDofusWindow('Récapitulatif des ventes', 'sales-summary').makeDraggable().hide();

        // Define table
        this.table = this.windowHelper.getComponentHelper.Table.createTable(
            'sls-smy',
            [
                {name: '', style: [{cssRule: 'minWidth', value: '65px'}]},
                {name: 'Item', style: [{cssRule: 'flex', value: '2 0 0%'}], caseStyle: [{cssRule: 'justifyContent', value: 'end'}]},
                {name: 'Quantité', style: [{cssRule: 'minWidth', value: '75px'}]},
                {name: 'Gain', style: [{cssRule: 'flex', value: '1 0 0%'}], caseStyle: [{cssRule: 'justifyContent', value: 'flex-end'}]}
            ]
        );

        // Create contentBox to display total kamas/quantity sold
        this.resumeBox = this.windowHelper.WindowContent.createContentBox('sls-smy-total');
        const qtySold: HTMLDivElement = this.wGame.document.createElement('div');
        qtySold.className = 'sls-smy-total-text';
        const totalPrice: HTMLDivElement = this.wGame.document.createElement('div');
        totalPrice.className = 'sls-smy-total-text';
        this.resumeBox.append(qtySold, totalPrice);

        // Add element to window
        this.window.addContent(this.table.getTableHtmlElement()).addContent(this.resumeBox);
    }

    private onTextInformationMessage() {
        this.on(this.wGame.dofus.connectionManager, 'TextInformationMessage', async (e:any) => {
            if (e.msgId == 73) {
                this.awaitingSales.push({id: e.parameters[1], price: e.parameters[0], quantity: e.parameters[3]});

                // Use debounce to be sure to get all data before load
                if (this.debounce) clearInterval(this.debounce);
                this.debounce = setTimeout(() => {
                    this.loadData().then(() => {
                        this.table.addData(this.sales);
                        this.resumeBox.children[0].insertAdjacentText('beforeend', `Item(s) vendu : ${this.sales.length}`);
                        this.resumeBox.children[1].insertAdjacentText('beforeend', `Total gains : ${this.formatNumber(this.totalSales)} k`);
                        this.window.show();
                    });
                }, 500);
            }
        });
    }

    /**
     * Load data for all entry in awaitingSales, add await to load one time a same item
     */
    private async loadData() {
        for await (const item of this.awaitingSales) {
            if (this.resourcesKnow[item.id] == null) {
                const res = await axios.post('https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=1.49.9', {class: "Items", ids: [item.id]});
                this.resourcesKnow[item.id] = {name: res.data[item.id].nameId, iconId: res.data[item.id].iconId};
            }

            this.createItem(this.resourcesKnow[item.id], item.price, item.quantity);
        }
    }

    /**
     * Create the HTMLDivElement for the item image and push data to final array
     */
    private createItem(item: Item, price: number, quantity: number) {
        const img: HTMLDivElement = this.wGame.document.createElement('div');
        img.className = 'sls-smy-img';
        img.insertAdjacentHTML('afterbegin', `<img src="https://dofustouch.cdn.ankama.com/assets/2.34.8_kbu_6h45kmUJaqYJSzE(uwaos..pYYKs/gfx/items/${item.iconId}.png">`);
    
        this.totalSales += +price;
        this.sales.push([img, item.name, quantity, this.formatNumber(price) + ' k']);
    }

    private formatNumber(number: number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
}

export interface Item {
    name: string;
    iconId: number;
}