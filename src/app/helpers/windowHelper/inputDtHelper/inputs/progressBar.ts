export class ProgressBarHelper {
    private wGame: any|Window;

    constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Return an HTMLDivElement of with dofus touch progressBar skin
     * @param id The div id
     * @param options The options of progressBar
     */
    public createProgressBar(id: string, options: {color: ProgressColor, percent?: number}): HTMLDivElement {
        const progressBar: HTMLDivElement = this.wGame.document.createElement('div');
        progressBar.id = id;
        progressBar.className = `ProgressBar ${options.color}`;
        progressBar.dataset.color = options.color;
        if (!options.percent) options.percent = 0;

        const barFill: any = this.wGame.document.createElement('div');
        barFill.className = 'barFill';
        barFill.style.webkitMaskSize = `${options.percent}% 100%`;

        barFill.insertAdjacentHTML('afterbegin', '<div class="barColor"></div>');
        progressBar.insertAdjacentHTML('afterbegin', '<div class="barBg"></div>');
        progressBar.insertAdjacentElement('beforeend', barFill);

        return progressBar;
    }

    /**
     * Change the color of progressBar
     * @param progressBar The progressBar element
     * @param color The new color
     */
    public changeProgressColor(progressBar: HTMLDivElement, color: ProgressColor) {
        progressBar.classList.replace(progressBar.dataset.color, color);
    }

    /**
     * Change the percentage value of progressBar
     * @param progressBar The progressBar element
     * @param percent The new percent value
     */
    public changeProgressPercent(progressBar: HTMLDivElement, percent: number) {
        const barFill: any = progressBar.getElementsByClassName('barFill')[0];
        barFill.style.webkitMaskSize = `${percent}% 100%`;
    }
}

export enum ProgressColor {
    RED = 'red',
    GREEN = 'green',
    YELLOW = 'yellow',
    ORANGE = 'orange',
    BLUE = 'blue',
}