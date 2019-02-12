import { combineReducers } from 'redux';
import settingsReducer from './settings/settings.reducer';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    settings: settingsReducer
  };

  if (scope === 'renderer') {
    reducers = {
      ...reducers
    };
  }

  return combineReducers({ ...reducers });
}
