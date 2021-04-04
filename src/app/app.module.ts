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
import {GameComponent} from "app/windows/main/layout/game/game.component";
import {ChangeLogComponent} from "app/windows/main/menus/changelog/changelog.component";
import {OptionComponent} from "app/windows/main/menus/option/option.component";
import {GeneralComponent} from "app/windows/main/menus/option/general/general.component";
import {SidebarComponent} from "app/windows/main/layout/sidebar/sidebar.component";
import {ToolbarComponent} from "app/windows/main/layout/toolbar/toolbar.component";
import {FeraturesComponent} from "app/windows/main/menus/option/features/feratures.component";
import {GeneralComponent as VipGeneralComponent} from "app/windows/main/menus/option/features/general/general.component";
import {GroupComponent} from "app/windows/main/menus/option/features/group/group.component";
import {AccountsComponent} from "app/windows/main/menus/option/features/accounts/accounts.component";
import {NotificationsComponent} from "app/windows/main/menus/option/notifications/notifications.component";
import {AuthenticationComponent} from "app/windows/main/authentication/authentication.component";
import {AboutComponent} from "app/windows/main/menus/option/about/about.component";
import {UpdateComponent} from "app/windows/update/update.component";
import {BugReportComponent} from "app/windows/main/bug-report/bug-report.component";

import {MaterialModule} from "app/modules/material.module";
import {ServiceModule} from "app/modules/service.module";

import {ShortcutsComponent} from "app/windows/main/menus/shortcuts/shortcuts.component";
import {InputComponent} from 'app/windows/main/menus/shortcuts/input/input.component';
import {CommonModule, registerLocaleData} from "@angular/common";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SortablejsModule} from "ngx-sortablejs";
import {SafePipeModule} from "safe-pipe";

import {ShortcutsApplicationComponent} from "./windows/main/menus/shortcuts/application/application.component";
import {ShortcutsInterfaceComponent} from "./windows/main/menus/shortcuts/interface/interface.component";
import {ShortcutsInventoryComponent} from "./windows/main/menus/shortcuts/inventory/inventory.component";
import {ShortcutsOtherComponent} from "./windows/main/menus/shortcuts/other/other.component";
import {ShortcutsSpellComponent} from "./windows/main/menus/shortcuts/spell/spell.component";

export const createTranslateLoader = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, '../../locale/', '.json');

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
        NotificationsComponent,
        FeraturesComponent,
        GroupComponent,
        VipGeneralComponent,
        AccountsComponent,
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
