import {Component, Injector, OnInit} from '@angular/core';

import {SettingsService} from '@services/settings.service';
import {TabGameService} from '@services/tab-game.service';
import {TabService} from '@services/tab.service';
import {WindowService} from '@services/window.service';
import {BugReportService} from '@services/bug-report.service';
import {ApplicationService} from "@services/electron/application.service";
import {IpcRendererService} from "@services/electron/ipcrenderer.service";
import {Tab} from "@helpers/tab";
import {OptionWindowService} from "../../menus/option/option.window";

@Component({
    selector: 'app-main-sidebar-component',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

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
        this.ipcRendererService.on('new-tab', () => {
            this.tabGameService.addTabGame();
        });

        this.ipcRendererService.on('close-tab', () => {
            this.tabGameService.removeTabGame(this.tabService.active.id);
        });

        this.ipcRendererService.on('previous-tab', () => {

            const currentTab = this.tabService.active;
            const currentTabIndex = this.tabService.tabs.findIndex((element) => {
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

        this.ipcRendererService.on('next-tab', () => {

            const currentTab = this.tabService.active;
            const currentTabIndex = this.tabService.tabs.findIndex((element) => {
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
