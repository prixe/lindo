import { app } from 'electron'

export const APP_PATH = app.getAppPath()
export const GAME_PATH = app.getPath('userData') + '/game/'
export const CHARACTER_IMAGES_PATH = app.getPath('userData') + '/character-images/'
export const DOFUS_ORIGIN = 'https://proxyconnection.touch.dofus.com/'
export const DOFUS_EARLY_ORIGIN = 'https://earlyproxy.touch.dofus.com/'
export const DOFUS_ITUNES_ORIGIN = 'https://itunes.apple.com/lookup?id=1041406978&t=' + new Date().getTime()
export const LOCAL_ASSET_MAP_PATH = GAME_PATH + 'assetMap.json'
export const REMOTE_ASSET_MAP_URL = DOFUS_ORIGIN + 'assetMap.json'
export const LOCAL_LINDO_MANIFEST_PATH = GAME_PATH + 'lindoManifest.json'
export const REMOTE_LINDO_MANIFEST_URL = 'https://raw.githubusercontent.com/zenoxs/lindo-game-base/master/manifest.json'
export const LOCAL_DOFUS_MANIFEST_PATH = GAME_PATH + 'manifest.json'
export const REMOTE_DOFUS_MANIFEST_URL = DOFUS_ORIGIN + 'manifest.json'
export const LOCAL_VERSIONS_PATH = GAME_PATH + 'versions.json'
export const LOCAL_REGEX_PATH = GAME_PATH + 'regex.json'
