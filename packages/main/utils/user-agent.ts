import crypto from 'crypto'
import userAgents from './user-agents.json'
import ElectronStore from 'electron-store'

interface UserAgentStore {
  userAgent: {
    ua: string
    maxAge: string
  }
}

const _getUA = (): string => {
  const maxIndex = userAgents.length - 1
  const index = crypto.randomInt(0, maxIndex)

  return userAgents[index]
}

export const generateUserArgent = async (appVersion: string) => {
  const storage = new ElectronStore<UserAgentStore>()
  const now = new Date()

  let ua: string
  if (!storage.get('userAgent') || new Date(storage.get('userAgent').maxAge) < now) {
    ua = _getUA()

    const expireDay = crypto.randomInt(10, 360)
    const maxAge = new Date(now.setDate(now.getDate() + expireDay)).toString()

    storage.set('userAgent', {
      ua,
      maxAge
    } as UserAgentStore['userAgent'])
  } else {
    ua = storage.get('userAgent').ua
  }

  return ua + ' DofusTouch Client ' + appVersion
}
