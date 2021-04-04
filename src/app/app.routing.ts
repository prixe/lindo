import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from 'app/windows/main/main.component';
import {GeneralComponent} from 'app/windows/main/menus/option/general/general.component';
import {NotificationsComponent} from 'app/windows/main/menus/option/notifications/notifications.component';
import {GroupComponent} from 'app/windows/main/menus/option/features/group/group.component';
import {GeneralComponent as VipGeneralComponent} from 'app/windows/main/menus/option/features/general/general.component';
import {AccountsComponent} from 'app/windows/main/menus/option/features/accounts/accounts.component';
import {FeraturesComponent} from 'app/windows/main/menus/option/features/feratures.component';

import {ShortcutsOtherComponent} from "app/windows/main/menus/shortcuts/other/other.component";
import {ShortcutsApplicationComponent} from "app/windows/main/menus/shortcuts/application/application.component";
import {ShortcutsInventoryComponent} from "app/windows/main/menus/shortcuts/inventory/inventory.component";
import {ShortcutsInterfaceComponent} from "app/windows/main/menus/shortcuts/interface/interface.component";
import {ShortcutsSpellComponent} from "app/windows/main/menus/shortcuts/spell/spell.component";
import {UpdateComponent} from "app/windows/update/update.component";
import {AboutComponent} from "app/windows/main/menus/option/about/about.component";
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
                component: FeraturesComponent,
                children: [
                    { path: 'general', component: VipGeneralComponent, outlet: 'featuresOutlet' },
                    { path: 'groups', component: GroupComponent, outlet: 'featuresOutlet' },
                    { path: 'accounts', component: AccountsComponent, outlet: 'featuresOutlet' }
                ]
            },
            { path: 'notification', component: NotificationsComponent },
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
