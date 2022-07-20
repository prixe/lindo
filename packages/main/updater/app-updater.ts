import { RootStore } from '@lindo/shared'
import { Octokit } from '@octokit/rest'
import compareVersions from 'compare-versions'
import { app, dialog, shell } from 'electron'
import { I18n } from '../utils'

export class AppUpdater {
  private readonly _rootStore: RootStore
  private readonly _octokit: Octokit
  private readonly _i18n: I18n

  private constructor(rootStore: RootStore, i18n: I18n) {
    this._rootStore = rootStore
    this._i18n = i18n
    this._octokit = new Octokit()
  }

  static async init(rootStore: RootStore, i18n: I18n): Promise<AppUpdater> {
    return new AppUpdater(rootStore, i18n)
  }

  async run() {
    // set the current version of the app
    const currentVersion = app.getVersion()
    this._rootStore.appStore.setLindoVersion(currentVersion)

    return this._octokit.repos
      .getLatestRelease({
        owner: 'prixe',
        repo: 'lindo'
      })
      .then((res) => {
        const latestVersion = res.data.tag_name.replaceAll('v', '')
        console.log({ latestVersion, currentVersion })
        if (compareVersions(latestVersion, currentVersion) === 1) {
          this._showUpdateDialog(latestVersion)
        }
      })
  }

  private _showUpdateDialog(newVersion: string) {
    const buttons: Array<string> = [this._i18n.LL.main.updater.download(), this._i18n.LL.main.updater.ignore()]
    return dialog
      .showMessageBox({
        type: 'info',
        title: this._i18n.LL.main.updater.title({ version: newVersion }),
        message: this._i18n.LL.main.updater.message({ version: newVersion }),
        buttons
      })
      .then((returnValue) => {
        if (returnValue.response === 0) {
          console.log('[UPDATE] Redirected to app download page.')
          shell.openExternal('https://github.com/prixe/lindo/releases/latest')
          app.exit()
        } else {
          console.log('[UPDATE] App update ignored.')
        }
      })
  }
}
