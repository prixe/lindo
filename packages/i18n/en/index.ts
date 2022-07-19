import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
  main: {
    gameMenu: {
      file: {
        title: 'Application',
        newWindow: 'New window',
        newTab: 'New tab',
        closeTab: 'Close tab',
        closeWindow: 'Exit'
      },
      edit: {
        title: 'Edit',
        undo: 'Undo',
        redo: 'Redo',
        cut: 'Cut',
        copy: 'Copy',
        paste: 'Paste',
        selectAll: 'Select all'
      },
      window: {
        title: 'Window',
        reload: 'Reload',
        prevTab: 'Previous tab',
        nextTab: 'Next tab',
        sound: 'Sound',
        enableSound: 'Turn on sound',
        disableSound: 'Turn off sound',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        resetZoom: 'Reset zoom',
        fullScreen: 'Toggle Full screen'
      },
      infos: {
        title: '?',
        changelog: 'Release notes',
        console: 'Developer console',
        about: 'About us...'
      }
    },
    dialogs: {
      cacheCleared: {
        title: 'Cache cleared',
        message: 'Cache has been cleared on currently opened window'
      }
    }
  },
  notifications: {
    fightTurn: 'Starting turn for {characterName: string}',
    privateMessage: 'Incoming message from {senderName: string}',
    taxCollector: 'A tax collector is being attacked !',
    kolizeum: 'A Kolizeum has been found !',
    partyInvitation: "You are invited to join {senderName: string}'s group.",
    aggression: 'You have been aggressed !',
    saleMessage: 'Bank'
  },
  window: {
    main: {
      tabsOverflow: {
        text: "Lindo doesn't support more than 6 tab per window, above that it can be laggy and buggy. But you can open a new window and it will be working just fine."
      }
    },
    changelog: {
      title: 'Release notes',
      prefix: 'Release'
    },
    unlockScreen: {
      info: 'Enter your master password to connect your dofus touch accounts automatically',
      chooseTeamConnect: 'Choose a team to connect',
      connect: 'Connect',
      masterPassword: 'Master password',
      invalidPassword: 'Invalid password',
      unlock: 'Unlock',
      skip: 'Skip'
    },
    updateGame: {
      title: 'Lindo update',
      step0: 'Preparing update..',
      step1: 'Step 1 : Downloading Dofus files',
      step2: 'Step 2 : Lindo patch download',
      step3: 'Step 3 : Version resolution',
      step4: 'Step 4 : Applying the patches',
      step5: 'Step 5 : Writing modified files',
      step6: 'Step 6 : Delete old files',
      step7: 'Step 7 : Finalization',
      step8: 'Step 8 : Launch of Lindo..',
      information: {
        search: 'Looking for updates...',
        error: "Can't download the update ! Please try again later",
        retry: 'Try again'
      }
    },
    options: {
      title: 'Options',
      button: {
        reset: 'Reset Settings',
        close: 'Close'
      },
      dialogs: {
        resetSettings: {
          title: 'Reset all the settings ?',
          message: "All app's settings will be reset to their default value",
          confirm: 'Reset',
          cancel: 'Cancel'
        }
      }
    }
  },
  option: {
    general: {
      title: 'General',
      interface: 'Interface',
      sound: 'Sound',
      gameData: 'Game data',
      language: 'Language',
      resolution: 'Resolution',
      fullScreen: 'Full screen',
      hideTab: 'Hide the multi-account tab bar',
      localContent: 'Enable local map download (beta)',
      soundFocus: 'Game sound only on foreground window',
      early: 'Play on Dofus Touch Early',
      restart: 'Apply and restart',
      resetGame: 'Re-download game data',
      clearCache: 'Clear cache'
    },
    shortcuts: {
      title: 'Shortcuts',
      diver: {
        header: 'Miscellaneous',
        endTurn: 'End your turn / Ready (fight)',
        openChat: 'Open the chat',
        openMenu: 'Open the menu',
        goUp: 'Go to Upper Map',
        goDown: 'Go to Lower Map',
        goLeft: 'Go to Left Map',
        goRight: 'Go to Right Map'
      },
      interfaces: {
        header: 'Interfaces',
        carac: 'Character',
        spell: 'Spells',
        bag: 'Inventory',
        bidHouse: 'Market place',
        map: 'Map',
        friend: 'Friends',
        book: 'Quests',
        guild: 'Guild',
        conquest: 'Kolizeum',
        goultine: 'Shop',
        job: 'Jobs',
        alliance: 'Alliance',
        mount: 'Mount',
        directory: 'List of Guilds and Alliances',
        alignment: 'Alignment',
        bestiary: 'Bestiary',
        title: 'Titles and Ornaments',
        achievement: 'Achievements',
        dailyQuest: 'Daily Quests',
        spouse: 'Spouse',
        shop: 'Shopkeeper'
      },
      items: {
        header: 'Items',
        slot: 'Slot {x:number}'
      },
      application: {
        header: 'Application',
        newWindow: 'New window',
        newTab: 'New tab',
        tab: 'Tab {x:number}',
        nextTab: 'Next tab',
        prevTab: 'Previous tab'
      },
      spells: {
        header: 'Spells',
        slot: 'Slot {x:number}'
      },
      mods: {
        header: 'Mods',
        mapResources: 'Show/hide map resources',
        healthBar: 'Show/hide life bars',
        monsterTooltip: 'Show/hide monsters tooltip'
      },
      information:
        'You can use special keys CTRL, SHIFT, SPACE, ALT/CMD You can specify your shortcut by pressing the desired keys at the same time after selecting the input'
    },
    features: {
      title: 'Features',
      general: {
        header: 'General',
        hideShop: 'Hide the Shop button',
        activeOpenMenu: 'Open menu when no window is open (ESC)',
        disableInactivity: 'Extend the delay before disconnection for inactivity',
        zaapSearchFilter: 'Show zaap search filter'
      },
      fight: {
        header: 'Fight',
        healthBar: 'Activate the display of the life bars below the fighters',
        focusFightTurn: 'Automatically switch to an account when its turn starts',
        estimator: 'Estimating spell damage in battle',
        fightChronometer: 'Show combats chronometer',
        monsterTooltip: 'Display monsters groups information on the map',
        monsterTooltipShortcut: 'Shortcut for show/hide monsters tooltip',
        verticalTimeline: 'Show fighters timeline vertically',
        challengePercent: 'Show challenge XP/Drop bonus'
      },
      group: {
        header: 'Group',
        partyMemberOnMap: 'Add an indicator to know if the members of a group are on the same map',
        partyInfo: {
          level: "Show party's level",
          prospecting: "Show party's prospecting"
        },
        autoGroup: {
          header: 'Auto Group',
          active: 'Enable automatic grouping',
          warning:
            'Beware, following the group leader can be considered as boting for other players, use it with caution and in unpopulated areas.',
          warningTimer:
            'Beware, This feature can be considered as boting for other players, use it with caution and in unpopulated areas.',
          explanation1:
            'The characters in the group must be friends with the leader so that the invitation is automatic.',
          explanation2: 'The members follow the leader if the latter is on the same map.',
          leader: 'Name of leader',
          members: 'Names of characters',
          addMember: 'Add a character',
          followLeader: 'Follow the group leader',
          disableTimer: 'Disable the Timer for the auto group',
          ready: 'Skip "ready" automatically',
          fight: 'Enter combat automatically',
          delay: 'Time to follow (in seconds)',
          followOnMap: 'Follow the leader on a map',
          strictMove: 'Move on the same cell the leader moves',
          pvpWarning: "You can't join a PvP fight automatically"
        }
      },
      job: {
        header: 'Job',
        showResources: 'Show map resources',
        harvestIndicator: 'Activate the display of the remaining time below the resources',
        jobsXp: 'Activate the display of the job xp need for leveling'
      },
      accounts: {
        header: 'Accounts'
      }
    },
    notifications: {
      title: 'Notifications',
      description:
        'You can receive notifications from the game when the application is on the background. You will be notified:',
      fightTurn: 'When your turn starts (fight)',
      privateMessage: 'By incoming private messages',
      taxCollector: 'When a tax collector is attacked',
      kolizeum: 'When a kolizeum fight is found',
      partyInvitation: 'When someone invites you to join a group',
      aggression: 'When someone aggresses you',
      saleMessage: 'When an item is sold'
    },
    multiAccount: {
      title: 'Multi Account',
      enable: 'The multi account is enabled with your master password',
      notConfigured:
        'To use this feature, a password must be configured. It will be used to start Lindo with multi-account automation.',
      configurePassword: 'Configure password',
      addCharacter: 'Add Character',
      newTeam: 'New Team',
      removePassword: 'Remove the password',
      changePassword: 'Change the password',
      dialogs: {
        characterDialog: {
          title: 'Add new character account',
          confirm: 'Add',
          cancel: 'Cancel'
        },
        teamDialog: {
          title: 'Add new team',
          teamName: 'Team Name',
          addWindow: 'Add Window',
          confirm: 'Save',
          cancel: 'Cancel'
        },
        selectCharacter: {
          title: 'Select a character',
          cancel: 'Cancel'
        },
        passwordDialog: {
          configurePassword: 'Configure master password',
          changePassword: 'Change master password',
          removePassword: 'Remove your master password ?',
          removePasswordInfo: 'If you remove your master password you will lost your multi account configuration',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          oldPassword: 'Old Password',
          confirmRemovePassword: 'Remove password',
          validate: 'Validate',
          cancel: 'Cancel'
        }
      },
      characterCard: {
        characterImageNotLoaded: 'Character image will be save during the login',
        buttons: {
          select: 'Select',
          delete: 'Delete',
          edit: 'Edit',
          remove: 'Remove'
        }
      },
      teamWindowCard: {
        window: 'Window {position: number}',
        addCharacter: 'Add Character'
      },
      teamAccordion: {
        delete: 'Delete team',
        edit: 'Edit team',
        window: 'Window {position: number}'
      }
    },
    about: {
      title: 'About',
      links: {
        website: 'Website',
        changelog: 'Release notes'
      },
      text0: 'Lindo is an open-source software that allows you to play DOFUS Touch from your computer.',
      text1:
        'Unlike an Android emulator, the code is directly interpreted by your computer, which makes it faster so you can play DOFUS Touch with the full performance of your computer !',
      text2:
        'Originally known as DOFUS Touch No-Emu, this software developed by Daniel and Thomas was forced to close cause of an advertisement from Ankama.'
    }
  },
  // MODS Texts
  mod: {
    jobXP: {
      xpMissing: '{nextLevel: number} XP missing<br>before level {xp: number}'
    },
    monsterTooltip: {
      level: 'Level',
      group: 'Group'
    },
    partyInfo: {
      level: 'Lvl.'
    },
    runeLister: {
      message: 'Obtained {quantity: number} {runeName: string}'
    },
    zaapSearchFilter: {
      placeholder: 'Search a zaap',
      placeholderZaapi: 'Search a zaapi',
      placeholderPrisme: 'Search a prisme'
    }
  }
}

export default en
