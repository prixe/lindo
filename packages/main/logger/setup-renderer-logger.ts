import { IPCEvents } from '@lindo/shared'
import { ipcMain } from 'electron'
import { rendererLogger } from './logger'

export const setupRendererLogger = (): void => {
  ipcMain.on(IPCEvents.LOGGER_DEBUG, (event, ...args) => {
    rendererLogger.debug.apply(null, args as never)
  })
  ipcMain.on(IPCEvents.LOGGER_INFO, (event, ...args) => {
    rendererLogger.info.apply(null, args as never)
  })
  ipcMain.on(IPCEvents.LOGGER_WARN, (event, ...args) => {
    rendererLogger.warn.apply(null, args as never)
  })
  ipcMain.on(IPCEvents.LOGGER_ERROR, (event, ...args) => {
    rendererLogger.error.apply(null, args as never)
  })
}
