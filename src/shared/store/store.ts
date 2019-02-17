import { SettingsState } from './settings/settings.reducer';
import { GameVersionState } from './game-version/game-version.reducer';

export interface AppState {
  readonly settings: SettingsState;
  readonly gameVersion: GameVersionState;
}
