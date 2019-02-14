import {OptionDefinitions} from './option-definitions';
import configureStore from '../shared/store/configureStore';
import {AppState} from '../shared/store/store';
import {Store} from 'redux';
import {Updater} from './updater/updater';
import {MainWindow} from './main-window';

export class Application {

  private readonly store: Store<AppState>;
  private readonly updater: Updater;

  constructor(private options: OptionDefinitions) {
    this.store = configureStore({}, 'main');
    this.updater = new Updater();

    this.store.subscribe(async () => {
      console.log(this.store.getState());
      // persist store changes
      // await storage.set('state', global.state);
    });
    // this.store.dispatch(setRemindersEnabled(true));
  }

  async run(): Promise<void> {
    await this.updater.checkForUpdatesAndUpdate();
    this.createWindow();
  }

  private createWindow() {
    // Create the browser window.
    const win = new MainWindow(this.options, this.store);
    win.run();
  }
}
