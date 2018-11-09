export interface IMods {
    reset(): void;
    wGame: any|Window;
}

export abstract class Mods implements IMods {

    private events: any[] = [];
    private onReset: any[] = [];
    wGame: any|Window;

    constructor(wGame: any|Window) {
        this.wGame = wGame;
        this.events = [];
        this.onReset = [];
    }

    protected addOnResetListener(fct: any) {
        this.onReset.push(fct);
    }

    protected getRandomTime(min: number, max: number): number {
        return (Math.random() * (max * 1000 - min * 1000) + min * 1000);
    }

    protected on(manager: any, eventHandler: string, fct: any) {
        manager.on(eventHandler, fct);
        this.events.push({
            manager: manager,
            eventHandler: eventHandler,
            fct: fct
        });
    }

    protected once(manager: any, eventHandler: string, fct: any) {
        manager.once(eventHandler, fct);
        this.events.push({
            manager: manager,
            eventHandler: eventHandler,
            fct: fct
        });
    }

    protected removeListener(manager: any, eventHandler: string, fct: any) {
        manager.removeListener(eventHandler, fct);
    }

    public reset() {
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
