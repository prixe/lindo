import { LindoTitleBar, LindoAPI } from '@lindo/shared'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    lindoAPI: LindoAPI
    buildVersion: string
    appVersion: string
    lindoVersion: string
    titleBar?: LindoTitleBar
  }
}
