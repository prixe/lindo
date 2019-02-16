import {Updater} from './updater/updater';
import {MainWindow} from './main-window';
import {AppStore} from './app-store';

export class Application {

  private readonly updater: Updater;

  constructor() {
    this.updater = new Updater();
  }

  async run(): Promise<void> {
    await AppStore.configure();

    AppStore.subscribe(async () => {
      console.log(AppStore.getState());
    });
    // this.store.dispatch(setRemindersEnabled(true));
    await this.updater.checkForUpdatesAndUpdate();
    this.createWindow();
  }

  private createWindow() {
    // Create the browser window.
    const win = new MainWindow();
    win.run();
  }
}
