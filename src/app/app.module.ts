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
import {MainComponent} from "app/windows/main/main.component";
import {GameComponent} from "app/windows/main/game/game.component";
import {ChangeLogComponent} from "app/windows/main/changelog/changelog.component";
import {OptionComponent} from "app/windows/main/option/option.component";
import {GeneralComponent} from "app/windows/main/option/general/general.component";
import {SidebarComponent} from "app/windows/main/sidebar/sidebar.component";
import {ToolbarComponent} from "app/windows/main/toolbar/toolbar.component";
import {VipComponent} from "app/windows/main/option/vip/vip.component";
import {GeneralComponent as VipGeneralComponent} from "app/windows/main/option/vip/general/general.component";
import {AutoGroupComponent} from "app/windows/main/option/vip/auto-group/auto-group.component";
import {MultiAccountComponent} from "app/windows/main/option/vip/multi-account/multi-account.component";
import {NotificationComponent} from "app/windows/main/option/notification/notification.component";
import {AuthenticationComponent} from "app/windows/main/authentication/authentication.component";
import {AboutComponent} from "app/windows/main/option/about/about.component";
import {UpdateComponent} from "app/windows/update/update.component";
import {BugReportComponent} from "app/windows/main/bug-report/bug-report.component";

import {MaterialModule} from "app/modules/material.module";
import {ServiceModule} from "app/modules/service.module";

import {ShortcutsComponent} from "app/windows/main/shortcuts/shortcuts.component";
import {InputComponent} from 'app/windows/main/shortcuts/input/input.component';
import {CommonModule, registerLocaleData} from "@angular/common";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SortablejsModule} from "ngx-sortablejs";
import {SafePipeModule} from "safe-pipe";

import {ShortcutsApplicationComponent} from "./windows/main/shortcuts/application/application.component";
import {ShortcutsInterfaceComponent} from "./windows/main/shortcuts/interface/interface.component";
import {ShortcutsInventoryComponent} from "./windows/main/shortcuts/inventory/inventory.component";
import {ShortcutsOtherComponent} from "./windows/main/shortcuts/other/other.component";
import {ShortcutsSpellComponent} from "./windows/main/shortcuts/spell/spell.component";

export function createTranslateLoader(http: HttpClient) {
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
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
            defaultLanguage: 'en'
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
        AuthenticationComponent,
        SidebarComponent,
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
        UpdateComponent,
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
