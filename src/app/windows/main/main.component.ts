import {Component, OnInit} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {GameService} from '@services/game.service';
import {SettingsService} from '@services/settings.service';
import {TabGameService} from '@services/tab-game.service';
import {WindowService} from '@services/window.service';
import {IpcRendererService} from "@services/electron/ipcrenderer.service";
import {ApplicationService} from "@services/electron/application.service";
import {ElectronService as electron} from '@services/electron/electron.service';

@Component({
    selector: 'app-main-component',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    constructor(private windowService: WindowService,
                public tabGameService: TabGameService,
                public gameService: GameService,
                private ipcRendererService: IpcRendererService,
                private settingsService: SettingsService,
                private applicationService: ApplicationService,
                public authService: AuthService) {
        this.windowService.window.appVersion = applicationService.remoteAppVersion;
        this.windowService.window.buildVersion = applicationService.remoteBuildVersion;
        this.windowService.window.lindoVersion = applicationService.version;
    }

    ngOnInit(): void {
        this.setEventListener();
    }

    removeTabGameByMiddleClick($event: any, tabId: number) {
        if ($event.which === 2) {
            this.tabGameService.removeTabGame(tabId);
            $event.preventDefault();
        }
    }

    setEventListener(): void {
        // On connecte les comptes dans des onglets de la fenêtre
        this.ipcRendererService.on('accounts', (event: Event, accounts: any) => {
            this.tabGameService.addMultiAccountGames(accounts);
        });

        // On renvoie les ouvertures d'url vers le navigateur du pc
        const window = electron.getCurrentWindow();
        window.webContents.on('new-window', ($event: any, url: string) => {
            $event.preventDefault();
            electron.openExternal(url);
        });
    }
}
