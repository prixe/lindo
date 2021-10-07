export interface SettingsInterface {
    language: string;
    buildVersion: string;
    appVersion: string;
    macAddress: string;
    alertCounter: number;
    last_news: number;
    appPreferences: any;
    option: {
        general: {
            hidden_shop: boolean;
            hidden_tabs: boolean;
            stay_connected: boolean;
            user_agent: string;
            resolution: {
                x: number;
                y: number;
            },
            local_content: boolean;
            sound_focus: boolean;
            early: boolean;
            audio_muted: boolean;
        },
        shortcuts: {
            no_emu: {
                new_tab: string;
                new_window: string;
                next_tab: string;
                prev_tab: string;
                activ_tab: string;
                tabs: Array<string>;
            }
            diver: {
                end_turn: string;
                open_chat: string;
                active_open_menu: boolean;
                open_menu: string;
                go_up: string;
                go_bottom: string;
                go_left: string;
                go_right: string;
            }
            spell: Array<string>;
            item: Array<string>;
            interface: {
                carac: string;
                spell: string;
                bag: string;
                bidhouse: string;
                map: string;
                friend: string;
                book: string;
                guild: string;
                conquest: string;
                job: string;
                alliance: string;
                mount: string;
                directory: string;
                alignement: string;
                bestiary: string;
                title: string;
                achievement: string;
                dailyQuest: string;
                spouse: string;
                shop: string;
                goultine: string;
            }
        },
        notification: {
            private_message: boolean;
            fight_turn: boolean;
            tax_collector: boolean;
            kolizeum: boolean;
            party_invitation: boolean;
            aggression: boolean;
            focus_fight_turn: boolean;
        },
        vip: {
            general: {
                disable_inactivity: boolean;
                health_bar: boolean;
                health_bar_shortcut: string;
                jobsxp: boolean;
                estimator: boolean;
                fightchronometer: boolean;
                hidden_mount: boolean;
                party_info_pp: boolean;
                party_info_lvl: boolean;
                zaapsearchfilter: boolean;
                harvest_indicator: boolean;
                show_resources: boolean;
                show_resources_shortcut: string;
                party_member_on_map: boolean;
                monster_tooltip: boolean;
                monster_tooltip_shortcut: string;
            },
            auto_group: {
                active: boolean;
                leader: string;
                members: string;
                follow_leader: boolean;
                follow_on_map: boolean;
                strict_move: boolean;
                ready: boolean;
                fight: boolean;
            },
            multi_account: {
                active: boolean;
                master_password: string;
                windows: { account_name_encrypted: string, password_encrypted: string }[][];
            }
        }
    }
}
