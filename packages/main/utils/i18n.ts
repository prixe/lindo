import { L, Locales } from '@lindo/i18n'
import { RootStore } from '@lindo/shared'
import TypedEmitter from 'typed-emitter'
import { observe } from 'mobx'
import { EventEmitter } from 'stream'

export type I18nEvents = {
  localeChanged: (local: Locales) => void
}

export class I18n extends (EventEmitter as new () => TypedEmitter<I18nEvents>) {
  private _locale: Locales = 'en'

  constructor(private readonly _rootStore: RootStore) {
    super()
    observe(this._rootStore.appStore, 'language', () => {
      this._locale = this._rootStore.appStore.language as Locales
      this.emit('localeChanged', this._locale)
    })
  }

  get LL() {
    return L[this._locale]
  }
}
