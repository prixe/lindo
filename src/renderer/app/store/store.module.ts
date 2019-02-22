import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { NgModule } from '@angular/core';
// import { forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer, triggerAlias } from 'electron-redux';
import { applyMiddleware, compose, createStore, StoreEnhancerStoreCreator } from 'redux';
import { getRootReducer } from '../../../shared/store/reducers';
import { AppState } from '../../../shared/store/store';
import { ElectronService } from '../shared/providers/electron.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    NgReduxModule,
    SharedModule
  ]
})
export class StoreModule {
  constructor(
    public store: NgRedux<AppState>,
    public electron: ElectronService
  ) {
    const middleware = [];

    if (electron.isElectron()) {
      middleware.push(window.require('electron-redux').forwardToMain);
    }

    const enhanced = [
      applyMiddleware(...middleware)
    ];

    const rootReducer = getRootReducer('renderer');

    const enhancer = compose<StoreEnhancerStoreCreator<AppState>>(...enhanced);
    const reduxStore = createStore(rootReducer, {}, enhancer);

    if (electron.isElectron()) {
      window.require('electron-redux')
        .replayActionRenderer(reduxStore);
    }
    // replayActionRenderer(reduxStore);

    store.provideStore(reduxStore);
  }
}
