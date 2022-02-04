export class Select {
    private wGame: any|Window;
    private dropDown;
    private elements: Array<{htmlElmnt: HTMLDivElement, callBack: any}> = [];

    constructor(wGame: any|Window) {
        this.wGame = wGame;
        this.dropDown = this.wGame.document.getElementsByClassName('dropDown')[0];
    }

    /**
     * Return an HTMLDivElement with dofus touch select skin
     * @param id The div id
     * @param choices Array of choices in select list
     * @param customClassName A custom className for add your css
     */
    public createSelect(id: string, choices: Array<{id: string, text: string, textInSelect?: string, ticked?: boolean}>, customClassName?: string
        ): HTMLDivElement {
            // Create container of select
            const selectBox: HTMLDivElement = this.wGame.document.createElement('div');
            selectBox.id = id;
            selectBox.className = 'Selector';
            if (customClassName) selectBox.classList.add(customClassName);

            // Child of container for display select element
            const selectorContent: HTMLDivElement = this.wGame.document.createElement('div');
            selectorContent.className = 'selectorContent Button';
            selectorContent.textContent = choices[0].textInSelect ? choices[0].textInSelect : choices[0].text;

            // Button for activate drop down
            const openBtn: HTMLDivElement = this.wGame.document.createElement('div');
            openBtn.className = 'buttonOpen';

            selectBox.insertAdjacentElement('afterbegin', openBtn);
            selectBox.insertAdjacentElement('afterbegin', selectorContent);

            // Create EntryList for choices
            this.createSelectEntryList(id, choices);

            return selectBox;
    }

    /**
     * Private method for create list of choice in select
     * @param id The select div id
     * @param choices Array of choices in select list
     */
    private createSelectEntryList(id: string, choices?: Array<{id: string, text: string, textInSelect?: string, ticked?: boolean}>) {
        // Container for all element
        const entryContainer: HTMLDivElement = this.wGame.document.createElement('div');
        entryContainer.className = 'entryContainer';
        entryContainer.id = id + '-entryContainer';
        entryContainer.style.display = 'none';

        const entryList: HTMLDivElement = this.wGame.document.createElement('div');
        entryList.className = 'entryList Scroller';

        const scrollerContent: HTMLDivElement = this.wGame.document.createElement('div');
        scrollerContent.className = 'scrollerContent customScrollerContent';

        // Create element
        choices.forEach((choice) => {
            const elmnt: HTMLDivElement = this.wGame.document.createElement('div');
            elmnt.className = 'dropDownEntry Button scaleOnPress';
            if (choice.ticked) elmnt.classList.add('ticked');
            elmnt.textContent = choice.text;
            elmnt.dataset.id = choice.id;
            elmnt.dataset.textInSelect = choice.textInSelect;

            scrollerContent.insertAdjacentElement('beforeend', elmnt);
        });

        entryList.insertAdjacentElement('afterbegin', scrollerContent);
        entryContainer.insertAdjacentElement('afterbegin', entryList);
        this.dropDown.insertAdjacentElement('beforeend', entryContainer);
    }

    /**
     * Add event in select input, return selected option
     * @param select The select you wan't to add event
     * @param callBack The method to execute on select choice
     */
    public addSelectEvent(select: HTMLDivElement, callBack: any) {
        const selectorContent = select.getElementsByClassName('selectorContent')[0];
        const entryContainer = this.wGame.document.getElementById(select.id + '-entryContainer');
        const dtEntryContainer = this.dropDown.getElementsByClassName('entryContainer')[0];

        // Event for style of select
        let onPress = () => {
            selectorContent.classList.add('pressed');
            setTimeout(() => {selectorContent.classList.remove('pressed')}, 1000);
        };
        let onRelease = () => selectorContent.classList.remove('pressed');

        // Event for display choice of select
        let onClick = () => {
            const scrollerContent = entryContainer.getElementsByClassName('customScrollerContent')[0];
            const selectBounding = select.getBoundingClientRect();
            const clientHeight = this.wGame.document.body.clientHeight;

            // Set manually visibility of DtDropDown & remove visibility of DtEntryContainer
            this.dropDown.style.display = '';
            this.dropDown.style.opacity = '1';
            dtEntryContainer.style.display = 'none';

            // Display custom select
            entryContainer.style.display = '';
            entryContainer.style.left = selectBounding.left + 'px';
            entryContainer.style.width = selectBounding.width - 34 + 'px';
            // Reset position
            entryContainer.style.bottom = '';
            entryContainer.style.top = '';

            let scrollerMaxHeight = clientHeight - selectBounding.bottom - 17;
            let entryContainerHeight = entryContainer.getBoundingClientRect().height;

            if (entryContainerHeight < scrollerMaxHeight || scrollerMaxHeight > clientHeight*0.4) {
                // Display entry container on bottom of select
                entryContainer.style.top = selectBounding.bottom + 1 + 'px';
            } else {
                // Display entry container on top of select
                entryContainer.style.bottom = clientHeight - selectBounding.top + 1 + 'px';
                scrollerMaxHeight = clientHeight - (clientHeight - selectBounding.top + 17);
            }
            // Define max height of scroller
            scrollerContent.style.maxHeight = scrollerMaxHeight + 'px';
        };

        // Add event on select
        selectorContent.addEventListener('touchstart', onPress);
        selectorContent.addEventListener('touchend', onRelease);
        selectorContent.addEventListener('click', onClick);

        this.addSelectEntryListEvent(entryContainer, selectorContent, callBack);
    }

    /**
     * Private method for add event on each choice of target select input
     * @param entryContainer The entry container of select input
     * @param selectorContent The div of selected content display
     * @param callBack The method to execute when click on choice
     */
    private addSelectEntryListEvent(entryContainer, selectorContent, callBack) {
        const dtEntryContainer = this.dropDown.getElementsByClassName('entryContainer')[0];
        const dropDownOverlay = this.dropDown.getElementsByClassName('dropDrownOverlay')[0];

        // Hide dropdown when click outside of it
        let hideDropDown = () => {
            this.dropDown.style.display = 'none';
            this.dropDown.style.opacity = '';
            dtEntryContainer.style.display = '';

            entryContainer.style.display = 'none';
        };

        // Event for style of choice
        let onPressChoice = (element) => {
            element.classList.add('pressed');
            setTimeout(() => {element.classList.remove('pressed')}, 1000);
        };
        let onReleaseChoice = (element) => element.classList.remove('pressed');
        // Event for action on choice
        let onClickChoice = (element) => {
            selectorContent.textContent = element.dataset.textInSelect != 'undefined' ? element.dataset.textInSelect : element.textContent;

            const tickedEntry = entryContainer.getElementsByClassName('ticked')[0];
            if (tickedEntry.classList.contains('ticked')) tickedEntry.classList.remove('ticked');
            element.classList.add('ticked');

            hideDropDown();
            callBack({id: element.dataset.id, text: element.textContent});
        }

        // Add Event on all choice in select
        for(const choice of entryContainer.getElementsByClassName('dropDownEntry')) {
            if (choice == undefined) return;
            choice.addEventListener('touchstart', () => {onPressChoice(choice)} );
            choice.addEventListener('touchend', () => {onReleaseChoice(choice)} );
            choice.addEventListener('click', () => {onClickChoice(choice)} );
        };

        dropDownOverlay.addEventListener('click', hideDropDown);
    }

    /**
     * Use this for remove all the select element (DropDown and input)
     * @param element The select element
     */
    public removeSelect(element) {
        const entryContainer = this.wGame.document.getElementById(element.id + '-entryContainer');
        try {
            entryContainer.remove();
            element.remove();
        } catch (ex) {
            console.error(ex);
        }
    }
}