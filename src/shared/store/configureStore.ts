import { applyMiddleware, compose, createStore, Store, StoreEnhancerStoreCreator } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer, triggerAlias, } from 'electron-redux';
import { AppState } from './store';
import getRootReducer from './reducers';

export default function configureStore(initialState: Partial<AppState>, scope: 'main' | 'renderer' = 'main'): Store {
  let middleware = [
    thunk,
    promise,
  ];

  if (scope === 'renderer') {
    middleware = [
      forwardToMain,
      ...middleware,
    ];
  }

  if (scope === 'main') {
    middleware = [
      triggerAlias,
      ...middleware,
      forwardToRenderer,
    ];
  }

  const enhanced = [
    applyMiddleware(...middleware),
  ];

  const rootReducer = getRootReducer(scope);
  const enhancer = compose<StoreEnhancerStoreCreator<AppState>>(...enhanced);
  const store = createStore(rootReducer, initialState, enhancer);

  if (scope === 'main') {
    replayActionMain(store);
  } else {
    replayActionRenderer(store);
  }

  return store;
}
