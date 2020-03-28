import { Component, Injector, OnInit } from '@angular/core';

import { Tab } from 'app/core/classes/tab';
import { ApplicationService } from 'app/core/electron/application.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { SettingsService } from 'app/core/service/settings.service';
import { TabGameService } from 'app/core/service/tab-game.service';
import { TabService } from 'app/core/service/tab.service';
import { WindowService } from 'app/core/service/window.service';
import { OptionWindowService } from '../../window/option/option.window';
import { BugReportService } from 'app/core/service/bug-report.service';

@Component({
    selector: 'component-tab-game',
    templateUrl: './tab-game.component.html',
    styleUrls: ['./tab-game.component.scss']
})
export class TabGameComponent implements OnInit {

    public windowService: WindowService;
    public appName: string;

    constructor(public option: OptionWindowService,
                public tabService: TabService,
                public tabGameService: TabGameService,
                private applicationService: ApplicationService,
                public settingsService: SettingsService,
                private ipcRendererService: IpcRendererService,
                public bugReportService: BugReportService,
                private injector: Injector) {
        this.windowService = this.injector.get(WindowService)
        this.appName = applicationService.appName;
    }

    ngOnInit() {

        this.tabGameService.on('icon-change', (tab: Tab) => {
            this.windowService.window.document.getElementById(`tab-icon-${tab.id}`).innerHTML = '';
            this.windowService.window.document.getElementById(`tab-icon-${tab.id}`).style.display = 'none';
            if (tab.icon) {
                this.windowService.window.document.getElementById(`tab-icon-${tab.id}`).appendChild(tab.icon);
                this.windowService.window.document.getElementById(`tab-icon-${tab.id}`).style.display = 'block';
            }

        });

        if (!isElectron) {
            this.tabGameService.addTabGame();
            return;
        }

        //Ouverture du premier onglet
        if (this.settingsService.option.vip.multiaccount.active && Application.masterPassword != '')
            if (this.settingsService.option.vip.multiaccount.windows.length == 0) {
                this.tabGameService.addTabGame();
            } else {
                this.ipcRendererService.send('window-ready');
            }
        else {
            this.tabGameService.addTabGame();
        }

        //Définition des événements
        this.ipcRendererService.on('new-tab', (event: Event) => {
            this.tabGameService.addTabGame();
        });

        this.ipcRendererService.on('close-tab', (event: Event) => {
            this.tabGameService.removeTabGame(this.tabService.active.id);
        });

        this.ipcRendererService.on('previous-tab', (event: Event) => {

            let currentTab = this.tabService.active;
            let currentTabIndex = this.tabService.tabs.findIndex((element) => {
                return element.id == currentTab.id;
            });

            if (typeof (this.tabService.tabs[(currentTabIndex - 1)]) != 'undefined') {
                this.tabGameService.selectTabGame(this.tabService.tabs[(currentTabIndex - 1)].id);
            } else {
                if (typeof (this.tabService.tabs.slice(-1).pop()) != 'undefined') {
                    this.tabGameService.selectTabGame(this.tabService.tabs.slice(-1).pop().id);
                }
            }
        });

        this.ipcRendererService.on('next-tab', (event: Event) => {

            let currentTab = this.tabService.active;
            let currentTabIndex = this.tabService.tabs.findIndex((element) => {
                return element.id == currentTab.id;
            });

            if (typeof (this.tabService.tabs[(currentTabIndex + 1)]) != 'undefined') {
                this.tabGameService.selectTabGame(this.tabService.tabs[(currentTabIndex + 1)].id);
            } else {
                if (typeof (this.tabService.tabs[0]) != 'undefined') {
                    this.tabGameService.selectTabGame(this.tabService.tabs[0].id);
                }
            }
        });

        this.ipcRendererService.on('switch-tab', (event: Event, tabIndex: number) => {

            if (typeof (this.tabService.tabs[tabIndex]) != 'undefined') {
                this.tabGameService.selectTabGame(this.tabService.tabs[tabIndex].id);
            }
        });

    }

}
