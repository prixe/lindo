declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    readonly VITE_DEV_SERVER_HOST: string
    readonly VITE_DEV_SERVER_PORT: string
  }
}

// fix type issue with the custom electron-title-bar lib
declare module 'custom-electron-titlebar/main' {
  export function setupTitlebar(): void
  export function attachTitlebarToWindow(browserWindow: Electron.BrowserWindow): void
}
