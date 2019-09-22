import { Injectable } from '@angular/core';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { Logger } from 'app/core/electron/logger.helper';
import { SettingsProvider } from '../classes/settings.provider';
import { SettingsProviderIpc } from '../classes/settings.provider.ipc';
import { SettingsProviderLocal } from '../classes/settings.provider.local';
import { WindowService } from './window.service';
import { SettingsInterface } from '../../../../electron/settings/settings.interface';
import { SettingsDefault } from '../../../../electron/settings/settings-default';

export class Option {
    public general: Option.General;
    public shortcuts: Option.Shortcuts;
    public notification: Option.Notification;
    public vip: Option.VIP;

    constructor(private settingsProvider: SettingsProvider) {
        this.general = new Option.General(settingsProvider);
        this.shortcuts = new Option.Shortcuts(settingsProvider);
        this.notification = new Option.Notification(settingsProvider);
        this.vip = new Option.VIP(settingsProvider);
    }
}

export module Option {

    export class Shortcuts {
        public no_emu: Shortcuts.NoEmu;
        public diver: Shortcuts.Diver;
        public interface: Shortcuts.Interface;
        private _spell: Array<string>;
        private _item: Array<string>;

        constructor(private settingsProvider: SettingsProvider) {
            this.no_emu = new Shortcuts.NoEmu(settingsProvider);
            this.diver = new Shortcuts.Diver(settingsProvider);
            this.interface = new Shortcuts.Interface(settingsProvider);
            this._spell = this.settingsProvider.read('option.shortcuts.spell');
            this._item = this.settingsProvider.read('option.shortcuts.item');
        }


        get spell(): Array<string> {
            let self = this;
            return new Proxy(this._spell, {
                get: function (target: any, name: any) {
                    return target[name];
                },
                set(target: any, prop: string, value: any) {
                    target[prop] = value;
                    self.settingsProvider.write('option.shortcuts.spell', target);
                    return true;
                }
            });
        }

        set spell(spell: Array<string>) {
            this.settingsProvider.write('option.shortcuts.spell', spell);
            this._spell = spell;
        }

        get item(): Array<string> {
            let self = this;
            return new Proxy(this._item, {
                get: function (target, name) {
                    return target[name];
                },
                set(target, prop: string, value) {
                    target[prop] = value;
                    self.settingsProvider.write('option.shortcuts.item', target);
                    return true;
                }
            });
        }

        set item(item: Array<string>) {
            this.settingsProvider.write('option.shortcuts.item', item);
            this._item = item;
        }
    }

    export module Shortcuts {

        export class Interface {
            private _carac: string;
            private _spell: string;
            private _bag: string;
            private _bidhouse: string;
            private _map: string;
            private _friend: string;
            private _book: string;
            private _guild: string;
            private _conquest: string;
            private _job: string;
            private _alliance: string;
            private _mount: string;
            private _directory: string;
            private _alignement: string;
            private _bestiary: string;
            private _title: string;
            private _achievement: string;
            private _almanax: string;
            private _spouse: string;
            private _shop: string;
            private _goultine: string;

            get carac(): string {
                return this._carac;
            }

            set carac(carac: string) {
                this.settingsProvider.write('option.shortcuts.interface.carac', carac);
                this._carac = carac;
            }

            get spell(): string {
                return this._spell;
            }

            set spell(spell: string) {
                this.settingsProvider.write('option.shortcuts.interface.spell', spell);
                this._spell = spell;
            }

            get bag(): string {
                return this._bag;
            }

            set bag(bag: string) {
                this.settingsProvider.write('option.shortcuts.interface.bag', bag);
                this._bag = bag;
            }

            get bidhouse(): string {
                return this._bidhouse;
            }

            set bidhouse(bidhouse: string) {
                this.settingsProvider.write('option.shortcuts.interface.bidhouse', bidhouse);
                this._bidhouse = bidhouse;
            }

            get map(): string {
                return this._map;
            }

            set map(map: string) {
                this.settingsProvider.write('option.shortcuts.interface.map', map);
                this._map = map;
            }

