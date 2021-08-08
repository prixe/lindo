import {SettingsService} from "@services/settings.service";
import {TranslateService} from "@ngx-translate/core";

export abstract class Mod {
    private events: any[] = [];
    private onReset: any[] = [];

    public wGame: any|Window;
    protected settings: SettingsService;
    protected translate: TranslateService;

    protected params: any;

    constructor(
        wGame: any|Window,
        settings: SettingsService,
        translate: TranslateService
    ) {
        this.wGame = wGame;
        this.settings = settings;
        this.translate = translate;

        this.startMod();
    }

    abstract startMod(): void;

    protected addOnResetListener(fct: any): void {
        this.onReset.push(fct);
    }

    protected getRandomTime(min: number, max: number): number {
        return (Math.random() * (max * 1000 - min * 1000) + min * 1000);
    }

    protected on(manager: any, eventHandler: string, fct: any): void {
        manager.on(eventHandler, fct);
        this.events.push({
            manager: manager,
            eventHandler: eventHandler,
            fct: fct
        });
    }

    protected once(manager: any, eventHandler: string, fct: any): void {
        manager.once(eventHandler, fct);
        this.events.push({
            manager: manager,
            eventHandler: eventHandler,
            fct: fct
        });
    }

    protected removeListener(manager: any, eventHandler: string, fct: any): void {
        manager.removeListener(eventHandler, fct);
    }

    public reset():void {
        this.onReset.forEach((fct) => {
            fct();
        });
        this.onReset = [];
        this.events.forEach((event) => {
            this.removeListener(event.manager, event.eventHandler, event.fct);
        });
        this.events = [];
    }
}
