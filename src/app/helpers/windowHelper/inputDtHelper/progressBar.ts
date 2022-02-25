export class ProgressBar {
    private wGame: any|Window;

    public progressBar: HTMLDivElement;

    private constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Return an HTMLDivElement of with dofus touch progressBar skin
     * @param id The div id
     * @param options The options of progressBar
     */
    public static createProgressBar(wGame: any|Window, id: string, options: {color: ProgressColor, percent?: number}): ProgressBar {
        const instance: ProgressBar = new ProgressBar(wGame);

        instance.progressBar = instance.wGame.document.createElement('div');
        instance.progressBar.id = id;
        instance.progressBar.className = `ProgressBar ${options.color}`;
        instance.progressBar.dataset.color = options.color;
        if (!options.percent) options.percent = 0;

        const barFill: any = instance.wGame.document.createElement('div');
        barFill.className = 'barFill';
        barFill.style.webkitMaskSize = `${options.percent}% 100%`;

        barFill.insertAdjacentHTML('afterbegin', '<div class="barColor"></div>');
        instance.progressBar.insertAdjacentHTML('afterbegin', '<div class="barBg"></div>');
        instance.progressBar.insertAdjacentElement('beforeend', barFill);

        return instance;
    }

    /**
     * Change the color of progressBar
     * @param color The new color
     */
    public changeProgressColor(color: ProgressColor): ProgressBar {
        this.progressBar.classList.replace(this.progressBar.dataset.color, color);
        return this;
    }

    /**
     * Change the percentage value of progressBar
     * @param percent The new percent value
     */
    public changeProgressPercent(percent: number): ProgressBar {
        const barFill: any = this.progressBar.getElementsByClassName('barFill')[0];
        barFill.style.webkitMaskSize = `${percent}% 100%`;
        return this;
    }

    public getHtmlElement(): HTMLDivElement {
        return this.progressBar;
    }
}

export enum ProgressColor {
    RED = 'red',
    GREEN = 'green',
    YELLOW = 'yellow',
    ORANGE = 'orange',
    BLUE = 'blue',
}