            get friend(): string {
                return this._friend;
            }

            set friend(friend: string) {
                this.settingsProvider.write('option.shortcuts.interface.friend', friend);
                this._friend = friend;
            }

            get book(): string {
                return this._book;
            }

            set book(book: string) {
                this.settingsProvider.write('option.shortcuts.interface.book', book);
                this._book = book;
            }

            get guild(): string {
                return this._guild;
            }

            set guild(guild: string) {
                this.settingsProvider.write('option.shortcuts.interface.guild', guild);
                this._guild = guild;
            }

            get conquest(): string {
                return this._conquest;
            }

            set conquest(conquest: string) {
                this.settingsProvider.write('option.shortcuts.interface.conquest', conquest);
                this._conquest = conquest;
            }

            get job(): string {
                return this._job;
            }

            set job(job: string) {
                this.settingsProvider.write('option.shortcuts.interface.job', job);
                this._job = job;
            }

            get alliance(): string {
                return this._alliance;
            }

            set alliance(alliance: string) {
                this.settingsProvider.write('option.shortcuts.interface.alliance', alliance);
                this._alliance = alliance;
            }

            get mount(): string {
                return this._mount;
            }

            set mount(mount: string) {
                this.settingsProvider.write('option.shortcuts.interface.mount', mount);
                this._mount = mount;
            }

            get directory(): string {
                return this._directory;
            }

            set directory(directory: string) {
                this.settingsProvider.write('option.shortcuts.interface.directory', directory);
                this._directory = directory;
            }

            get alignement(): string {
                return this._alignement;
            }

            set alignement(alignement: string) {
                this.settingsProvider.write('option.shortcuts.interface.alignement', alignement);
                this._alignement = alignement;
            }

            get bestiary(): string {
                return this._bestiary;
            }

            set bestiary(bestiary: string) {
                this.settingsProvider.write('option.shortcuts.interface.bestiary', bestiary);
                this._bestiary = bestiary;
            }

            get title(): string {
                return this._title;
            }

            set title(title: string) {
                this.settingsProvider.write('option.shortcuts.interface.title', title);
                this._title = title;
            }

            get achievement(): string {
                return this._achievement;
            }

            set achievement(achievement: string) {
                this.settingsProvider.write('option.shortcuts.interface.achievement', achievement);
                this._achievement = achievement;
            }

            get almanax(): string {
                return this._almanax;
            }

            set almanax(almanax: string) {
                this.settingsProvider.write('option.shortcuts.interface.almanax', almanax);
                this._almanax = almanax;
            }

            get spouse(): string {
                return this._spouse;
            }

            set spouse(spouse: string) {
                this.settingsProvider.write('option.shortcuts.interface.spouse', spouse);
                this._spouse = spouse;
            }

            get shop(): string {
                return this._shop;
            }

            set shop(shop: string) {
                this.settingsProvider.write('option.shortcuts.interface.shop', shop);
                this._shop = shop;
            }

            get goultine(): string {
                return this._goultine;
            }

            set goultine(goultine: string) {
                this.settingsProvider.write('option.shortcuts.interface.goultine', goultine);
                this._goultine = goultine;
            }

            public getAll(): Array<any> {
                let tab: Array<any> = [];

                for (let prop in this) {
                    if (prop.charAt(0) === '_') {
                        let newProp = prop.replace('_', '');
                        tab.push({
                            key: newProp,
                            value: this[prop]
                        });
                    }
                }

                return tab;
            }

