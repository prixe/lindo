export class ShortcutsHelper {

    private shortcuts: string[] = [];
    private shortcutsVanilla: ((e: KeyboardEvent) => void)[] = [];
    private window: Window;

    constructor(window: Window){
        this.window = window;
    }

    public bind(shortcut: string, action: (e?: KeyboardEvent) => void): void {
        (<any>this.window).key(shortcut, (e: KeyboardEvent) => {
            action(e);
        });

        this.shortcuts.push(shortcut);
    }

    public bindVanilla(shortcut: string, action: (e?: KeyboardEvent) => void): void {
        const listener = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() == shortcut) action(e);
        };
        (<any>this.window).addEventListener('keydown', listener);

        this.shortcutsVanilla.push(listener);
    }

    public unBindAll(): void{
        this.shortcuts.forEach((shortcut) => {
            this.unBind(shortcut);
        });
        this.shortcutsVanilla.forEach((listener) => {
            this.unBindVanilla(listener);
        });
    }

    public unBind(shortcut: string): void {
        (<any>this.window).key.unbind(shortcut);
    }

    public unBindVanilla(listener: (e: KeyboardEvent) => void): void {
        (<any>this.window).removeEventListener('keydown', listener);
    }
}
