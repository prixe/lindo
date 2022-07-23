import crypto from 'crypto'
import userAgents from './user-agents.json'
import ElectronStore from 'electron-store'

interface UserAgentStore {
  userAgent: {
    ua: string
    maxAge: string
  }
}

const _getUA = (appVersion: string): string => {
  const maxIndex = userAgents.length - 1
  const index = crypto.randomInt(0, maxIndex)

  const userAgent = userAgents[index] + ' DofusTouch Client ' + appVersion
  return userAgent
}

export const generateUserArgent = async (appVersion: string) => {
  const storage = new ElectronStore<UserAgentStore>()
  const now = new Date()

  if (!storage.get('userAgent') || new Date(storage.get('userAgent').maxAge) < now) {
    const ua = _getUA(appVersion)

    const expireDay = crypto.randomInt(10, 360)
    const maxAge = new Date(now.setDate(now.getDate() + expireDay)).toString()

    storage.set('userAgent', {
      ua,
      maxAge
    } as UserAgentStore['userAgent'])

    return ua
  } else {
    return storage.get('userAgent').ua
  }
}
