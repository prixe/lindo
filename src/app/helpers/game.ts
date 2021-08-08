import {EventEmitter} from 'eventemitter3';

export class Game extends EventEmitter {

    public id: number;
    public isFocus = false;
    public window: any | Window = null;
    public credentials: { account_name: string, password: string };

    public constructor(id: number, credentials?: { account_name: string, password: string }) {

        super();
        this.id = id;

        if (credentials) {
            this.credentials = credentials;
        }
    }
}