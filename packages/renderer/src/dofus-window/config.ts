export interface Config {
  adjust: { appToken: string; environment: string }
  assetsUrl: string
  dataUrl: string
  disabledFeatures: { betaAccess: boolean; shopByServerIdList: Array<string> }
  failoverLanguage: string
  haapi: { id: number; hostname: string }
  imgCrossOrigin: string
  language: string
  logging: { groups: boolean; logLevels: {}; config: {}; disableOverride: boolean }
  notification: { push: {} }
  recaptcha: { proxyUrl: string; ankamaUrl: string }
  serverLanguages: Array<string>
  sessionId: string
  uiUrl: string
}