            constructor(private settingsProvider: SettingsProvider) {
                this._carac = this.settingsProvider.read('option.shortcuts.interface.carac');
                this._spell = this.settingsProvider.read('option.shortcuts.interface.spell');
                this._bag = this.settingsProvider.read('option.shortcuts.interface.bag');
                this._bidhouse = this.settingsProvider.read('option.shortcuts.interface.bidhouse');
                this._map = this.settingsProvider.read('option.shortcuts.interface.map');
                this._friend = this.settingsProvider.read('option.shortcuts.interface.friend');
                this._book = this.settingsProvider.read('option.shortcuts.interface.book');
                this._guild = this.settingsProvider.read('option.shortcuts.interface.guild');
                this._conquest = this.settingsProvider.read('option.shortcuts.interface.conquest');
                this._job = this.settingsProvider.read('option.shortcuts.interface.job');
                this._alliance = this.settingsProvider.read('option.shortcuts.interface.alliance');
                this._mount = this.settingsProvider.read('option.shortcuts.interface.mount');
                this._directory = this.settingsProvider.read('option.shortcuts.interface.directory');
                this._alignement = this.settingsProvider.read('option.shortcuts.interface.alignement');
                this._bestiary = this.settingsProvider.read('option.shortcuts.interface.bestiary');
                this._title = this.settingsProvider.read('option.shortcuts.interface.title');
                this._achievement = this.settingsProvider.read('option.shortcuts.interface.achievement');
                this._almanax = this.settingsProvider.read('option.shortcuts.interface.almanax');
                this._spouse = this.settingsProvider.read('option.shortcuts.interface.spouse');
                this._shop = this.settingsProvider.read('option.shortcuts.interface.shop');
                this._goultine = this.settingsProvider.read('option.shortcuts.interface.goultine');
            }
        }

        export class NoEmu {
            private _new_tab: string;
            private _new_window: string;
            private _next_tab: string;
            private _prev_tab: string;
            private _activ_tab: string;
            private _tabs: Array<string>;

            get new_tab(): string {
                return this._new_tab;
            }

            set new_tab(new_tab: string) {
                this.settingsProvider.write('option.shortcuts.no_emu.new_tab', new_tab);
                this._new_tab = new_tab;
            }

            get new_window(): string {
                return this._new_window;
            }

            set new_window(new_window: string) {
                this.settingsProvider.write('option.shortcuts.no_emu.new_window', new_window);
                this._new_window = new_window;
            }

            get next_tab(): string {
                return this._next_tab;
            }

            set next_tab(next_tab: string) {
                this.settingsProvider.write('option.shortcuts.no_emu.next_tab', next_tab);
                this._next_tab = next_tab;
            }

            get prev_tab(): string {
                return this._prev_tab;
            }

            set prev_tab(prev_tab: string) {
                this.settingsProvider.write('option.shortcuts.no_emu.prev_tab', prev_tab);
                this._prev_tab = prev_tab;
            }

            get activ_tab(): string {
                return this._activ_tab;
            }

            set activ_tab(activ_tab: string) {
                this.settingsProvider.write('option.shortcuts.no_emu.activ_tab', activ_tab);
                this._activ_tab = activ_tab;
            }

            get tabs(): Array<string> {
                let self = this;
                return new Proxy(this._tabs, {
                    get: function (target: any, name: any) {
                        return target[name];
                    },
                    set(target: any, prop: string, value: any) {
                        target[prop] = value;
                        self.settingsProvider.write('option.shortcuts.no_emu.tabs', target);
                        return true;
                    }
                });
            }

            set tabs(tabs: Array<string>) {
                this.settingsProvider.write('option.shortcuts.no_emu.tabs', tabs);
                this._tabs = tabs;
            }

            constructor(private settingsProvider: SettingsProvider) {
                this.new_tab = this.settingsProvider.read('option.shortcuts.no_emu.new_tab');
                this.new_window = this.settingsProvider.read('option.shortcuts.no_emu.new_window');
                this.next_tab = this.settingsProvider.read('option.shortcuts.no_emu.next_tab');
                this.prev_tab = this.settingsProvider.read('option.shortcuts.no_emu.prev_tab');
                this.activ_tab = this.settingsProvider.read('option.shortcuts.no_emu.activ_tab');
                this.tabs = this.settingsProvider.read('option.shortcuts.no_emu.tabs');
            }
        }

        export class Diver {
            private _end_turn: string;
            private _open_chat: string;
            private _goto_up_map: string;
            private _goto_bottom_map: string;
            private _goto_left_map: string;
            private _goto_right_map: string;

