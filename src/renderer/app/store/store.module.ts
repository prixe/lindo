import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { NgModule } from '@angular/core';
import { forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer, triggerAlias } from 'electron-redux';
import { applyMiddleware, compose, createStore, StoreEnhancerStoreCreator } from 'redux';
import { getRootReducer } from '../../../shared/store/reducers';
import { AppState } from '../../../shared/store/store';
import configureStore from '../../../shared/store/configureStore';

@NgModule({
  imports: [NgReduxModule]
})
export class StoreModule {
  constructor(
    public store: NgRedux<AppState>
  ) {
    /*const middleware = [
      forwardToMain
    ];

    const enhanced = [
      applyMiddleware(...middleware)
    ];

    const rootReducer = getRootReducer('renderer');

    const enhancer = compose<StoreEnhancerStoreCreator<AppState>>(...enhanced);
    const reduxStore = createStore(rootReducer, {}, enhancer);
    replayActionRenderer(reduxStore);*/

    store.provideStore(configureStore({}, 'renderer'));
  }
}
