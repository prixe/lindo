import {AfterViewInit, Component, EventEmitter, Input, NgZone, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

import * as Mods from "@mods/index";
import {Mod} from "@mods/mod";
import {Game} from "@helpers/game";
import {WindowService} from "@services/window.service";
import {IpcRendererService} from "@services/electron/ipcrenderer.service";
import {SettingsService} from "@services/settings.service";
import {BugReportService} from "@services/bug-report.service";
import {ApplicationService} from "@services/electron/application.service";

@Component({
    selector: 'app-main-game-component',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

    @Input() public game: Game;
    @Output() selected = new EventEmitter();
    public gamePath: string;
    private gameLoaded: boolean = false;
    private backupMaxZoom: number;

    private mods: Mod[] = [];

    constructor(
        private windowService: WindowService,
        private ipcRendererService: IpcRendererService,
        private zone: NgZone,
        private settingsService: SettingsService,
        private bugReportService: BugReportService,
        private translateService: TranslateService,
        private applicationService: ApplicationService
    ) {
        this.gamePath = this.applicationService.gamePath + '/index.html?delayed=true';
    }

    ngAfterViewInit() {
        // after View Init get the iFrame
        this.game.window = this.windowService.window['Frame' + this.game.id].contentWindow;
    }

    public gameReady(): void {
        if (this.gameLoaded) {
            this.game.window.initDofus(() => {
                /* Hide the game loading overlay */
                const loading = document.getElementById("LoadingGame_" + this.game.id);

                if (loading) {
                    loading.style.opacity = '0';
                    setTimeout(() => {
                        loading.remove();
                    }, 500);
                }

                //this.plugins = new PluginsContainer(this.game.window);

                this.setEventListener();

                // If the tab has credentials, connect the account
                // Then delete credentials
                if (this.game.credentials)
                    this.connectAccount();

                this.ipcRendererService.on('reload-settings-done', () => {
                    if (this.game.window.gui.isConnected) {
                        this.reloadMods();
                    }
                });

            });

        }

        this.gameLoaded = true;
    }

    public removeMods(): void {
        for (const i in this.mods) {
            this.mods[i].reset();
        }
    }

    public reloadMods(start: boolean = true): void {
        this.removeMods();
        if (start) {
            this.setMods();
        }
    }

    public setMods(): void {
        for (const mod in Mods) {
            switch (mod) {
                case 'AutoGroup':
                    const autogroup = new Mods[mod](this.game.window, this.settingsService, this.translateService, this.ipcRendererService);
                    this.mods.push(autogroup)
                    break;
                case 'Notifications':
                    const notifications = new Mods[mod](this.game.window, this.settingsService, this.translateService);
                    notifications.eventEmitter.on('newNotification', () => {
                        this.zone.run(() => {
                            this.game.emit('notification');
                        });
                    });
                    notifications.eventEmitter.on('focusTab', () => {
                        this.zone.run(() => {
                            this.selected.emit(this.game);
                        });
                    });
                    this.mods.push(notifications)
                    break;
                default:
                    this.mods.push(new Mods[mod](this.game.window, this.settingsService, this.translateService))
            }
        }
    }

    private setEventListener(): void {
        // event -> resize window game
        this.game.window.onresize = () => {
            //if(this.game.window.gui.isConnected){
            try {
                this.game.window.gui._resizeUi();
            } catch (e) {
            }

            this.checkMaxZoom();
            //}
        };

        const onCharacterSelectedSuccess = () => {
            // retrieve character name and update zone.js
            this.zone.run(() => {
                this.game.emit('character', this.game.window.gui.playerData.characterBaseInformations.name);
                this.game.emit('logged', true);

                /* create icon */
                const char = new this.game.window.CharacterDisplay({scale: 'fitin'});
                char.setLook(this.game.window.gui.playerData.characterBaseInformations.entityLook, {
                    riderOnly: true,
                    direction: 4,
                    animation: 'AnimArtwork',
                    boneType: 'timeline/',
                    skinType: 'timeline/'
                });
                char.rootElement.style.width = '100%';
                char.rootElement.style.height = '100%';

                this.game.emit('icon', char.rootElement);
            });

            this.setMods();
            this.checkMaxZoom();
        };

        const onDisconnect = () => {
            this.zone.run(() => {
                this.game.emit('character', null);
                this.game.emit('logged', false);
                this.game.emit('icon', null);
                this.removeMods();
            });
            this.removeMods();
        };

        this.game.window.gui.playerData.on("characterSelectedSuccess", onCharacterSelectedSuccess);
        this.game.window.gui.on("disconnect", onDisconnect);

        this.game.window.onerror = (messageOrEvent, source, line, column, error) => {
            try {
                const anonymousIdentity = this.getAnonymousIdentity();
                const stack = error.stack.replace(/(\S+)(\/lindo\/)/g, '$2'); // Remove the full path to avoid sending OS account name

                this.bugReportService.writeLog(anonymousIdentity, stack);
            } catch (e) {
                Logger.error(e);
            }
        };

        const consoleError = this.game.window.console.error;
        this.game.window.console.error = function () {
            const anonymousIdentity = this.getAnonymousIdentity();
            let report = "";
            for (let i = 0; i < arguments.length; i++) {
                report += JSON.stringify(arguments[i]) + "\n";
            }
            report = report.trim();
            this.bugReportService.writeLog(anonymousIdentity, report);
            return consoleError.apply(this.game.window.console, arguments)
        }.bind(this);
    }

    private getAnonymousIdentity(): string {
        const identification = this.game.window.gui.playerData.identification;
        let sum = 'disconnected';
        if (identification.accountId && identification.nickname) {
            const accountId = identification.accountId;
            const nicknameSum = identification.nickname
                .split('')
                .map((char) => {
                    return char.charCodeAt()
                })
                .reduce((accumulator, currentValue) => {
                    return accumulator + currentValue
                });
            // This sum ensures privacy
            sum = (accountId + nicknameSum).toString();
        }
        return sum;
    }

    private checkMaxZoom() {
        if (!this.backupMaxZoom) this.backupMaxZoom = this.game.window.isoEngine.mapScene.camera.maxZoom;
        this.game.window.isoEngine.mapScene.camera.maxZoom = Math.max(
            this.backupMaxZoom,
            this.backupMaxZoom + (this.game.window.isoEngine.mapScene.canvas.height / 800 - 1)
        );
    }

    // Connect the account to the last character connected
    private connectAccount() {
        setTimeout(() => {
            this.selected.emit(this.game);
            const credentials = this.game.credentials;
            delete (this.game.credentials);
            this.game.window.gui.loginScreen._connectMethod = "lastCharacter";
            this.game.window.gui.loginScreen._login(credentials.account_name, credentials.password, false);
        }, this.game.id * 1500 + 1000);
    }
}
