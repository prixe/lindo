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

import { AutoGroup } from "app/core/mods/auto-group/autogroup";
import { DamageEstimator } from "app/core/mods/damage-estimator/damageestimator";
import { Shortcuts } from "app/core/mods/shortcuts/shortcuts";
import { Inactivity } from "app/core/mods/general/inactivity";
import { HealthBar } from "app/core/mods/health-bar/healthbar";
import { Notifications } from "app/core/mods/notifications/notifications";
import { CssOverload } from "app/core/mods/cssOverload/cssOverload";
import { JsFixes } from "app/core/mods/jsFixes/jsFixes";
import { RapidExchange } from "app/core/mods/rapid-exchange/rapid-exchange";
import { HideShop } from "app/core/mods/hide-shop/hide-shop";
import { KeyboardInput } from "app/core/mods/keyboard-input/keyboard-input";
import { HttpClient } from '@angular/common/http';
import { HideMount } from "app/core/mods/hide-mount/hide-mount";
import { Mover } from "app/core/mods/mover/mover";


@Component({
    selector: 'component-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

    @Input() public game: Game;
    @Output() selected = new EventEmitter();
    private shortcuts: Shortcuts;
    public gamePath: string;
    private gameLoaded: boolean = false;
    private backupMaxZoom: number;

    // Mods
    private autogroup: AutoGroup;
    private inactivity: Inactivity;
    private healthbar: HealthBar;
    private damageEstimator: DamageEstimator;
    private notifications: Notifications;
    private cssOverload: CssOverload;
    private jsFixes: JsFixes;
    private rapidExchange: RapidExchange;
    private wizAssets: WizAssetsContainer;
    private plugins: PluginsContainer;
    private hideShop: HideShop;
    private keyboardInput: KeyboardInput;
    private hideMount: HideMount;
    private mover: Mover;

    constructor(
        private windowService: WindowService,
        private ipcRendererService: IpcRendererService,
        private zone: NgZone,
        private settingsService: SettingsService,
        private translate: TranslateService,
        private applicationService: ApplicationService,
        private http: HttpClient
    ) {
        if(isElectron)
            this.gamePath = this.applicationService.gamePath + '/index.html?delayed=true';
        else
            this.gamePath = "game/index.html?delayed=true";
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

        let vipStatus = 5;

        switch (vipStatus) {
            case 5:
            case 4:
            case 3:
                if (this.healthbar) this.healthbar.reset();
            case 2:
                if (this.autogroup) this.autogroup.reset();
                if (this.inactivity) this.inactivity.reset();
                if (this.damageEstimator) this.damageEstimator.reset();
            default:
                if (this.notifications) this.notifications.reset();
                if (this.shortcuts) this.shortcuts.reset();
                if (this.cssOverload) this.cssOverload.reset();
                if (this.jsFixes) this.jsFixes.reset();
                if (this.hideShop) this.hideShop.reset();
                if (this.keyboardInput) this.keyboardInput.reset();
                if (this.hideMount) this.hideMount.reset();
                if (this.mover) this.mover.reset();
        }
    }

    public reloadMods(start: boolean = true): void {
        this.removeMods();
        if (start)
            this.setMods();
    }

    public setMods(): void {

        let vipStatus = 5;

        switch (vipStatus) {
            case 5:
            case 4:
            case 3:
                this.healthbar = new HealthBar(this.game.window, this.settingsService.option.vip.general);
            case 2:
                this.autogroup = new AutoGroup(this.game.window, this.settingsService.option.vip.autogroup, this.ipcRendererService, this.translate);
                this.inactivity = new Inactivity(this.game.window, this.settingsService.option.vip.general.disable_inactivity);
                this.damageEstimator = new DamageEstimator(this.game.window, this.settingsService.option.vip.general);
            default:
                this.notifications = new Notifications(this.game.window, this.settingsService.option.notification, this.translate);
                this.notifications.eventEmitter.on('newNotification', () => {
                    this.zone.run(() => {
                        this.game.emit('notification');
                    });
                });
                this.notifications.eventEmitter.on('focusTab', () => {
                    this.zone.run(() => {
                        this.selected.emit(this.game);
                    });
                });
                this.shortcuts = new Shortcuts(this.game.window, this.settingsService.option.shortcuts);
                this.cssOverload = new CssOverload(this.game.window);
                this.jsFixes = new JsFixes(this.game.window);
                this.hideShop = new HideShop(this.game.window, this.settingsService.option.general.hidden_shop);
                this.hideMount = new HideMount(this.game.window, this.settingsService.option.vip.general.hidden_mount);
                this.rapidExchange = new RapidExchange(this.game.window);
                //this.wizAssets = new WizAssetsContainer(this.game.window, this.applicationService, this.http, this.settingsService.option.general);
                this.keyboardInput = new KeyboardInput(this.game.window);
                this.mover = new Mover(this.game.window);
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
