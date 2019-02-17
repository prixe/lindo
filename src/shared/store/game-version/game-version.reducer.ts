import * as gameVersion from './game-version.action';
import { ActionType } from 'typesafe-actions';

export interface GameVersionState {
  build: {
    version: string;
    hash: string;
  };
  appVersion: string;
}

export type GameVersionActions = ActionType<typeof gameVersion>;

const initialGameVersionState: GameVersionState = {
  build: {
    version: undefined,
    hash: undefined
  },
  appVersion: undefined
};

export default function gameVersionReducer(state = initialGameVersionState, action: GameVersionActions): GameVersionState {
  switch (action.type) {
    case gameVersion.SET_BUILD_HASH: {
      return {
        ...state,
        build: {
          ...state.build,
          hash: action.payload
        },
      };
    }
    case gameVersion.SET_BUILD_VERSION: {
      return {
        ...state,
        build: {
          ...state.build,
          version: action.payload
        },
      };
    }
    case gameVersion.SET_APP_VERSION: {
      return {
        ...state,
        appVersion: action.payload
      };
    }
  }
}
