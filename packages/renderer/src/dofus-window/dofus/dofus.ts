import { ConnectionManager } from './connection-manager'

export interface Dofus {
  connectionManager: ConnectionManager
  sendMessage: (message: string, args: unknown) => void
}
