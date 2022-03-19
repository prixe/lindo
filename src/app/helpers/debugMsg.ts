export class DebugMsg {
    private static listInstances: DebugMsgInstances = {};

    private name: string;
    protected isActivated: boolean = false;

    public static create(source: any) {
        const instanceName: string = source.constructor.name;
        const instance: DebugMsg = new DebugMsg(instanceName);
        this.listInstances[instanceName] = {instance};

        return instance;
    }

    public static getListInstances(): DebugMsgInstances {
        return {...this.listInstances};
    }

    public static activate(instanceName: string) {
        this.toggle(instanceName, false);
    }

    public static desactivate(instanceName: string) {
        this.toggle(instanceName, false);
    }

    private static toggle(instanceName: string, active: boolean) {
        const instanceObject = this.listInstances?.[instanceName];
        if (instanceObject) {
            instanceObject.isActivated = active;
            instanceObject.instance.isActivated = active;
        }
    }

    private constructor(name: string) {
        this.name = name;
    }

    /**
     * Print message in console if debug is activated for this instance
     * @param {any} message 
     * @param {any[]} optionalParams 
     */
    public debug(message: any, ...optionalParams: any[]) {
        if (this.isActivated) {
            if (typeof message == 'string') console.log(this.getLogHead() + message, ...optionalParams);
            else console.log(this.getLogHead(), message, ...optionalParams);
        }
    }

    private getLogHead() {
        const date: Date = new Date();
        return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}][${this.name}] `;
    }
}

export type DebugMsgInstances = {
    [key: string]: {instance: DebugMsg, isActivated?: boolean}
}