            get end_turn(): string {
                return this._end_turn;
            }

            set end_turn(end_turn: string) {
                this.settingsProvider.write('option.shortcuts.diver.end_turn', end_turn);
                this._end_turn = end_turn;
            }

            get open_chat(): string {
                return this._open_chat;
            }

            set open_chat(open_chat: string) {
                this.settingsProvider.write('option.shortcuts.diver.open_chat', open_chat);
                this._open_chat = open_chat;
            }

            get goto_up_map(): string {
                return this._goto_up_map;
            }

            set goto_up_map(goto_up_map: string) {
                this.settingsProvider.write('option.shortcuts.diver.goto_up_map', goto_up_map);
                this._goto_up_map = goto_up_map;
            }

            get goto_bottom_map(): string {
                return this._goto_bottom_map;
            }

            set goto_bottom_map(goto_bottom_map: string) {
                this.settingsProvider.write('option.shortcuts.diver.goto_bottom_map', goto_bottom_map);
                this._goto_bottom_map = goto_bottom_map;
            }

            get goto_left_map(): string {
                return this._goto_left_map;
            }

            set goto_left_map(goto_left_map: string) {
                this.settingsProvider.write('option.shortcuts.diver.goto_left_map', goto_left_map);
                this._goto_left_map = goto_left_map;
            }

            get goto_right_map(): string {
                return this._goto_right_map;
            }

            set goto_right_map(goto_right_map: string) {
                this.settingsProvider.write('option.shortcuts.diver.goto_right_map', goto_right_map);
                this._goto_right_map = goto_right_map;
            }

            constructor(private settingsProvider: SettingsProvider) {
                this.end_turn = this.settingsProvider.read('option.shortcuts.diver.end_turn');
                this.open_chat = this.settingsProvider.read('option.shortcuts.diver.open_chat');
                this.goto_up_map = this.settingsProvider.read('option.shortcuts.diver.goto_up_map');
                this.goto_bottom_map = this.settingsProvider.read('option.shortcuts.diver.goto_bottom_map');
                this.goto_left_map = this.settingsProvider.read('option.shortcuts.diver.goto_left_map');
                this.goto_right_map = this.settingsProvider.read('option.shortcuts.diver.goto_right_map');
            }
        }
    }

    export class General {

        private _hidden_shop: boolean;
        private _hidden_tabs: boolean;
        private _resolution: {
            x: boolean;
            y: boolean;
        };
        private _local_content: boolean;
        private _sound_focus: boolean;
        private _user_agent: string;

        get hidden_shop(): boolean {
            return this._hidden_shop;
        }

        set hidden_shop(hidden_shop: boolean) {
            this.settingsProvider.write('option.general.hidden_shop', hidden_shop);
            this._hidden_shop = hidden_shop;
        }

        get user_agent(): string {
            return this._user_agent;
        }

        set user_agent(user_agent: string) {
            this.settingsProvider.write('option.general.user_agent', user_agent);
            this._user_agent = user_agent;
        }

        get hidden_tabs(): boolean {
            return this._hidden_tabs;
        }

        set hidden_tabs(hidden_tabs: boolean) {
            this.settingsProvider.write('option.general.hidden_tabs', hidden_tabs);
            this._hidden_tabs = hidden_tabs;
        }

        get resolution() {
            return this._resolution;
        }

        set resolution(resolution: any) {
            this.settingsProvider.write('option.general.resolution', resolution);
            this._resolution = resolution;
        }

        get local_content() {
            return this._local_content;
        }

        set local_content(local_content: boolean) {
            this.settingsProvider.write('option.general.local_content', local_content);
            this._local_content = local_content;
        }

        get sound_focus() {
            return this._sound_focus;
        }

        set sound_focus(sound_focus: boolean) {
            this.settingsProvider.write('option.general.sound_focus', sound_focus);
            this._sound_focus = sound_focus;
        }

