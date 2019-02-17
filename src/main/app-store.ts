import configureStore from '../shared/store/configureStore';
import { AppState } from '../shared/store/store';
import { AnyAction, Store, Unsubscribe } from 'redux';

export class AppStore {
  private static store: Store<AppState>;

  static async configure(): Promise<void> {
    if (this.store !== undefined) {
      throw new Error('AppStore has already been configure');
    }
    this.store = configureStore({}, 'main');
    this.store.subscribe(() => {
      // await storage.set('state', this.store.getState());
    });
  }

  static getState(): AppState {
    return this.store.getState();
  }

  static dispatch(action: AnyAction): any {
    return this.store.dispatch(action);
  }

  static select<T>(selector: (state: AppState) => T): T {
    return selector(this.store.getState());
  }

  static subscribe(listener: () => void): Unsubscribe {
    return this.store.subscribe(listener);
  }
}
