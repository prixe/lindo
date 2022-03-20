export class Table {
    private wGame: any|Window;

    private table: HTMLDivElement;
    private tableHeader: HTMLDivElement;
    private tableContent: HTMLDivElement;

    private columns: {name: string, style: {cssRule: string, value: string}[], caseStyle?: {cssRule: string, value: string}[]}[];

    private constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Create an empty table with only header
     * @param id The id of table
     * @param header Define the name of col and is size with style object
     * @param customClass A custom className for add your css
     * @returns An instance of this Table
     */
    public static createTable(wGame: any|Window, id: string, columns: {name: string, style: {cssRule: string, value: string}[], caseStyle?: {cssRule: string, value: string}[]}[], customClass?: string): Table {
        const instance: Table = new Table(wGame);

        instance.columns = columns;

        // Define container
        instance.table = wGame.document.createElement('div');
        instance.table.id = id;
        instance.table.className = 'TableV2';
        if (customClass)  instance.table.classList.add(customClass);

        instance.tableHeader = wGame.document.createElement('div');
        instance.tableHeader.id = id + '-theader';
        instance.tableHeader.className = 'tableHeader';
        instance.tableHeader.style.margin = '0';

        instance.tableContent = wGame.document.createElement('div');
        instance.tableContent.id = id + '-tscroller';
        instance.tableContent.className = 'customScrollerContent tableContent';

        // Create header
        const headerRow = wGame.document.createElement('div');
        headerRow.className = 'row';

        instance.columns.forEach((column) => {
            const col = wGame.document.createElement('div');
            col.className = 'col';
            col.insertAdjacentHTML('beforeend', `<div class="headerContent">${column.name}</div>`);
            column.style.forEach(style => {
                col.style[style.cssRule] = style.value;
            });

            headerRow.insertAdjacentElement('beforeend', col);
        });

        // insert container in table
        instance.tableHeader.insertAdjacentElement('beforeend', headerRow);
        instance.table.insertAdjacentElement('beforeend', instance.tableHeader);
        instance.table.insertAdjacentElement('beforeend', instance.tableContent);

        return instance;
    }

    /**
     * Use this for update data
     * This function remove all data before insert new data
     * @param data The new data
     */
    public upsertData(data: Array<Array<string|HTMLDivElement>>) {        
        // Remove all row
        while (this.tableContent.firstChild) this.tableContent.removeChild(this.tableContent.firstChild);

        this.insertData(data);
    }

    /**
     * Use to get the HTMLElement of the table
     * @returns The HTMLDivElement of table
     */
    public get getHtmlElement(): HTMLDivElement {
        return this.table;
    }

    /**
     * Use this to add your data
     * (Use only after push the HTMLDivElement in the DOM)
     * @param data The data to add
     */
    public insertData(data: Array<Array<string|HTMLDivElement>>) {
        // Create content
        data.forEach((row, i) => {
            const rowDiv = this.wGame.document.createElement('div');
            rowDiv.className = 'row';
            if (i%2 != 0) rowDiv.classList.add('odd');

            row.forEach((col, j) => {
                const colDiv = this.wGame.document.createElement('div');
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

            if (row.length > this.columns.length) throw new Error(`[Error] This row is longer than header (row:${i}) : ${row}`);

            this.tableContent.insertAdjacentElement('beforeend', rowDiv);
        });
    }
}