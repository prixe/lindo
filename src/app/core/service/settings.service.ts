import { Injectable } from '@angular/core';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { Logger } from "app/core/electron/logger.helper";

export class Option {
    public general: Option.General;
    public shortcuts: Option.Shortcuts;
    public notification: Option.Notification;
    public vip: Option.VIP;

    constructor(
        private ipcRendererService: IpcRendererService
    ) {
        this.general = new Option.General(ipcRendererService);
        this.shortcuts = new Option.Shortcuts(ipcRendererService);
        this.notification = new Option.Notification(ipcRendererService);
        this.vip = new Option.VIP(ipcRendererService);
    }
}

export module Option {

    export class Shortcuts {
        public no_emu: Shortcuts.NoEmu;
        public diver: Shortcuts.Diver;
        public interface: Shortcuts.Interface;
        private _spell: Array<string>;
        private _item: Array<string>;

        constructor(private ipcRendererService: IpcRendererService) {
            this.no_emu = new Shortcuts.NoEmu(ipcRendererService);
            this.diver = new Shortcuts.Diver(ipcRendererService);
            this.interface = new Shortcuts.Interface(ipcRendererService);
            this._spell = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.spell');
            this._item = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.item');
        }


        get spell(): Array<string> {
            let self = this;
            return new Proxy(this._spell, {
                get: function (target: any, name: any) {
                    return target[name];
                },
                set(target: any, prop: string, value: any) {
                    target[prop] = value;
                    self.ipcRendererService.send('write-settings', 'option.shortcuts.spell', target);
                    return true;
                }
            });
        }

