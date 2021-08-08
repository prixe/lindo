import {Logger} from './core/logger/logger-lindo';
import {Application} from './application';
import {Settings} from './settings/settings';
import {app, BrowserWindow, dialog} from 'electron';

const i18n = require('node-translate');

require('@electron/remote/main').initialize();

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-background-timer-throttling");

app.on('ready', () => {

    process.on('uncaughtException', function (error) {

        Logger.error(error);

        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            type: 'error',
            title: i18n.t('uncaught-exception.title'),
            message: i18n.t('uncaught-exception.message'),
            buttons: [i18n.t('uncaught-exception.close')]
        }).then(function () {
            Settings.resetSettings();
            app.exit();
        });
    });

    Settings.init();
    Application.run();
});