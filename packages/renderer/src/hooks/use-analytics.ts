// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import * as Analytics from 'firebase/analytics'
import { getPerformance } from 'firebase/performance'
import { useAnalyticsContext } from '@/providers'

export type EventTypes = 'login' | 'logout'

export interface ReturnUseAnalytics {
  createInstance: (userId: string, appVersion: string, platform: string) => Analytics.Analytics
  logEvent: (eventName: EventTypes, params?: { [key: string]: string }) => void
}

const firebaseConfig = {
  apiKey: 'AIzaSyA2hoHCBYKkdpo1v-DZSvWRcnm27MIKVJ4',
  authDomain: 'lindo-f0967.firebaseapp.com',
  projectId: 'lindo-f0967',
  storageBucket: 'lindo-f0967.appspot.com',
  messagingSenderId: '396212400771',
  appId: '1:396212400771:web:a007ce293c95b1c019e1b6',
  measurementId: 'G-RL5ZZQXEFD'
}

export const useAnalytics = (): ReturnUseAnalytics => {
  const analytics = useAnalyticsContext()

  const createInstance = (userId: string, appVersion: string, platform: string) => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const analytics = Analytics.getAnalytics(app)
    getPerformance()

    Analytics.setUserId(analytics, userId)
    Analytics.setUserProperties(analytics, {
      appVersion,
      platform
    })
    Analytics.logEvent(analytics, 'app init')

    return analytics
  }

  const logEvent = (eventName: EventTypes) => {
    if (!analytics) {
      throw new Error('Analytics not initialized')
    }
    Analytics.logEvent(analytics, eventName as string)
  }

  return { createInstance, logEvent }
}
