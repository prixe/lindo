import {Injectable, NgZone} from '@angular/core';

const { ipcRenderer } = electron;

@Injectable()
export class IpcRendererService {
	private _ipcRenderer = ipcRenderer;
  private listeners = [];

	constructor(
        private zone: NgZone
    ) {}

	public on(channel:string, callback: any) {
    const ipcListener = (event: Event, args:any)=>{
      // prevent that change is effectiv for zone.js because ipc run not under controll of zone.js
      this.zone.run(() => {
          callback(event, args);
      });
    }
    this.listeners.push({
      fct: callback,
      ipcListener: ipcListener
    });
		return this._ipcRenderer.on(channel, ipcListener);
	}

	public removeListener(channel: string, listener:any){
    let ipcListener = null;
    this.listeners.forEach((l) => {
      if (l.fct == listener) ipcListener = l.ipcListener;
    });
		return this._ipcRenderer.removeListener(channel, ipcListener);
	}

	public removeAllListeners(channel?:string) {
		return this._ipcRenderer.removeAllListeners(channel);
	}

	public send(channel:string, ...args: Array<any>) {
		this._ipcRenderer.send(channel, args);
	}

	public sendSync(channel:string, ...args: Array<any>) {
		return this._ipcRenderer.sendSync(channel, args);
	}
}
