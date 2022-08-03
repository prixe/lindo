import { Locales } from '@lindo/i18n'

/* eslint-disable no-unused-vars */
export enum IPCEvents {
  INIT_STATE = 'mobx.INIT_STATE',
  INIT_STATE_ASYNC = 'mobx.INIT_STATE_ASYNC',
  PATCH = 'mobx.PATCH',
  OPEN_OPTION = 'OPEN_OPTION',
  UPDATE_PROGRESS = 'UPDATE_PROGRESS',
  GET_GAME_CONTEXT = 'GET_GAME_CONTEXT',
  APP_READY_TO_SHOW = 'APP_READY_TO_SHOW',
  FETCH_GAME_CONTEXT = 'FETCH_GAME_CONTEXT',
  NEW_TAB = 'NEW_TAB',
  SELECT_TAB = 'SELECT_TAB',
  CLOSE_TAB = 'CLOSE_TAB',
  PREV_TAB = 'PREV_TAB',
  NEXT_TAB = 'NEXT_TAB',
  TOGGLE_MAXIMIZE_WINDOW = 'TOGGLE_MAXIMIZE_WINDOW',
  FOCUS_WINDOW = 'FOCUS_WINDOW',
  AUDIO_MUTE_WINDOW = 'AUDIO_MUTE_WINDOW',
  CLOSE_OPTION = 'CLOSE_OPTION',
  RESET_STORE = 'RESET_STORE',
  SAVE_MASTER_PASSWORD = 'SAVE_MASTER_PASSWORD',
  CHANGE_MASTER_PASSWORD = 'CHANGE_MASTER_PASSWORD',
  REMOVE_MASTER_PASSWORD = 'REMOVE_MASTER_PASSWORD',
  ENCRYPT_CHARACTER_PASSWORD = 'ENCRYPT_CHARACTER_PASSWORD',
  DECRYPT_CHARACTER_PASSWORD = 'DECRYPT_CHARACTER_PASSWORD',
  UNLOCK_APPLICATION = 'UNLOCK_APPLICATION',
  SELECT_TEAM_TO_CONNECT = 'SELECT_TEAM_TO_CONNECT',
  IS_MASTER_PASSWORD_CONFIGURED = 'IS_MASTER_PASSWORD_CONFIGURED',
  SAVE_CHARACTER_IMAGE = 'SAVE_CHARACTER_IMAGE',
  CLOSE_UNLOCK_WINDOW = 'CLOSE_UNLOCK_WINDOW',
  AUTO_GROUP_PUSH_PATH = 'AUTO_GROUP_PUSH_PATH',
  RESET_GAME_DATA = 'RESET_GAME_DATA',
  CLEAR_CACHE = 'CLEAR_CACHE',
  // logger
  LOGGER_DEBUG = 'LOGGER_DEBUG',
  LOGGER_INFO = 'LOGGER_INFO',
  LOGGER_WARN = 'LOGGER_WARN',
  LOGGER_ERROR = 'LOGGER_ERROR'
}

export const OFFICIAL_WEBSITE_URL = 'https://lindo-app.com'
export const GITHUB_URL = 'https://github.com/prixe/lindo'
export const MATRIX_URL = 'https://matrix.to/#/#lindo-official:matrix.org'
export const REDDIT_URL = 'https://www.reddit.com/r/LindoApp/'

export interface SaveCharacterImageArgs {
  image: string
  name: string
}

export const RESOLUTIONS: ReadonlyArray<string> = <const>[
  '800x600',
  '960x600',
  '1280x720',
  '1024x768',
  '1366x768',
  '1440x900',
  '1600x900',
  '1280x1024',
  '1920x1080',
  '2560x1440'
]

export interface LanguageOption {
  name: string
  value: Locales
}

export const LANGUAGES: ReadonlyArray<LanguageOption> = <const>[
  { name: 'Français', value: 'fr' },
  { name: 'English', value: 'en' },
  { name: 'Español', value: 'es' }
  // { name: 'Italiano', value: 'it' },
  // { name: 'Português', value: 'pt' },
  // { name: 'Polskie', value: 'pl' },
  // { name: 'Türkçe', value: 'tr' }
]
