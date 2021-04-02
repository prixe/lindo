import {Component, OnInit} from '@angular/core';
import {ApplicationService} from 'app/core/electron/application.service';
import {ElectronService as electron} from 'app/core/electron/electron.service';
import {IpcRendererService} from 'app/core/electron/ipcrenderer.service';
import {AuthService} from 'app/core/service/auth.service';
import {GameService} from 'app/core/service/game.service';
import {SettingsService} from 'app/core/service/settings.service';
import {TabGameService} from 'app/core/service/tab-game.service';
import {WindowService} from 'app/core/service/window.service';

@Component({
    selector: 'component-main',
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
    }

    ngOnInit(): void {
        this.setEventListener();
    }

    removeTabGameByMiddleClick($event: any, tabId: number) {
        if ($event.key === 2) {
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
        let window = electron.getCurrentWindow();
        window.webContents.on('new-window', ($event: any, url: string) => {
            $event.preventDefault();
            electron.openExternal(url);
        });
    }
}
