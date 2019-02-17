import { combineReducers } from 'redux';
import settingsReducer from './settings/settings.reducer';
import gameVersionReducer from './game-version/game-version.reducer';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    settings: settingsReducer,
    gameVersion: gameVersionReducer
  };

  if (scope === 'renderer') {
    reducers = {
      ...reducers
    };
  }

  return combineReducers({ ...reducers });
}
