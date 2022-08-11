import { app } from 'electron'
import { Application } from './application'
import { setupRootStore } from './store'
import { setupTitlebar } from 'custom-electron-titlebar/main'
import { logger } from './logger'
import { electronLocalshortcut } from '@hfelix/electron-localshortcut'
import { getCurrentKeyboardLayout, getKeyMap } from 'native-keymap'

// prevent chrome using cpu instead of the gpu
app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true')

// prevent throttling when window is not focus
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.commandLine.appendSwitch('disable-renderer-backgrounding')
app.commandLine.appendSwitch('disable-background-timer-throttling')

// more webgl and less black screen (default is probably 16, maybe...)
app.commandLine.appendSwitch('max-active-webgl-contexts', '32')

electronLocalshortcut.setKeyboardLayout(getCurrentKeyboardLayout(), getKeyMap())

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.whenReady().then(async () => {
  logger.debug('App -> whenReady')
  setupTitlebar()
  const store = await setupRootStore()
  await Application.init(store)
  Application.instance.run()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
