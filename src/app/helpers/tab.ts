export class Tab {

    public id: number = null;
    public character: string = null;
    public icon: HTMLDivElement = null;
    
    public isLogged = false;
    public isFocus = false;
    public notification = false;

    public constructor(id: number) {
        this.id = id;
    }
}