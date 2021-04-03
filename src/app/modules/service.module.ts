import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {CryptService} from '@services/crypt.service';
import {GameService} from '@services/game.service';
import {PromptService} from '@services/prompt.service';
import {SettingsService} from '@services/settings.service';
import {SoundService} from '@services/sound.service';
import {TabGameService} from '@services/tab-game.service';
import {TabService} from '@services/tab.service';
import {WindowService} from '@services/window.service';
import {BugReportService} from '@services/bug-report.service';
import {ApplicationService} from "@services/electron/application.service";
import {ChangelogWindowService} from "@windows/changelog/changelog.window";
import {OptionWindowService} from "@windows/option/option.window";
import {ShortcutsWindowService} from "@windows/shortcuts/shortcuts.window";
import {ElectronService} from "@services/electron/electron.service";
import {IpcRendererService} from "@services/electron/ipcrenderer.service";

export function applicationServiceFactory(config: ApplicationService) {
    return function () {
        return config.load();
    }
}

export function settingModuleFactory(setting: SettingsService) {
    return setting.language;
}

@NgModule({
    imports: [],
    declarations: [],
    providers: [
        WindowService,
        ChangelogWindowService,
        OptionWindowService,
        ShortcutsWindowService,
        PromptService,
        ElectronService,
        TabService,
        GameService,
        TabGameService,
        AuthService,
        SettingsService,
        IpcRendererService,
        CryptService,
        ApplicationService,
        SoundService,
        BugReportService,
        {
            provide: APP_INITIALIZER,
            useFactory: applicationServiceFactory,
            deps: [ApplicationService],
            multi: true
        },
        {
            provide: LOCALE_ID,
            deps: [SettingsService],
            useFactory: settingModuleFactory
        }
    ],
    exports: []
})
export class ServiceModule { }
