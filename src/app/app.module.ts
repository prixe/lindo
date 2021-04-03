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
import {MainComponent} from "app/components/main/main.component";
import {GameComponent} from "app/components/main/game/game.component";
import {ChangeLogComponent} from "app/components/main/changelog/changelog.component";
import {OptionComponent} from "app/components/main/option/option.component";
import {GeneralComponent} from "app/components/main/option/general/general.component";
import {SidebarComponent} from "app/components/main/sidebar/sidebar.component";
import {ToolbarComponent} from "app/components/main/toolbar/toolbar.component";
import {VipComponent} from "app/components/main/option/vip/vip.component";
import {GeneralComponent as VipGeneralComponent} from "app/components/main/option/vip/general/general.component";
import {AutoGroupComponent} from "app/components/main/option/vip/auto-group/auto-group.component";
import {MultiAccountComponent} from "app/components/main/option/vip/multi-account/multi-account.component";
import {NotificationComponent} from "app/components/main/option/notification/notification.component";
import {AuthenticationComponent} from "app/components/main/authentication/authentication.component";
import {AboutComponent} from "app/components/main/option/about/about.component";
import {UpdateComponent} from "app/components/update/update.component";
import {BugReportComponent} from "app/components/main/bug-report/bug-report.component";

import {MaterialModule} from "app/modules/material.module";
import {ServiceModule} from "app/modules/service.module";

import {ShortcutsComponent} from "app/components/main/shortcuts/shortcuts.component";
import {InputComponent} from 'app/components/main/shortcuts/input/input.component';
import {CommonModule, registerLocaleData} from "@angular/common";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SortablejsModule} from "ngx-sortablejs";
import {SafePipeModule} from "safe-pipe";

import {ShortcutsApplicationComponent} from "./components/main/shortcuts/application/application.component";
import {ShortcutsInterfaceComponent} from "./components/main/shortcuts/interface/interface.component";
import {ShortcutsInventoryComponent} from "./components/main/shortcuts/inventory/inventory.component";
import {ShortcutsOtherComponent} from "./components/main/shortcuts/other/other.component";
import {ShortcutsSpellComponent} from "./components/main/shortcuts/spell/spell.component";

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
