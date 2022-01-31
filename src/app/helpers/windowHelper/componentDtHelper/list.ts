export class List {
    private wGame: any|Window;

    private constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    list: HTMLDivElement;

    /**
     * Return an HTMLDivElement with dofus touch list skin
     * @param id The div id
     * @param choices Array of choices in list
     * @param customClassName A custom className for add your css
     */
    public static createList(wGame: any|Window, id: string, choices: Array<{id: string, text: string}>, customClassName?: string): List {
        const instance: List = new List(wGame);

        // Create container
        instance.list = wGame.document.createElement('div');
        instance.list.id = id;
        instance.list.className = 'menu';
        if (customClassName) instance.list.classList.add(customClassName);

        const scrollableContent = wGame.document.createElement('div');
        scrollableContent.className = 'scrollableContent customScrollerContent';

        // Create item for each choice
        choices.forEach((choice, i) => {
            const item = wGame.document.createElement('div');
            item.className = 'listItem';
            if (i == 0) item.classList.add('selected');
            if (i%2 != 0) item.classList.add('odd');
            item.dataset.id = choice.id;
            item.textContent = choice.text;

            scrollableContent.insertAdjacentElement('beforeend', item);
        })

        instance.list.insertAdjacentElement('afterbegin', scrollableContent);

        return instance;
    }

    /**
     * Add event on item in list, return the item id and text
     * @param callBack The method to execute on list item click
     */
    public addListEvent(callBack: any) {
        const scrollableContent = this.list.children[0];

        let onClick = (element) => {
            const selectedItem = scrollableContent.getElementsByClassName('selected')[0];
            if (selectedItem.classList.contains('selected')) selectedItem.classList.remove('selected');
            element.classList.add('selected');

            callBack({id: element.dataset.id, text: element.textContent});
        };

        // Add click event on each item
        Array.from(scrollableContent.getElementsByClassName('listItem')).forEach(item => {
            if (item == undefined) return;
            item.addEventListener('click', onClick);
        });
    }

    /**
     * Use to get the HTMLElement of the list
     * @returns The HTMLDivElement of list
     */
    public getListHtmlElement(): HTMLDivElement {
        return this.list;
    }
}