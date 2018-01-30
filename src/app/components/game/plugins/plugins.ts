
import {AppPreferences} from "./appPreferences/appPreferences";
export class Plugins {
    private wGame: Window | any;
    public appPreferences: AppPreferences;

    constructor(wGame: Window | any){
        this.wGame = wGame;

        this.appPreferences = new AppPreferences();
    }
}