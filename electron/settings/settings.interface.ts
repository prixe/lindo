export interface SettingsInterface {
    language: string;
    buildVersion: string;
    appVersion: string;
    macAddress: string;
    alertCounter: number;
    vip_id: string;
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
        }
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
                goto_up_map: string;
                goto_bottom_map: string;
                goto_left_map: string;
                goto_right_map: string;
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
                almanax: string;
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
                estimator: boolean;
                hidden_mount: boolean;
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
