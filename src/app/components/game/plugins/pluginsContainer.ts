import {Plugins} from "./plugins";

export class PluginsContainer{

    private wGame: Window | any;
    private plugins : Plugins;

    constructor(wGame: Window | any){
        this.wGame = wGame;

        this.wGame.plugins = new Plugins(this.wGame);
    }
}