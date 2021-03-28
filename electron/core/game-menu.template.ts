import { Application } from '../application';
import { ShortCuts } from './shortcuts';
import { app } from 'electron';

const settings = require('electron-settings');
const i18n = require('node-translate');

export class GameMenuTemplate {

    static build(): Electron.MenuItemConstructorOptions[] {

        const template: Electron.MenuItemConstructorOptions[] = [
            {
                label: i18n.t('game-menu.file.title'),
                submenu: [
                    {
                        label: i18n.t('game-menu.file.new-window'),
                        accelerator: ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.new_window')),
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            Application.addWindow();
                        }
                    },
                    {
                        label: i18n.t('game-menu.file.new-tab'),
                        accelerator: ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.new_tab')),
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.send('new-tab', {});
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: i18n.t('game-menu.file.close-tab'),
                        accelerator: 'CmdOrCtrl+W',
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.send('close-tab', {});
                        }
                    },
                    {
                        label: i18n.t('game-menu.file.close-window'),
                        accelerator: 'Shift+CmdOrCtrl+W',
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.close();
                        }
                    }
                ]
            },
            {
                label: i18n.t('game-menu.edit.title'),
                submenu: [
                    {
                        label: i18n.t('game-menu.edit.undo'),
                        role: 'undo'
                    },
                    {
                        label: i18n.t('game-menu.edit.redo'),
                        role: 'redo'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: i18n.t('game-menu.edit.cut'),
                        role: 'cut'
                    },
                    {
                        label: i18n.t('game-menu.edit.copy'),
                        role: 'copy'
                    },
                    {
                        label: i18n.t('game-menu.edit.paste'),
                        role: 'paste'
                    },
                    {
                        label: i18n.t('game-menu.edit.selectall'),
                        role: 'selectAll'
                    }
                ]
            },
            {
                label: i18n.t('game-menu.window.title'),
                submenu: [

                    {
                        label: i18n.t('game-menu.window.reload'),
                        accelerator: 'CmdOrCtrl+R',
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            if (focusedWindow) focusedWindow.reload()
                        }
                    },
                    {
                        type: 'separator'
                    },

                    {
                        label: i18n.t('game-menu.window.prev-tab'),
                        accelerator: ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.prev_tab')),
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.send('previous-tab', 'prev');
                        }
                    },
                    {
                        label: i18n.t('game-menu.window.next-tab'),
                        accelerator: ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.next_tab')),
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.send('next-tab', 'next');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        'label': i18n.t('game-menu.window.disable-sound'),
                        'type': "checkbox",
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.setAudioMuted(item.checked);
                        }
                    },
                    {
                        label: i18n.t('game-menu.window.zoomin'),
                        role: 'zoomIn'
                    },
                    {
                        label: i18n.t('game-menu.window.zoomout'),
                        role: 'zoomOut'
                    },
                    {
                        label: i18n.t('game-menu.window.resetzoom'),
                        role: 'resetZoom'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: i18n.t('game-menu.window.full-screen'),
                        role: 'togglefullscreen'
                    }
                ]
            },
            {
                label: i18n.t('game-menu.infos.title'),
                submenu: [
                    {
                        label: i18n.t('game-menu.infos.console'),
                        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                        }
                    }
                ]
            }
        ];

        if (process.platform === 'darwin') {
            this.darwin(template);
        }

        return template;
    }

    static darwin(template: any) {
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        })
        // Edit menu.
        template[2].submenu.push(
            {
                type: 'separator'
            },
            {
                label: i18n.t('game-menu.window.sound'),
                submenu: [
                    {
                        label: i18n.t('game-menu.window.enable-sound'),
                        role: 'startspeaking'
                    },
                    {
                        label: i18n.t('game-menu.window.disable-sound'),
                        role: 'stopspeaking'
                    }
                ]
            }
        )
    }
}
