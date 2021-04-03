import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from 'app/windows/main/main.component';
import {GeneralComponent} from 'app/windows/main/option/general/general.component';
import {NotificationComponent} from 'app/windows/main/option/notification/notification.component';
import {AutoGroupComponent} from 'app/windows/main/option/vip/auto-group/auto-group.component';
import {GeneralComponent as VipGeneralComponent} from 'app/windows/main/option/vip/general/general.component';
import {MultiAccountComponent} from 'app/windows/main/option/vip/multi-account/multi-account.component';
import {VipComponent} from 'app/windows/main/option/vip/vip.component';

import {ShortcutsOtherComponent} from "app/windows/main/shortcuts/other/other.component";
import {ShortcutsApplicationComponent} from "app/windows/main/shortcuts/application/application.component";
import {ShortcutsInventoryComponent} from "app/windows/main/shortcuts/inventory/inventory.component";
import {ShortcutsInterfaceComponent} from "app/windows/main/shortcuts/interface/interface.component";
import {ShortcutsSpellComponent} from "app/windows/main/shortcuts/spell/spell.component";
import {UpdateComponent} from "app/windows/update/update.component";
import {AboutComponent} from "app/windows/main/option/about/about.component";
import {BugReportComponent} from "app/windows/main/bug-report/bug-report.component";

const appRoutes: Routes = [
    {
        path: '', component: MainComponent
    },
    {
        path: 'option',
        children: [
            { path: 'general', component: GeneralComponent },
            {
                path: 'features',
                component: VipComponent,
                children: [
                    { path: 'general', component: VipGeneralComponent, outlet: 'featuresOutlet' },
                    { path: 'groups', component: AutoGroupComponent, outlet: 'featuresOutlet' },
                    { path: 'accounts', component: MultiAccountComponent, outlet: 'featuresOutlet' }
                ]
            },
            { path: 'notification', component: NotificationComponent },
            { path: 'about', component: AboutComponent }
        ]
    },
    {
        path: 'shortcuts',
        children: [
            { path: 'application', component: ShortcutsApplicationComponent },
            { path: 'interface', component: ShortcutsInterfaceComponent },
            { path: 'spell', component: ShortcutsSpellComponent },
            { path: 'inventory', component: ShortcutsInventoryComponent },
            { path: 'other', component: ShortcutsOtherComponent }
        ]
    },
    {
        path: 'official-game-update',
        children: [
            { path: ':destinationPath', component: UpdateComponent }
        ]
    },
    {
        path: 'bug-report',
        children: [
            { path: ':destinationPath', component: BugReportComponent }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
    useHash: true,
    relativeLinkResolution: 'legacy'
})
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
