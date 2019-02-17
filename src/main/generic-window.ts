import {BrowserWindow, BrowserWindowConstructorOptions} from 'electron';
import * as url from 'url';
import * as path from 'path';
import {options} from './options';
import * as buildUrl from 'build-url';

export abstract class GenericWindow {

  protected window: BrowserWindow;

  protected constructor(windowOpts?: BrowserWindowConstructorOptions) {
    this.window = new BrowserWindow(windowOpts);
  }

  protected loadUrl(target, query?: { [key: string]: any }): void {
    if (options.serve) {
      console.log('serve');
      require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/../../node_modules/electron`)
      });
      const uri = buildUrl('http://localhost:4200', {
        path: target,
        queryParams: query
      });
      this.window.loadURL(uri);
      this.window.webContents.openDevTools();
    } else {
      this.window.loadURL(url.format({
        pathname: path.join(__dirname, `../renderer/index.html#/${target}`),
        protocol: 'file:',
        slashes: true,
        query
      }));
    }
  }
}
