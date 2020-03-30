import { Component, Input, NgZone, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as async from 'async';
import { TranslateService } from "@ngx-translate/core";
import { WizAssetsContainer } from "./wizAssets/wizAssetsContainer";
import { WindowService } from "app/core/service/window.service";
import { SettingsService } from "app/core/service/settings.service";
import { ApplicationService } from "app/core/electron/application.service";
import { IpcRendererService } from "app/core/electron/ipcrenderer.service";
import { Game } from "app/core/classes/game";
import { PluginsContainer } from "./plugins/pluginsContainer";
import { Logger } from 'app/core/electron/logger.helper';
import { BugReportService } from 'app/core/service/bug-report.service';
import { HttpClient } from '@angular/common/http';

import * as Mods from "app/core/mods";
import { Mod } from "app/core/mods/mod";

@Component({
    selector: 'component-game',
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
        private applicationService: ApplicationService,
        private http: HttpClient
    ) {
        if (isElectron) {
            this.gamePath = this.applicationService.gamePath + '/index.html?delayed=true';
        } else {
            this.gamePath = "game/index.html?delayed=true";
        }
    }

    ngAfterViewInit() {
        // after View Init get the iFrame
        this.game.window = this.windowService.window['Frame' + this.game.id].contentWindow;
    }

    public gameReady(): void {
        if (this.gameLoaded) {
            this.game.window.initDofus(() => {
                /* Hide the game loading overlay */
                let loading = document.getElementById("LoadingGame_" + this.game.id);

                if (loading) {
                    loading.style.opacity = '0';
                    setTimeout(function () {
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
        for (let i in this.mods) {
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
        for (let mod in Mods) {
            switch (mod) {
                case 'AutoGroup':
                    Logger.info('Case autogroup');
                    let autogroup = new Mods[mod](this.game.window, this.settingsService, this.translateService, this.ipcRendererService);
                    this.mods.push(autogroup)
                    break;
                case 'Notifications':
                    Logger.info('Case Notifications');
                    let notifications = new Mods[mod](this.game.window, this.settingsService, this.translateService);
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
        //this.wizAssets = new WizAssetsContainer(this.game.window, this.applicationService, this.http, this.settingsService.option.general);
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

        let onCharacterSelectedSuccess = () => {
            // retrieve character name and update zone.js
            this.zone.run(() => {
                this.game.emit('character', this.game.window.gui.playerData.characterBaseInformations.name);
                this.game.emit('logged', true);

                /* create icon */
                let char = new this.game.window.CharacterDisplay({ scale: 'fitin' });
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

        let onDisconnect = () => {
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
                let anonymousIdentity = this.getAnonymousIdentity();
                let stack = error.stack.replace(/(\S+)(\/lindo\/)/g, '$2'); // Remove the full path to avoid sending OS account name

                this.bugReportService.writeLog(anonymousIdentity, stack);
            } catch (e) {
                Logger.error(e);
            }
        };

        let consoleError = this.game.window.console.error;
        this.game.window.console.error = function() {
            let anonymousIdentity = this.getAnonymousIdentity();
            let report = "";
            for (let i = 0 ; i < arguments.length ; i++) {
                report += JSON.stringify(arguments[i]) + "\n";
            }
            report = report.trim();
            this.bugReportService.writeLog(anonymousIdentity, report);
            return consoleError.apply(this.game.window.console, arguments)
        }.bind(this);
    }

    private getAnonymousIdentity(): string {
        let identification = this.game.window.gui.playerData.identification;
        let sum = 'disconnected';
        if (identification.accountId && identification.nickname) {
            let accountId = identification.accountId;
            let nicknameSum = identification.nickname
                                .split('')
                                .map((char) => { return char.charCodeAt() })
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
            let credentials = this.game.credentials;
            delete (this.game.credentials);
            this.game.window.gui.loginScreen._connectMethod = "lastCharacter";
            this.game.window.gui.loginScreen._login(credentials.account_name, credentials.password, false);
        }, this.game.id * 1500 + 1000);
    }
}
