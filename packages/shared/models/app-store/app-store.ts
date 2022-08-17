import { Locales } from '@lindo/i18n'
import { v4 as uuidv4 } from 'uuid'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const LANGUAGE_KEYS: Array<Locales> = ['fr', 'en', 'es']

/**
 * Model description here for TypeScript hints.
 */
export const AppStoreModel = types
  .model('AppStore')
  .props({
    userId: types.optional(types.string, () => uuidv4()),
    appVersion: types.optional(types.string, '1.0.0'),
    buildVersion: types.optional(types.string, '1.0.0'),
    lindoVersion: types.optional(types.string, '1.0.0'),
    _language: types.maybe(types.enumeration<Locales>(LANGUAGE_KEYS)),
    dofusTouchEarly: types.optional(types.boolean, false)
  })
  .views((self) => ({
    get language(): Locales {
      return self._language ?? 'en'
    }
  }))
  .actions((self) => ({
    setAppVersion(appVersion: string) {
      if (self.appVersion !== appVersion) {
        self.appVersion = appVersion
      }
    },
    setBuildVersion(buildVersion: string) {
      if (self.buildVersion !== buildVersion) {
        self.buildVersion = buildVersion
      }
    },
    setLindoVersion(lindoVersion: string) {
      if (self.lindoVersion !== lindoVersion) {
        self.lindoVersion = lindoVersion
      }
    },
    setLanguageKey(language: Locales) {
      self._language = language
    },
    setDofusTouchEarly(dofusTouchEarly: boolean) {
      self.dofusTouchEarly = dofusTouchEarly
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type AppStoreType = Instance<typeof AppStoreModel>

export interface AppStore extends AppStoreType {}

type AppStoreSnapshotType = SnapshotOut<typeof AppStoreModel>

export interface AppStoreSnapshot extends AppStoreSnapshotType {}
