import { Button } from "./inputs/button";
import { Checkbox } from "./inputs/checkbox";
import { Input } from "./inputs/input";
import { ProgressBarHelper } from "./inputs/progressBar";
import { Select } from "./inputs/select";

export class InputDtHelper {
    private wGame: any|Window;

    private button: Button;
    private checkBox: Checkbox;
    private input: Input;
    private select: Select;
    private progressBar: ProgressBarHelper;

    constructor(wGame: any|Window) {
        this.wGame = wGame;

        this.button = new Button(this.wGame);
        this.checkBox = new Checkbox(this.wGame);
        this.input = new Input(this.wGame, this);
        this.select = new Select(this.wGame);
        this.progressBar = new ProgressBarHelper(this.wGame);
    }

    /**
     * Get an helper to create button with dofus touch style
     * @returns Button
     */
    public get Button(): Button {
        return this.button;
    }

    /**
     * Get an helper to create checkbox with dofus touch style
     * @returns Checkbox
     */
    public get Checkbox(): Checkbox {
        return this.checkBox;
    }

    /**
     * Get an helper to create input with dofus touch style
     * @returns Input
     */
    public get Input(): Input {
        return this.input;
    }

    /**
     * Get an helper to create select with dofus touch style
     * @returns Select
     */
    public get Select(): Select {
        return this.select;
    }

    /**
     * Get an helper to create progress bar with dofus touch style
     * @returns ProgressBarHelper
     */
    public get ProgressBar(): ProgressBarHelper {
        return this.progressBar;
    }
}