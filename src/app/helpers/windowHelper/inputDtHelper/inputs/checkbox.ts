export class Checkbox {
    private wGame: any|Window;

    constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Return an HTMLDivElement with dofus touch checkbox skin
     * @param id The div id
     * @param options The option of checkBox
     */
    public createCheckbox(id: string, options: {text: string, isCheck?: boolean, customClass?: string}): HTMLDivElement {
        const checkbox: HTMLDivElement = this.wGame.document.createElement('div');
        checkbox.id = id;
        checkbox.className = 'CheckboxLabel';
        if (options.isCheck) checkbox.classList.add('on');
        if (options.customClass) checkbox.classList.add(options.customClass);
        checkbox.insertAdjacentText('afterbegin', options.text);

        return checkbox;
    }

    /**
     * Add click event and call the callBack method on click
     * (Call this method after insert element in DOM)
     * @param checkbox The checkbox you wan't to add event
     * @param callBack The method to execute on click (Add parameters to know if is check)
     */
    public addCheckboxEvent(checkbox: HTMLDivElement, callBack: any) {
        let onClick = () => {
            if (!checkbox.classList.contains('disabled')) {

                if (checkbox.classList.contains('on')) checkbox.classList.remove('on');
                else checkbox.classList.add('on');

                callBack(checkbox.classList.contains('on'));
            }
        };

        checkbox.addEventListener('click', onClick);
    }

    /**
     * Disabled checkbox, block action on click
     * @param checkbox The checkbox you wan't to disable
     */
    public disabledCheckbox(checkbox: HTMLDivElement) {
        if (!checkbox.classList.contains('disabled')) checkbox.classList.add('disabled');
    }

    /**
     * Enabled checkbox
     * @param checkbox The checkbox you wan't to enable
     */
    public enabledCheckbox(checkbox: HTMLDivElement) {
        if (checkbox.classList.contains('disabled')) checkbox.classList.remove('disabled');
    }

    /**
     * Check the box
     * @param checkbox The checkbox you wan't to check
     */
    public checkCheckBox(checkbox: HTMLDivElement) {
        if (!checkbox.classList.contains('on')) checkbox.classList.add('on');
    }

    /**
     * Uncheck the box
     * @param checkbox The checkbox you wan't to uncheck
     */
    public uncheckCheckBox(checkbox: HTMLDivElement) {
        if (checkbox.classList.contains('on')) checkbox.classList.remove('on');
    }

    /**
     * Get if the checkbox is check
     * @param checkbox The checkbox
     */
    public getIfIsCheck(checkbox: HTMLDivElement): boolean {
        return checkbox.classList.contains('on');
    }
}