        constructor(private settingsProvider: SettingsProvider) {
            this.user_agent = this.settingsProvider.read('option.general.user_agent');
            this.hidden_shop = this.settingsProvider.read('option.general.hidden_shop');
            this.hidden_tabs = this.settingsProvider.read('option.general.hidden_tabs');
            this.resolution = this.settingsProvider.read('option.general.resolution');
            this.local_content = this.settingsProvider.read('option.general.local_content');
            this.sound_focus = this.settingsProvider.read('option.general.sound_focus');
        }
    }

    export class Notification {
        private _private_message: boolean;
        private _fight_turn: boolean;
        private _tax_collector: boolean;
        private _kolizeum: boolean;
        private _party_invitation: boolean;
        private _aggression: boolean;
        private _focus_fight_turn: boolean;

        get private_message() {
            return this._private_message;
        }

        set private_message(private_message: any) {
            this.settingsProvider.write('option.notification.private_message', private_message);
            this._private_message = private_message;
        }

        get fight_turn() {
            return this._fight_turn;
        }

        set fight_turn(fight_turn: any) {
            this.settingsProvider.write('option.notification.fight_turn', fight_turn);
            this._fight_turn = fight_turn;
        }

        get tax_collector() {
            return this._tax_collector;
        }

        set tax_collector(tax_collector: any) {
            this.settingsProvider.write('option.notification.tax_collector', tax_collector);
            this._tax_collector = tax_collector;
        }

        get kolizeum() {
            return this._kolizeum;
        }

        set kolizeum(kolizeum: any) {
            this.settingsProvider.write('option.notification.kolizeum', kolizeum);
            this._kolizeum = kolizeum;
        }

        get party_invitation() {
            return this._party_invitation;
        }

        set party_invitation(party_invitation: any) {
            this.settingsProvider.write('option.notification.party_invitation', party_invitation);
            this._party_invitation = party_invitation;
        }

        get aggression() {
            return this._aggression;
        }

        set aggression(aggression: any) {
            this.settingsProvider.write('option.notification.aggression', aggression);
            this._aggression = aggression;
        }

        get focus_fight_turn() {
            return this._focus_fight_turn;
        }

        set focus_fight_turn(focus_fight_turn: any) {
            this.settingsProvider.write('option.notification.focus_fight_turn', focus_fight_turn);
            this._focus_fight_turn = focus_fight_turn;
        }

        constructor(private settingsProvider: SettingsProvider) {
            this.fight_turn = this.settingsProvider.read('option.notification.fight_turn');
            this.private_message = this.settingsProvider.read('option.notification.private_message');
            this.tax_collector = this.settingsProvider.read('option.notification.tax_collector');
            this.kolizeum = this.settingsProvider.read('option.notification.kolizeum');
            this.party_invitation = this.settingsProvider.read('option.notification.party_invitation');
            this.aggression = this.settingsProvider.read('option.notification.aggression');
            this.focus_fight_turn = this.settingsProvider.read('option.notification.focus_fight_turn');
        }
    }

    export class VIP {
        public general: VIP.General;
        public autogroup: VIP.AutoGroup;
        public multiaccount: VIP.MultiAccount;

        constructor(private settingsProvider: SettingsProvider) {
            this.general = new VIP.General(settingsProvider);
            this.autogroup = new VIP.AutoGroup(settingsProvider);
            this.multiaccount = new VIP.MultiAccount(settingsProvider);
        }
    }

    export module VIP {
        export class General {
            private _disable_inactivity: boolean;
            private _health_bar: boolean;
            private _health_bar_shortcut: string;
            private _estimator: boolean;
            private _hidden_mount: boolean;

            get hidden_mount(): boolean {
                return this._hidden_mount;
            }

            set hidden_mount(hidden_mount: boolean) {
                this.settingsProvider.write('option.vip.general.hidden_mount', hidden_mount);
                this._hidden_mount = hidden_mount;
            }

            get estimator(): boolean {
                return this._estimator;
            }

            set estimator(estimator: boolean) {
                this.settingsProvider.write('option.vip.general.estimator', estimator);
                this._estimator = estimator;
            }

