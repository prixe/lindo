import { SettingsState } from './settings/settings.reducer';

export interface AppState {
  readonly settings: SettingsState;
}