        set spell(spell: Array<string>) {
            this.ipcRendererService.send('write-settings', 'option.shortcuts.spell', spell);
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
                    self.ipcRendererService.send('write-settings', 'option.shortcuts.item', target);
                    return true;
                }
            });
        }

        set item(item: Array<string>) {
            this.ipcRendererService.send('write-settings', 'option.shortcuts.item', item);
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
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.carac', carac);
                this._carac = carac;
            }

            get spell(): string {
                return this._spell;
            }

            set spell(spell: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.spell', spell);
                this._spell = spell;
            }

            get bag(): string {
                return this._bag;
            }

            set bag(bag: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.bag', bag);
                this._bag = bag;
            }

            get bidhouse(): string {
                return this._bidhouse;
            }

            set bidhouse(bidhouse: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.bidhouse', bidhouse);
                this._bidhouse = bidhouse;
            }

            get map(): string {
                return this._map;
            }

            set map(map: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.map', map);
                this._map = map;
            }

            get friend(): string {
                return this._friend;
            }

            set friend(friend: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.friend', friend);
                this._friend = friend;
            }

            get book(): string {
                return this._book;
            }

            set book(book: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.book', book);
                this._book = book;
            }

            get guild(): string {
                return this._guild;
            }

            set guild(guild: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.guild', guild);
                this._guild = guild;
            }

            get conquest(): string {
                return this._conquest;
            }

            set conquest(conquest: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.conquest', conquest);
                this._conquest = conquest;
            }

            get job(): string {
                return this._job;
            }

            set job(job: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.job', job);
                this._job = job;
            }

            get alliance(): string {
                return this._alliance;
            }

            set alliance(alliance: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.alliance', alliance);
                this._alliance = alliance;
            }

            get mount(): string {
                return this._mount;
            }

            set mount(mount: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.mount', mount);
                this._mount = mount;
            }

            get directory(): string {
                return this._directory;
            }

            set directory(directory: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.directory', directory);
                this._directory = directory;
            }

            get alignement(): string {
                return this._alignement;
            }

            set alignement(alignement: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.alignement', alignement);
                this._alignement = alignement;
            }

            get bestiary(): string {
                return this._bestiary;
            }

            set bestiary(bestiary: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.bestiary', bestiary);
                this._bestiary = bestiary;
            }

            get title(): string {
                return this._title;
            }

            set title(title: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.title', title);
                this._title = title;
            }

            get achievement(): string {
                return this._achievement;
            }

            set achievement(achievement: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.achievement', achievement);
                this._achievement = achievement;
            }

            get almanax(): string {
                return this._almanax;
            }

            set almanax(almanax: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.almanax', almanax);
                this._almanax = almanax;
            }

            get spouse(): string {
                return this._spouse;
            }

            set spouse(spouse: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.spouse', spouse);
                this._spouse = spouse;
            }

            get shop(): string {
                return this._shop;
            }

            set shop(shop: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.shop', shop);
                this._shop = shop;
            }

            get goultine(): string {
                return this._goultine;
            }

            set goultine(goultine: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.interface.goultine', goultine);
                this._goultine = goultine;
            }

            public getAll(): Array<any> {
                let tab: Array<any> = [];

                for (let prop in this) {
                    if(prop.charAt(0) === '_'){
                        let newProp = prop.replace('_', '');
                        tab.push({
                            key: newProp,
                            value: this[prop]
                        });
                    }
                }

                return tab;
            }

            constructor(private ipcRendererService: IpcRendererService) {
                this._carac = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.carac');
                this._spell = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.spell');
                this._bag = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.bag');
                this._bidhouse = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.bidhouse');
                this._map = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.map');
                this._friend = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.friend');
                this._book = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.book');
                this._guild = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.guild');
                this._conquest = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.conquest');
                this._job = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.job');
                this._alliance = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.alliance');
                this._mount = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.mount');
                this._directory = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.directory');
                this._alignement = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.alignement');
                this._bestiary = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.bestiary');
                this._title = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.title');
                this._achievement = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.achievement');
                this._almanax = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.almanax');
                this._spouse = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.spouse');
                this._shop = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.shop');
                this._goultine = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.interface.goultine');
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
                this.ipcRendererService.send('write-settings', 'option.shortcuts.no_emu.new_tab', new_tab);
                this._new_tab = new_tab;
            }

            get new_window(): string {
                return this._new_window;
            }

            set new_window(new_window: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.no_emu.new_window', new_window);
                this._new_window = new_window;
            }

            get next_tab(): string {
                return this._next_tab;
            }

            set next_tab(next_tab: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.no_emu.next_tab', next_tab);
                this._next_tab = next_tab;
            }

            get prev_tab(): string {
                return this._prev_tab;
            }

            set prev_tab(prev_tab: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.no_emu.prev_tab', prev_tab);
                this._prev_tab = prev_tab;
            }

            get activ_tab(): string {
                return this._activ_tab;
            }

            set activ_tab(activ_tab: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.no_emu.activ_tab', activ_tab);
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
                        self.ipcRendererService.send('write-settings', 'option.shortcuts.no_emu.tabs', target);
                        return true;
                    }
                });
            }

            set tabs(tabs: Array<string>) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.no_emu.tabs', tabs);
                this._tabs = tabs;
            }

            constructor(private ipcRendererService: IpcRendererService) {
                this.new_tab = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.no_emu.new_tab');
                this.new_window = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.no_emu.new_window');
                this.next_tab = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.no_emu.next_tab');
                this.prev_tab = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.no_emu.prev_tab');
                this.activ_tab = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.no_emu.activ_tab');
                this.tabs = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.no_emu.tabs');
            }
        }

        export class Diver {
            private _end_turn: string;
            private _open_chat: string;

            get end_turn(): string {
                return this._end_turn;
            }

            set end_turn(end_turn: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.diver.end_turn', end_turn);
                this._end_turn = end_turn;
            }

            get open_chat(): string {
                return this._open_chat;
            }

            set open_chat(open_chat: string) {
                this.ipcRendererService.send('write-settings', 'option.shortcuts.diver.open_chat', open_chat);
                this._open_chat = open_chat;
            }

            constructor(private ipcRendererService: IpcRendererService) {
                this.end_turn = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.diver.end_turn');
                this.open_chat = this.ipcRendererService.sendSync('read-settings', 'option.shortcuts.diver.open_chat');
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
            this.ipcRendererService.send('write-settings', 'option.general.hidden_shop', hidden_shop);
            this._hidden_shop = hidden_shop;
        }

        get user_agent(): string {
            return this._user_agent;
        }

        set user_agent(user_agent: string) {
            this.ipcRendererService.send('write-settings', 'option.general.user_agent', user_agent);
            this._user_agent = user_agent;
        }

        get hidden_tabs(): boolean {
            return this._hidden_tabs;
        }

        set hidden_tabs(hidden_tabs: boolean) {
            this.ipcRendererService.send('write-settings', 'option.general.hidden_tabs', hidden_tabs);
            this._hidden_tabs = hidden_tabs;
        }

        get resolution() {
            return this._resolution;
        }

        set resolution(resolution: any) {
            this.ipcRendererService.send('write-settings', 'option.general.resolution', resolution);
            this._resolution = resolution;
        }

        get local_content() {
            return this._local_content;
        }

        set local_content(local_content: boolean) {
            this.ipcRendererService.send('write-settings', 'option.general.local_content', local_content);
            this._local_content = local_content;
        }

        get sound_focus() {
            return this._sound_focus;
        }

        set sound_focus(sound_focus: boolean) {
            this.ipcRendererService.send('write-settings', 'option.general.sound_focus', sound_focus);
            this._sound_focus = sound_focus;
        }

        constructor(private ipcRendererService: IpcRendererService) {
            this.user_agent = this.ipcRendererService.sendSync('read-settings', 'option.general.user_agent');
            this.hidden_shop = this.ipcRendererService.sendSync('read-settings', 'option.general.hidden_shop');
            this.hidden_tabs = this.ipcRendererService.sendSync('read-settings', 'option.general.hidden_tabs');
            this.resolution = this.ipcRendererService.sendSync('read-settings', 'option.general.resolution');
            this.local_content = this.ipcRendererService.sendSync('read-settings', 'option.general.local_content');
            this.sound_focus = this.ipcRendererService.sendSync('read-settings', 'option.general.sound_focus');
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
            this.ipcRendererService.send('write-settings', 'option.notification.private_message', private_message);
            this._private_message = private_message;
        }

        get fight_turn() {
            return this._fight_turn;
        }

        set fight_turn(fight_turn: any) {
            this.ipcRendererService.send('write-settings', 'option.notification.fight_turn', fight_turn);
            this._fight_turn = fight_turn;
        }

        get tax_collector() {
            return this._tax_collector;
        }

        set tax_collector(tax_collector: any) {
            this.ipcRendererService.send('write-settings', 'option.notification.tax_collector', tax_collector);
            this._tax_collector = tax_collector;
        }

        get kolizeum() {
            return this._kolizeum;
        }

        set kolizeum(kolizeum: any) {
            this.ipcRendererService.send('write-settings', 'option.notification.kolizeum', kolizeum);
            this._kolizeum = kolizeum;
        }

        get party_invitation() {
            return this._party_invitation;
        }

        set party_invitation(party_invitation: any) {
            this.ipcRendererService.send('write-settings', 'option.notification.party_invitation', party_invitation);
            this._party_invitation = party_invitation;
        }

        get aggression() {
            return this._aggression;
        }

        set aggression(aggression: any) {
            this.ipcRendererService.send('write-settings', 'option.notification.aggression', aggression);
            this._aggression = aggression;
        }

        get focus_fight_turn() {
            return this._focus_fight_turn;
        }

        set focus_fight_turn(focus_fight_turn: any) {
            this.ipcRendererService.send('write-settings', 'option.notification.focus_fight_turn', focus_fight_turn);
            this._focus_fight_turn = focus_fight_turn;
        }

        constructor(private ipcRendererService: IpcRendererService) {
            this.fight_turn = this.ipcRendererService.sendSync('read-settings', 'option.notification.fight_turn');
            this.private_message = this.ipcRendererService.sendSync('read-settings', 'option.notification.private_message');
            this.tax_collector = this.ipcRendererService.sendSync('read-settings', 'option.notification.tax_collector');
            this.kolizeum = this.ipcRendererService.sendSync('read-settings', 'option.notification.kolizeum');
            this.party_invitation = this.ipcRendererService.sendSync('read-settings', 'option.notification.party_invitation');
            this.aggression = this.ipcRendererService.sendSync('read-settings', 'option.notification.aggression');
            this.focus_fight_turn = this.ipcRendererService.sendSync('read-settings', 'option.notification.focus_fight_turn');
        }
    }

    export class VIP {
        public general: VIP.General;
        public autogroup: VIP.AutoGroup;
        public multiaccount: VIP.MultiAccount;

        constructor(private ipcRendererService: IpcRendererService) {
            this.general = new VIP.General(ipcRendererService);
            this.autogroup = new VIP.AutoGroup(ipcRendererService);
            this.multiaccount = new VIP.MultiAccount(ipcRendererService);
        }
    }

    export module VIP {
        export class General {
            private _disable_inactivity: boolean;
            private _health_bar: boolean;
            private _health_bar_shortcut: string;
            private _estimator: boolean;

            get estimator(): boolean {
                return this._estimator;
            }

            set estimator(estimator: boolean) {
                this.ipcRendererService.send('write-settings', 'option.vip.general.estimator', estimator);
                this._estimator = estimator;
            }

            get disable_inactivity(): boolean {
                return this._disable_inactivity;
            }

            set disable_inactivity(disable_inactivity: boolean) {
                this.ipcRendererService.send('write-settings', 'option.vip.general.disable_inactivity', disable_inactivity);
                this._disable_inactivity = disable_inactivity;
            }

            get health_bar(): boolean {
                return this._health_bar;
            }

            set health_bar(health_bar: boolean) {
                this.ipcRendererService.send('write-settings', 'option.vip.general.health_bar', health_bar);
                this._health_bar = health_bar;
            }

            get health_bar_shortcut(): string {
                return this._health_bar_shortcut;
            }

            set health_bar_shortcut(health_bar_shortcut: string) {
                this.ipcRendererService.send('write-settings', 'option.vip.general.health_bar_shortcut', health_bar_shortcut);
                this._health_bar_shortcut = health_bar_shortcut;
            }

            constructor(private ipcRendererService: IpcRendererService) {
                this.disable_inactivity = this.ipcRendererService.sendSync('read-settings', 'option.vip.general.disable_inactivity');
                this.health_bar = this.ipcRendererService.sendSync('read-settings', 'option.vip.general.health_bar');
                this.health_bar_shortcut = this.ipcRendererService.sendSync('read-settings', 'option.vip.general.health_bar_shortcut');
                this.estimator = this.ipcRendererService.sendSync('read-settings', 'option.vip.general.estimator');
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
                this.ipcRendererService.send('write-settings', 'option.vip.auto_group.active', active);
                this._active = active;
            }

            get leader(): string {
                return this._leader;
            }

            set leader(leader: string) {
                this.ipcRendererService.send('write-settings', 'option.vip.auto_group.leader', leader);
                this._leader = leader;
            }

            get members(): string {
                return this._members;
            }

            set members(members: string) {
                this.ipcRendererService.send('write-settings', 'option.vip.auto_group.members', members);
                this._members = members;
            }

            get follow_leader(): boolean {
                return this._follow_leader;
            }

            set follow_leader(follow_leader: boolean) {
                this.ipcRendererService.send('write-settings', 'option.vip.auto_group.follow_leader', follow_leader);
                this._follow_leader = follow_leader;
            }

            get ready(): boolean {
                return this._ready;
            }

            set ready(ready: boolean) {
                this.ipcRendererService.send('write-settings', 'option.vip.auto_group.ready', ready);
                this._ready = ready;
            }

            get fight(): boolean {
                return this._fight;
            }

            set fight(fight: boolean) {
                this.ipcRendererService.send('write-settings', 'option.vip.auto_group.fight', fight);
                this._fight = fight;
            }

            get follow_on_map(): boolean {
                return this._follow_on_map;
            }

            set follow_on_map(follow_on_map: boolean) {
                this.ipcRendererService.send('write-settings', 'option.vip.auto_group.follow_on_map', follow_on_map);
                this._follow_on_map = follow_on_map;
            }

            get strict_move(): boolean {
                return this._strict_move;
            }

            set strict_move(strict_move: boolean) {
                this.ipcRendererService.send('write-settings', 'option.vip.auto_group.strict_move', strict_move);
                this._strict_move = strict_move;
            }

            constructor(private ipcRendererService: IpcRendererService) {
                this.active = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.active');
                this.leader = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.leader');
                this.members = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.members');
                this.follow_leader = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.follow_leader');
                this.leader = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.leader');
                this.ready = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.ready');
                this.fight = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.fight');
                this.follow_on_map = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.follow_on_map');
                this.strict_move = this.ipcRendererService.sendSync('read-settings', 'option.vip.auto_group.strict_move');
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
                this.ipcRendererService.send('write-settings', 'option.vip.multi_account.active', active);
                this._active = active;
            }

            get master_password(): string {
                return this._master_password;
            }

            set master_password(active: string) {
                this.ipcRendererService.send('write-settings', 'option.vip.multi_account.master_password', active);
                this._master_password = active;
            }

            get windows(): { account_name_encrypted: string, password_encrypted: string }[][] {
                return this._windows;
            }

            set windows(windows: { account_name_encrypted: string, password_encrypted: string }[][]) {
                this.ipcRendererService.send('write-settings', 'option.vip.multi_account.windows', windows);
                this._windows = windows;
            }

            constructor(private ipcRendererService: IpcRendererService) {
                this.active = this.ipcRendererService.sendSync('read-settings', 'option.vip.multi_account.active');
                this.master_password = this.ipcRendererService.sendSync('read-settings', 'option.vip.multi_account.master_password');
                this.windows = this.ipcRendererService.sendSync('read-settings', 'option.vip.multi_account.windows');
            }
        }
    }
}


