export class Tab {

    public id: number = null;
    public character: string = null;
    public icon:HTMLDivElement = null;
    public isLogged: boolean = false;
    public isFocus: boolean = false;
    public notification: boolean = false;

    public constructor(id: number) {
        this.id = id;
    }
}