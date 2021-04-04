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
import {ElectronService} from "@services/electron/electron.service";
import {IpcRendererService} from "@services/electron/ipcrenderer.service";

import {ChangelogWindowService} from "../windows/main/menus/changelog/changelog.window";
import {OptionWindowService} from "../windows/main/menus/option/option.window";
import {ShortcutsWindowService} from "../windows/main/menus/shortcuts/shortcuts.window";

export const applicationServiceFactory = (config: ApplicationService) => () => config.load();
export const settingModuleFactory = (setting: SettingsService) => setting.language;

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