@Injectable()
export class SettingsService {

    public option: Option;

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
        this.ipcRendererService.send('write-settings', 'last_news', last_news);
        this._last_news = last_news;
    }

    get vip_id(): string {
        return this._vip_id;
    }

    set vip_id(vip_id: string) {
        this.ipcRendererService.send('write-settings', 'vip_id', vip_id);
        this._vip_id = vip_id;
    }

    get alertCounter(): number {
        return this._alertCounter;
    }

    set alertCounter(alertCounter: number) {
        this.ipcRendererService.send('write-settings', 'alertCounter', alertCounter);
        this._alertCounter = alertCounter;
    }

    get buildVersion(): string {
        return this._buildVersion;
    }

    set buildVersion(buildVersion: string) {
        this.ipcRendererService.send('write-settings', 'buildVersion', buildVersion);
        this._buildVersion = buildVersion;
    }

    get appVersion(): string {
        return this._appVersion;
    }

    set appVersion(appVersion: string) {
        this.ipcRendererService.send('write-settings', 'appVersion', appVersion);
        this._appVersion = appVersion;
    }

    get macAddress(): string {
        return this._macAddress;
    }

    set macAddress(macAddress: string) {
        this.ipcRendererService.send('write-settings', 'macAddress', macAddress);
        this._macAddress = macAddress;
    }

    get language(): string {
        return this._language;
    }

    set language(language: string) {
        this.ipcRendererService.send('write-settings', 'language', language);
        this._language = language;
    }

    constructor(
        private ipcRendererService: IpcRendererService
    ) {

        let init = () => {
            this.option = new Option(ipcRendererService);

            this._appVersion = this.ipcRendererService.sendSync('read-settings', 'appVersion');
            this._macAddress = this.ipcRendererService.sendSync('read-settings', 'macAddress');
            this._buildVersion = this.ipcRendererService.sendSync('read-settings', 'buildVersion');
            this._alertCounter = this.ipcRendererService.sendSync('read-settings', 'alertCounter');
            this._language = this.ipcRendererService.sendSync('read-settings', 'language');
            this._vip_id = this.ipcRendererService.sendSync('read-settings', 'vip_id');
            this._last_news = this.ipcRendererService.sendSync('read-settings', 'last_news');
        };
        init();

        this.ipcRendererService.on('reload-settings', () => {
            Logger.verbose('receive->reload-settings');
            init();
            Logger.verbose('emit->reload-settings-done');
            this.ipcRendererService.send('reload-settings-done');
        });
    }
}
