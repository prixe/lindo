import { ComponentDtHelper } from "./componentDtHelper/componentDtHelper.helper";
import { DraggableWindowHelper } from "./draggableWindow.helper";
import { InputDtHelper } from "./inputDtHelper/inputDt.helper";
import { WindowContentHelper } from "./windowContent.helper";

export class CustomWindowHelper {
    private wGame: any | Window;

    private windowContent: WindowContentHelper;
    private inputHelper: InputDtHelper;
    private componentHelper: ComponentDtHelper;

    constructor(wGame) {
        this.wGame = wGame;
        this.windowContent = new WindowContentHelper(this.wGame);
        this.inputHelper = new InputDtHelper(this.wGame);
        this.componentHelper = new ComponentDtHelper(this.wGame);
    }

    // Windows Helper

    /**
     * Get an instance of this to create one window in game
     * @returns DraggableWindowHelper
     */
    public getWindow(): DraggableWindowHelper {
        // Need to create a unique instance each time
        return new DraggableWindowHelper(this.wGame);
    }

    /**
     * Get an helper for create content container to insert in your custom window
     * @returns WindowContentHelper
     */
    public get WindowContent(): WindowContentHelper {
        return this.windowContent;
    }

    /**
     * Get an helper for create DT component
     * @returns ComponentDtHelper
     */
    public get getComponentHelper(): ComponentDtHelper {
        return this.componentHelper;
    }

    // Input Helper

    /**
     * Get an helper for get instance of inputs helper
     * @returns InputDtHelper
     */
    public get getInputsHelper(): InputDtHelper {
        return this.inputHelper;
    }
}