import crypto from 'crypto'
import userAgentsJson from './user-agents.json';
import ElectronStore from 'electron-store'


const USER_AGENT_ARRAY_LENGTH = 16;
interface UserAgent {
  ua: string;
  platformVersion: string;
  model: string;
}
const userAgents: UserAgent[] = userAgentsJson as UserAgent[];
interface UserAgentStore {
  maxAge: string;
  userAgents: UserAgent[]
}

const _getUA = (): UserAgent[] => {
  const maxIndex = userAgents.length - 1;
  const index = crypto.randomInt(0, maxIndex - USER_AGENT_ARRAY_LENGTH);
  return userAgents.slice(index, index + USER_AGENT_ARRAY_LENGTH);
}

export const generateUserArgent = async (appVersion: string, index: number = 0) => {
  if (index < 0 || index > userAgents.length - 1) {
    index = 0;
  }
  const storage = new ElectronStore<UserAgentStore>()
  const now = new Date()

  let uas: UserAgent[]
  if (!storage.get('userAgents') || new Date(storage.get('maxAge')) < now) {
    uas = _getUA();
    const expireDay = crypto.randomInt(10, 360)
    const maxAge = new Date(now.setDate(now.getDate() + expireDay)).toString()
    storage.set('userAgents', uas)
    storage.set('maxAge', maxAge)
  } else {
    uas = storage.get('userAgents')
  }
  return uas[index].ua + ' DofusTouch Client ' + appVersion
}

export const userAgentFromIndex = (index: number = 0): UserAgent => {
  const storage = new ElectronStore<UserAgentStore>()
  const uas = storage.get('userAgents');
  return uas[index]
}