export class Checkbox {
    private wGame: any|Window;

    public checkbox: HTMLDivElement;

    private constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Return an CheckBox with dofus touch checkbox skin
     * @param id The div id
     * @param options The option of checkBox
     */
    public static createCheckbox(wGame: any|Window, id: string, options: {text: string, isCheck?: boolean, customClass?: string}): Checkbox {
        const instance: Checkbox = new Checkbox(wGame);

        instance.checkbox = instance.wGame.document.createElement('div');
        instance.checkbox.id = id;
        instance.checkbox.className = 'CheckboxLabel';
        if (options.isCheck) instance.checkbox.classList.add('on');
        if (options.customClass) instance.checkbox.classList.add(options.customClass);
        instance.checkbox.insertAdjacentText('afterbegin', options.text);

        return instance;
    }

    /**
     * Add click event and call the callBack method on click
     * (Call this method after insert element in DOM)
     * @param callBack The method to execute on click (Add parameters to know if is check)
     */
    public addEvent(callBack: any): Checkbox {
        let onClick = () => {
            if (!this.checkbox.classList.contains('disabled')) {

                if (this.checkbox.classList.contains('on')) this.checkbox.classList.remove('on');
                else this.checkbox.classList.add('on');

                callBack(this.checkbox.classList.contains('on'));
            }
        };

        this.checkbox.addEventListener('click', onClick);

        return this;
    }

    /**
     * Disabled checkbox, block action on click
     */
    public disabled(): Checkbox {
        if (!this.checkbox.classList.contains('disabled')) this.checkbox.classList.add('disabled');
        return this;
    }

    /**
     * Enabled checkbox
     */
    public enabled(): Checkbox {
        if (this.checkbox.classList.contains('disabled')) this.checkbox.classList.remove('disabled');
        return this;
    }

    /**
     * Check the box
     */
    public check(): Checkbox {
        if (!this.checkbox.classList.contains('on')) this.checkbox.classList.add('on');
        return this;
    }

    /**
     * Uncheck the box
     */
    public uncheck(): Checkbox {
        if (this.checkbox.classList.contains('on')) this.checkbox.classList.remove('on');
        return this;
    }

    /**
     * Get if the checkbox is check
     */
    public getIfIsCheck(): boolean {
        return this.checkbox.classList.contains('on');
    }
}
