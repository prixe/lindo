import * as settings from './settings.action';
import { ActionType } from 'typesafe-actions';

export interface SettingsState {
  readonly remindersEnabled: boolean;
  readonly remindersFromTime: string;
  readonly remindersToTime: string;
  readonly remindersWeekdays: { readonly [key: number]: boolean };
  readonly pomodoroEnabled: boolean;
  readonly githubEnabled: boolean;
}

export type SettingsAction = ActionType<typeof settings>;

const initialSettingsState: SettingsState = {
  remindersEnabled: true,
  remindersFromTime: '09:00',
  remindersToTime: '17:00',
  remindersWeekdays: {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false,
    7: false,
  },
  pomodoroEnabled: false,
  githubEnabled: true,
};

export default function settingsReducer(state = initialSettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case settings.SET_REMINDERS_ENABLED: {
      return {
        ...state,
        remindersEnabled: !!action.payload,
      };
    }

    case settings.SET_REMINDERS_FROM_TIME: {
      return {
        ...state,
        remindersFromTime: action.payload,
      };
    }

    case settings.SET_REMINDERS_TO_TIME: {
      return {
        ...state,
        remindersToTime: action.payload,
      };
    }

    case settings.SET_REMINDERS_WEEKDAYS: {
      return {
        ...state,
        remindersWeekdays: action.payload,
      };
    }

    case settings.SET_POMODORO_ENABLED: {
      return {
        ...state,
        pomodoroEnabled: !!action.payload,
      };
    }

    case settings.SET_GITHUB_ENABLED: {
      return {
        ...state,
        githubEnabled: !!action.payload,
      };
    }

    default:
      return state;
  }
}
