import { WindowContentHelper } from "../../windowContent.helper";

export class List {
    private wGame: any|Window;

    constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Return an HTMLDivElement with dofus touch list skin
     * @param id The div id
     * @param choices Array of choices in list
     * @param customClassName A custom className for add your css
     */
    public createList(id: string, choices: Array<{id: string, text: string}>, customClassName?: string): HTMLDivElement {
        // Create container
        const list: HTMLDivElement = this.wGame.document.createElement('div');
        list.id = id;
        list.className = 'menu';
        if (customClassName) list.classList.add(customClassName);

        const scrollableContent: HTMLDivElement = this.wGame.document.createElement('div');
        scrollableContent.className = 'scrollableContent customScrollerContent';

        // Create item for each choice
        choices.forEach((choice, i) => {
            const item: HTMLDivElement = this.wGame.document.createElement('div');
            item.className = 'listItem';
            if (i == 0) item.classList.add('selected');
            if (i%2 != 0) item.classList.add('odd');
            item.dataset.id = choice.id;
            item.textContent = choice.text;

            scrollableContent.insertAdjacentElement('beforeend', item);
        })

        list.insertAdjacentElement('afterbegin', scrollableContent);

        return list;
    }

    /**
     * Add event on item in list, return the item id and text
     * @param list The list you wan't to add event
     * @param callBack The method to execute on list item click
     */
    public addListEvent(list: HTMLDivElement, callBack: any) {
        const scrollableContent = list.children[0];

        let onClick = (element) => {
            const selectedItem = scrollableContent.getElementsByClassName('selected')[0];
            if (selectedItem.classList.contains('selected')) selectedItem.classList.remove('selected');
            element.classList.add('selected');

            callBack({id: element.dataset.id, text: element.textContent});
        };

        // Add click event on each item
        Array.from(scrollableContent.getElementsByClassName('listItem')).forEach(item => {
            if (item == undefined) return;
            item.addEventListener('click', () => onClick(item));
        });
    }
}