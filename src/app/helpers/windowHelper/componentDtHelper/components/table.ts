export class Table {
    private wGame: any|Window;

    private table: HTMLDivElement;
    private tableHeader: HTMLDivElement;
    private tableContent: HTMLDivElement;

    private columns: {name: string, style: {cssRule: string, value: string}[], caseStyle?: {cssRule: string, value: string}[]}[];

    constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Create an empty table with only header
     * @param id The id of table
     * @param header Define the name of col and is size with style object
     * @param customClass A custom className for add your css
     * @returns An instance of this Table
     */
    public createTable(id: string, columns: {name: string, style: {cssRule: string, value: string}[], caseStyle?: {cssRule: string, value: string}[]}[], customClass?: string): Table {
        this.columns = columns;

        // Define container
        this.table = this.wGame.document.createElement('div');
        this.table.id = id;
        this.table.className = 'TableV2';
        if (customClass)  this.table.classList.add(customClass);

        this.tableHeader = this.wGame.document.createElement('div');
        this.tableHeader.id = id + '-theader';
        this.tableHeader.className = 'tableHeader';
        this.tableHeader.style.margin = '0';

        this.tableContent = this.wGame.document.createElement('div');
        this.tableContent.id = id + '-tscroller';
        this.tableContent.className = 'customScrollerContent tableContent';

        // Create header
        const headerRow: HTMLDivElement = this.wGame.document.createElement('div');
        headerRow.className = 'row';

        this.columns.forEach((column) => {
            const col: HTMLDivElement = this.wGame.document.createElement('div');
            col.className = 'col';
            col.insertAdjacentHTML('beforeend', `<div class="headerContent">${column.name}</div>`);
            column.style.forEach(style => {
                col.style[style.cssRule] = style.value;
            });

            headerRow.insertAdjacentElement('beforeend', col);
        });

        // insert container in table
        this.tableHeader.insertAdjacentElement('beforeend', headerRow);
        this.table.insertAdjacentElement('beforeend', this.tableHeader);
        this.table.insertAdjacentElement('beforeend', this.tableContent);

        return this;
    }

    /**
     * Use this to add your data
     * (Use only after push the HTMLDivElement in the DOM)
     * @param data The data to add
     */
    public addData(data: Array<Array<string|HTMLDivElement>>) {
        this.insertData(data);
    }

    /**
     * Use this for update data
     * This function remove all data before insert new data
     * @param data The new data
     */
    public updateData(data: Array<Array<string|HTMLDivElement>>) {        
        // Remove all row
        while (this.tableContent.firstChild) this.tableContent.removeChild(this.tableContent.firstChild);

        this.insertData(data);
    }

    /**
     * Use to get the HTMLElement of the table
     * @returns The HTMLDivElement of table
     */
    public getTableHtmlElement(): HTMLDivElement {
        return this.table;
    }

    private insertData(data: Array<Array<string|HTMLDivElement>>) {
        // Create content
        data.forEach((row, i) => {
            const rowDiv: HTMLDivElement = this.wGame.document.createElement('div');
            rowDiv.className = 'row';
            if (i%2 != 0) rowDiv.classList.add('odd');

            row.forEach((col, j) => {
                const colDiv: HTMLDivElement = this.wGame.document.createElement('div');
                colDiv.className = 'col customCol';
                if (typeof col == 'string') colDiv.insertAdjacentText('beforeend', col);
                else colDiv.insertAdjacentElement('afterbegin', col);

                if (j <= this.columns.length) {
                    this.columns[j].style.forEach(style => {
                        colDiv.style[style.cssRule] = style.value;
                    });
                    if (this.columns[j].caseStyle) {
                        this.columns[j].caseStyle.forEach(caseStyle => {
                            colDiv.style[caseStyle.cssRule] = caseStyle.value;
                        });
                    }
                    rowDiv.insertAdjacentElement('beforeend', colDiv);
                }
            });

            if (row.length > this.columns.length) console.log(`[Error] This row is longer than header (row:${i}) : `, row);

            this.tableContent.insertAdjacentElement('beforeend', rowDiv);
        });
    }
}