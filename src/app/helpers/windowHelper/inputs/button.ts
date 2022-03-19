export class Button {
    private wGame: any|Window;

    public button: HTMLDivElement;

    private constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Return a Text Button with dofus touch button skin
     * @param id The div id
     * @param options The options of button
     * @returns Button
     */
    public static createTextButton(wGame: any|Window, id: string, options: {text: string, color: ButtonColor, customClassName?: string}): Button {
        const instance: Button = new Button(wGame);

        instance.button = instance.wGame.document.createElement('div');
        instance.button.id = id;
        instance.button.className = 'Button scaleOnPress ' + options.color;
        if (options.customClassName) instance.button.classList.add(options.customClassName);
        instance.button.insertAdjacentText('afterbegin', options.text);

        return instance;
    }

    /**
     * Return a Icon Button with dofus touch button icon skin
     * @param id The div id
     * @param options The options of button
     * @returns Button
     */
     public static createIconButton(wGame: any|Window, id: string, options: {icon: string, customClassName?: string}): Button {
        const instance: Button = new Button(wGame);

        instance.button = instance.wGame.document.createElement('div');
        instance.button.id = id;
        instance.button.className = `Button scaleOnPress ${options.icon}`;
        if (options.customClassName) instance.button.classList.add(options.customClassName);

        const btnIcon: HTMLDivElement = instance.wGame.document.createElement('div');
        btnIcon.className = 'btnIcon';

        instance.button.insertAdjacentElement('afterbegin', btnIcon);

        return instance;
    }

    /**
     * Add click event and call the callBack method on click.
     * (Call this method after insert element in DOM)
     * @param callBack The method to execute on click
     */
    public addEvent(callBack: any): Button {
        let onPress = () => {
            if (!this.button.classList.contains('disabled')) this.button.classList.add('pressed');
        };
        let onRelease = () => {
            if (this.button.classList.contains('pressed')) this.button.classList.remove('pressed'); 
        };
        let onClick = () => {
            if (!this.button.classList.contains('disabled')) callBack();
        };

        this.button.addEventListener('touchstart', onPress);
        this.button.addEventListener('touchend', onRelease);
        this.button.addEventListener('click', onClick);

        return this;
    }

    /**
     * Return the html element
     * @returns HTMLDivElement
     */
    public getHtmlElement(): HTMLDivElement {
        return this.button;
    }

    /**
     * Disabled button, block action on click
     */
    public disabled(): Button {
        if (!this.button.classList.contains('disabled')) this.button.classList.add('disabled');
        return this;
    }

    /**
     * Enabled button
     */
    public enabled(): Button {
        if (this.button.classList.contains('disabled')) this.button.classList.remove('disabled');
        return this;
    }

    /**
     * Change the color of button
     * @param buttonColor The color to applies
     */
    public changeButtonColor(buttonColor: ButtonColor): Button {
        for (let color in ButtonColor) {
            if (this.button.classList.contains(ButtonColor[color])) this.button.classList.replace(ButtonColor[color], buttonColor);
        }
        return this;
    }
}

export enum ButtonColor {
    'PRIMARY' = 'button',
    'SECONDARY' = 'secondaryButton',
    'SPECIAL' = 'specialButton'
}