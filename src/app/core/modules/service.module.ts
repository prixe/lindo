import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { ElectronService } from 'app/core/electron/electron.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { AuthService } from 'app/core/service/auth.service';
import { CryptService } from 'app/core/service/crypt.service';
import { GameService } from 'app/core/service/game.service';
import { PromptService } from 'app/core/service/prompt.service';
import { SettingsService } from 'app/core/service/settings.service';
import { SoundService } from 'app/core/service/sound.service';
import { TabGameService } from 'app/core/service/tab-game.service';
import { TabService } from 'app/core/service/tab.service';
import { WindowService } from 'app/core/service/window.service';
import { ChangelogWindowService } from 'app/window/changelog/changelog.window';
import { OptionWindowService } from 'app/window/option/option.window';
import { ShortcutsWindowService } from 'app/window/shortcuts/shortcuts.window';
import { BugReportService } from 'app/core/service/bug-report.service';

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