            get disable_inactivity(): boolean {
                return this._disable_inactivity;
            }

            set disable_inactivity(disable_inactivity: boolean) {
                this.settingsProvider.write('option.vip.general.disable_inactivity', disable_inactivity);
                this._disable_inactivity = disable_inactivity;
            }

            get health_bar(): boolean {
                return this._health_bar;
            }

            set health_bar(health_bar: boolean) {
                this.settingsProvider.write('option.vip.general.health_bar', health_bar);
                this._health_bar = health_bar;
            }

            get health_bar_shortcut(): string {
                return this._health_bar_shortcut;
            }

            set health_bar_shortcut(health_bar_shortcut: string) {
                this.settingsProvider.write('option.vip.general.health_bar_shortcut', health_bar_shortcut);
                this._health_bar_shortcut = health_bar_shortcut;
            }

            constructor(private settingsProvider: SettingsProvider) {
                this.disable_inactivity = this.settingsProvider.read('option.vip.general.disable_inactivity');
                this.health_bar = this.settingsProvider.read('option.vip.general.health_bar');
                this.health_bar_shortcut = this.settingsProvider.read('option.vip.general.health_bar_shortcut');
                this.estimator = this.settingsProvider.read('option.vip.general.estimator');
                this.hidden_mount = this.settingsProvider.read('option.vip.general.hidden_mount');
            }
        }

        export class AutoGroup {
            private _active: boolean;
            private _leader: string;
            private _members: string;
            private _follow_leader: boolean;
            private _ready: boolean;
            private _fight: boolean;
            private _follow_on_map: boolean;
            private _strict_move: boolean;

            get active(): boolean {
                return this._active;
            }

            set active(active: boolean) {
                this.settingsProvider.write('option.vip.auto_group.active', active);
                this._active = active;
            }

            get leader(): string {
                return this._leader;
            }

            set leader(leader: string) {
                this.settingsProvider.write('option.vip.auto_group.leader', leader);
                this._leader = leader;
            }

            get members(): string {
                return this._members;
            }

            set members(members: string) {
                this.settingsProvider.write('option.vip.auto_group.members', members);
                this._members = members;
            }

            get follow_leader(): boolean {
                return this._follow_leader;
            }

            set follow_leader(follow_leader: boolean) {
                this.settingsProvider.write('option.vip.auto_group.follow_leader', follow_leader);
                this._follow_leader = follow_leader;
            }

            get ready(): boolean {
                return this._ready;
            }

            set ready(ready: boolean) {
                this.settingsProvider.write('option.vip.auto_group.ready', ready);
                this._ready = ready;
            }

            get fight(): boolean {
                return this._fight;
            }

            set fight(fight: boolean) {
                this.settingsProvider.write('option.vip.auto_group.fight', fight);
                this._fight = fight;
            }

            get follow_on_map(): boolean {
                return this._follow_on_map;
            }

            set follow_on_map(follow_on_map: boolean) {
                this.settingsProvider.write('option.vip.auto_group.follow_on_map', follow_on_map);
                this._follow_on_map = follow_on_map;
            }

            get strict_move(): boolean {
                return this._strict_move;
            }

            set strict_move(strict_move: boolean) {
                this.settingsProvider.write('option.vip.auto_group.strict_move', strict_move);
                this._strict_move = strict_move;
            }

            constructor(private settingsProvider: SettingsProvider) {
                this.active = this.settingsProvider.read('option.vip.auto_group.active');
                this.leader = this.settingsProvider.read('option.vip.auto_group.leader');
                this.members = this.settingsProvider.read('option.vip.auto_group.members');
                this.follow_leader = this.settingsProvider.read('option.vip.auto_group.follow_leader');
                this.leader = this.settingsProvider.read('option.vip.auto_group.leader');
                this.ready = this.settingsProvider.read('option.vip.auto_group.ready');
                this.fight = this.settingsProvider.read('option.vip.auto_group.fight');
                this.follow_on_map = this.settingsProvider.read('option.vip.auto_group.follow_on_map');
                this.strict_move = this.settingsProvider.read('option.vip.auto_group.strict_move');
            }
        }

