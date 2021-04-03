import {ShortcutsSpellComponent} from '@windows/shortcuts/spell/spell.component';
import {ShortcutsOtherComponent} from '@windows/shortcuts/other/other.component';
import {ShortcutsInventoryComponent} from '@windows/shortcuts/inventory/inventory.component';
import {ShortcutsInterfaceComponent} from '@windows/shortcuts/interface/interface.component';
import {ShortcutsApplicationComponent} from '@windows/shortcuts/application/application.component';

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeIt from '@angular/common/locales/it';
import localePl from '@angular/common/locales/pl';
import localeTr from '@angular/common/locales/tr';


import {AppRoutingModule} from './app.routing';

import {AppComponent} from "app/app.component";
import {MainComponent} from "app/main/main.component";
import {GameComponent} from "app/components/game/game.component";
import {ChangeLogComponent} from "app/windows/changelog/changelog.component";
import {OptionComponent} from "app/windows/option/option.component";
import {GeneralComponent} from "app/windows/option/general/general.component";
import {TabGameComponent} from "app/main/tab-game/tab-game.component";
import {ToolbarComponent} from "app/main/toolbar/toolbar.component";
import {VipComponent} from "app/windows/option/vip/vip.component";
import {GeneralComponent as VipGeneralComponent} from "app/windows/option/vip/general/general.component";
import {AutoGroupComponent} from "app/windows/option/vip/auto-group/auto-group.component";
import {MultiAccountComponent} from "app/windows/option/vip/multi-account/multi-account.component";
import {NotificationComponent} from "app/windows/option/notification/notification.component";
import {AuthComponent} from "app/components/auth/auth.component";
import {AboutComponent} from "app/windows/option/about/about.component";
import {OfficialGameUpdateComponent} from "app/windows/official-game-update/official-game-update.component";
import {BugReportComponent} from "app/windows/bug-report/bug-report.component";

import {MaterialModule} from "app/modules/material.module";
import {ServiceModule} from "app/modules/service.module";

import {ShortcutsComponent} from "app/windows/shortcuts/shortcuts.component";
import {InputComponent} from 'app/windows/shortcuts/input/input.component';
import {CommonModule, registerLocaleData} from "@angular/common";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SortablejsModule} from "ngx-sortablejs";
import {SafePipeModule} from "safe-pipe";

export function translateModuleFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '../../locale/', '.json')
}

registerLocaleData(localeFr);
registerLocaleData(localeEn);
registerLocaleData(localeEs);
registerLocaleData(localeIt);
registerLocaleData(localePl);
registerLocaleData(localeTr);

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (translateModuleFactory),
                deps: [HttpClient]
            }
        }),
        SortablejsModule,
        FormsModule,
        TagInputModule,
        HttpClientModule,
        MaterialModule,
        ServiceModule,
        SafePipeModule
    ],
    declarations: [
        AppComponent,
        MainComponent,
        AuthComponent,
        TabGameComponent,
        ToolbarComponent,
        GameComponent,
        AboutComponent,
        ChangeLogComponent,
        OptionComponent,
        GeneralComponent,
        NotificationComponent,
        VipComponent,
        AutoGroupComponent,
        VipGeneralComponent,
        MultiAccountComponent,
        OfficialGameUpdateComponent,
        BugReportComponent,

        ShortcutsComponent,
        ShortcutsApplicationComponent,
        ShortcutsInterfaceComponent,
        ShortcutsInventoryComponent,
        ShortcutsOtherComponent,
        ShortcutsSpellComponent,
        InputComponent
    ],
    entryComponents: [
        ChangeLogComponent,
        OptionComponent,
        ShortcutsComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
