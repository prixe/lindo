import { useStores } from '@/store'
import { useI18nContext } from '@lindo/i18n'
import { reaction } from 'mobx'
import React, { ReactNode, useEffect } from 'react'

export interface LocalProviderProps {
  children: ReactNode
}

export const LocalProvider = ({ children }: LocalProviderProps) => {
  const { locale, setLocale } = useI18nContext()
  const { appStore } = useStores()

  useEffect(() => {
    return reaction(
      () => appStore.language,
      (language) => {
        if (language !== locale) {
          setLocale(language)
        }
      },
      { fireImmediately: true }
    )
  }, [])

  return <>{children}</>
}