        export class MultiAccount {
            private _active: boolean;
            private _master_password: string;
            private _windows: { account_name_encrypted: string, password_encrypted: string }[][];

            get active(): boolean {
                return this._active;
            }

            set active(active: boolean) {
                this.settingsProvider.write('option.vip.multi_account.active', active);
                this._active = active;
            }

            get master_password(): string {
                return this._master_password;
            }

            set master_password(active: string) {
                this.settingsProvider.write('option.vip.multi_account.master_password', active);
                this._master_password = active;
            }

            get windows(): { account_name_encrypted: string, password_encrypted: string }[][] {
                return this._windows;
            }

            set windows(windows: { account_name_encrypted: string, password_encrypted: string }[][]) {
                this.settingsProvider.write('option.vip.multi_account.windows', windows);
                this._windows = windows;
            }

            constructor(private settingsProvider: SettingsProvider) {
                this.active = this.settingsProvider.read('option.vip.multi_account.active');
                this.master_password = this.settingsProvider.read('option.vip.multi_account.master_password');
                this.windows = this.settingsProvider.read('option.vip.multi_account.windows');
            }
        }
    }
}


@Injectable()
export class SettingsService {

    public option: Option;
    private settingsProvider: SettingsProvider;

    private _buildVersion: string;
    private _appVersion: string;
    private _macAddress: string;
    private _alertCounter: number;
    private _language: string;
    private _vip_id: string;
    private _last_news: number;

    get last_news(): number {
        return this._last_news;
    }

    set last_news(last_news: number) {
        this.settingsProvider.write('last_news', last_news);
        this._last_news = last_news;
    }

    get vip_id(): string {
        return this._vip_id;
    }

    set vip_id(vip_id: string) {
        this.settingsProvider.write('vip_id', vip_id);
        this._vip_id = vip_id;
    }

    get alertCounter(): number {
        return this._alertCounter;
    }

    set alertCounter(alertCounter: number) {
        this.settingsProvider.write('alertCounter', alertCounter);
        this._alertCounter = alertCounter;
    }

    get buildVersion(): string {
        return this._buildVersion;
    }

    set buildVersion(buildVersion: string) {
        this.settingsProvider.write('buildVersion', buildVersion);
        this._buildVersion = buildVersion;
    }

    get appVersion(): string {
        return this._appVersion;
    }

    set appVersion(appVersion: string) {
        this.settingsProvider.write('appVersion', appVersion);
        this._appVersion = appVersion;
    }

    get macAddress(): string {
        return this._macAddress;
    }

    set macAddress(macAddress: string) {
        this.settingsProvider.write('macAddress', macAddress);
        this._macAddress = macAddress;
    }

    get language(): string {
        return this._language;
    }

    set language(language: string) {
        this.settingsProvider.write('language', language);
        this._language = language;
    }

    constructor(
        private ipcRendererService: IpcRendererService,
        private windowService: WindowService
    ) {

        if (isElectron) {
            this.settingsProvider = new SettingsProviderIpc(ipcRendererService);
        } else {
            this.settingsProvider = new SettingsProviderLocal(windowService);
        }

        let init = () => {
            this.option = new Option(this.settingsProvider);

            this._appVersion = this.settingsProvider.read('appVersion');
            this._macAddress = this.settingsProvider.read('macAddress');
            this._buildVersion = this.settingsProvider.read('buildVersion');
            this._alertCounter = this.settingsProvider.read('alertCounter');
            this._language = this.settingsProvider.read('language');
            this._vip_id = this.settingsProvider.read('vip_id');
            this._last_news = this.settingsProvider.read('last_news');
        };
        init();

        if (isElectron) {
            this.ipcRendererService.on('reload-settings', () => {
                Logger.verbose('receive->reload-settings');
                init();
                Logger.verbose('emit->reload-settings-done');
                this.ipcRendererService.send('reload-settings-done');
            });
        }
    }
}
