import { AppState } from '../shared/store/store';
import { AnyAction, applyMiddleware, compose, createStore, Store, StoreEnhancerStoreCreator, Unsubscribe } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { Persistor, persistReducer, persistStore } from 'redux-persist';
import { forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer, triggerAlias, } from 'electron-redux';
// @ts-ignore
import * as createElectronStorage from 'redux-persist-electron-storage';
import { getRootReducer } from '../shared/store/reducers';

export class AppStore {
  private static store: Store<AppState>;
  private static persistor: Persistor;

  static async configure(): Promise<void> {
    if (this.store !== undefined) {
      throw new Error('AppStore has already been configure');
    }
    const middleware = [
      triggerAlias,
      promise,
      thunk,
      forwardToRenderer,
    ];
    const enhanced = [
      applyMiddleware(...middleware),
    ];

    const rootReducer = getRootReducer('main');

    const persistConfig = {
      key: 'root',
      storage: createElectronStorage()
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const enhancer = compose<StoreEnhancerStoreCreator<AppState>>(...enhanced);

    this.store = createStore(persistedReducer, {}, enhancer);
    this.persistor = persistStore(this.store);

    replayActionMain(this.store);
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
