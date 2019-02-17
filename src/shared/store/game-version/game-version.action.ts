import { action } from 'typesafe-actions';

export const SET_BUILD_HASH = 'SET_BUILD_HASH';
export const SET_BUILD_VERSION = 'SET_BUILD_VERSION';
export const SET_APP_VERSION = 'SET_APP_VERSION';

export const setBuildHash = (hash: string) => action(SET_BUILD_HASH, hash);
export const setBuildVersion = (version: string) => action(SET_BUILD_VERSION, version);
export const setAppVersion = (version: string) => action(SET_APP_VERSION, version);

