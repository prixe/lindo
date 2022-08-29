import { Translation } from '../i18n-types'

const fr: Translation = {
  main: {
    updater: {
      title: 'Nouvelle version disponible {version}',
      message: 'Une nouvelle version ({version}) de Lindo est disponible. Voulez-vous télécharger la mise à jour?',
      messageRequired:
        'Une nouvelle version ({version}) obligatoire de Lindo est disponible, vous pouvez la télécharger sur GitHub.',
      download: 'Télécharger',
      ignore: 'Ignorer'
    },
    gameMenu: {
      file: {
        title: 'Application',
        newWindow: 'Nouvelle fenêtre',
        newTab: 'Nouvel onglet',
        closeTab: "Fermer l'onglet",
        closeWindow: 'Quitter'
      },
      edit: {
        title: 'Edition',
        undo: 'Annuler',
        redo: 'Rétablir',
        cut: 'Couper',
        copy: 'Copier',
        paste: 'Coller',
        selectAll: 'Tout sélectionner'
      },
      window: {
        title: 'Fenêtre',
        reload: 'Recharger',
        prevTab: 'Onglet précédent',
        nextTab: 'Onglet suivant',
        sound: 'Son',
        enableSound: 'Activer le son',
        disableSound: 'Désactiver le son',
        zoomIn: 'Zoomer',
        zoomOut: 'Dézoomer',
        resetZoom: 'Réinitialiser le zoom',
        fullScreen: 'Plein écran'
      },
      infos: {
        title: '?',
        changelog: 'Notes de mise à jour',
        console: 'Console développeur',
        about: 'À propos...'
      }
    },
    dialogs: {
      cacheCleared: {
        title: 'Cache vidé',
        message: 'Le cache à été vidé.'
      }
    }
  },
  notifications: {
    fightTurn: 'Début de tour de {characterName}',
    privateMessage: 'Message de :  {senderName}',
    taxCollector: 'Un percepteur est attaqué !',
    kolizeum: 'Un Kolizéum a été trouvé !',
    partyInvitation: '{senderName} vous invite à rejoindre son groupe.',
    aggression: 'Vous avez été aggressé !',
    saleMessage: 'Banque'
  },
  window: {
    main: {
      tabsOverflow: {
        text: 'Lindo ne garantit pas le support de plus de 6 onglets par fenêtre, vous pouvez cependant ouvrir une autre fenêtre ou bien continuer au risque de bugs !'
      }
    },
    changelog: {
      title: 'Notes de version',
      prefix: 'Version'
    },
    unlockScreen: {
      info: 'Entrez le mot de passe maître pour connecter vos comptes automatiquement.',
      chooseTeamConnect: 'Choisissez une équipe à connecter',
      connect: 'Se connecter',
      masterPassword: 'Mot de passe maître',
      invalidPassword: 'Mot de passe invalide',
      unlock: 'Déverrouiller',
      skip: 'Passer'
    },
    updateGame: {
      title: 'Mise à jour de Lindo',
      step0: 'Préparation de la mise à jours..',
      step1: 'Étape 1 : Téléchargement des fichiers de Dofus',
      step2: 'Étape 2 : Téléchargement des patchs Lindo',
      step3: 'Étape 3 : Résolution des versions',
      step4: 'Étape 4 : Application des patchs',
      step5: 'Étape 5 : Écriture des fichiers modifiés',
      step6: 'Étape 6 : Suppression des anciens fichiers',
      step7: 'Étape 7 : Finalisation',
      step8: 'Étape 8 : Lancement de Lindo..',
      information: {
        search: 'Recherche de mises à jour...',
        error: "Impossible d'effectuer la mise à jour ! Veuillez réessayer ultérieurement",
        retry: 'Réessayer'
      }
    },
    options: {
      title: 'Options',
      button: {
        reset: 'Réinitialiser les options',
        close: 'Fermer'
      },
      dialogs: {
        resetSettings: {
          title: 'Réinitialiser toutes les options ?',
          message: "En continuant, tous les paramètres seront remis à zéro. Cette opération n'est pas réversible.",
          confirm: 'Réinitialiser',
          cancel: 'Annuler'
        }
      }
    }
  },
  option: {
    general: {
      title: 'Général',
      interface: 'Interface',
      sound: 'Son',
      gameData: 'Données du jeu',
      language: 'Langue',
      resolution: 'Résolution',
      fullScreen: 'Activer le mode plein écran',
      hideTab: "Masquer la barre d'onglets multi-compte",
      localContent: 'Activer le téléchargement local des cartes (beta)',
      soundFocus: 'Activer le son du jeu uniquement sur la fenêtre au premier plan',
      early: 'Jouer sur Dofus Touch Early',
      restart: 'Appliquer et redémarrer',
      resetGame: 'Re-télécharger les données du jeu',
      clearCache: 'Vider le cache'
    },
    shortcuts: {
      title: 'Raccourcis',
      diver: {
        header: 'Diver',
        endTurn: 'Passer son tour / Prêt (combat)',
        openChat: 'Ouvrir le chat',
        openMenu: 'Ouvrir le menu',
        goUp: 'Aller à la carte du dessus',
        goDown: 'Aller à la carte du dessous',
        goLeft: 'Aller à la carte de gauche',
        goRight: 'Aller à la carte de droite',
        showMonsterTooltips: 'Afficher/Cacher les informations des groupes de monstres'
      },
      interfaces: {
        header: 'Interfaces',
        carac: 'Personnage',
        spell: 'Sorts',
        bag: 'Inventaire',
        bidHouse: 'Hôtel de vente',
        map: 'Carte',
        friend: 'Amis',
        book: 'Quêtes',
        guild: 'Guildes',
        conquest: 'Kolizeum',
        goultine: 'Shop',
        job: 'Metiers',
        alliance: 'Alliance',
        mount: 'Monture',
        directory: "Répertoire de guilde et d'alliance",
        alignment: 'Alignement',
        bestiary: 'Bestiare',
        title: 'Titres et Ornements',
        achievement: 'Succès',
        dailyQuest: 'Quêtes Journalières',
        spouse: 'Conjoint',
        shop: 'Marchand'
      },
      items: {
        header: 'Objets',
        slot: 'Emplacement {x}'
      },
      application: {
        header: 'Application',
        newWindow: 'Nouvelle fenêtre',
        newTab: 'Nouvel onglet',
        tab: 'Onglet {x}',
        nextTab: 'Onglet suivant',
        prevTab: 'Onglet précédent'
      },
      spells: {
        header: 'Sorts',
        slot: 'Emplacement {x}'
      },
      mods: {
        header: 'Mods',
        mapResources: 'Affichage/Cacher des ressources',
        healthBar: 'Affichage/Cacher la barres de vie'
      },
      information:
        'Vous pouvez utiliser les touches CTRL/CMD, SHIFT, ESPACE, ALT. Pour rentrer vos raccourcis pressez la combinaison de touche souhaitée dans le champ.',
      error: 'Cette touche de raccourci ne peut pas être utilisée.'
    },
    features: {
      title: 'Fonctionnalités',
      general: {
        header: 'Général',
        hideShop: 'Cacher le bouton Shop',
        activeOpenMenu: "Ouvrir le menu lorsqu'aucune fenêtre n'est ouverte (ECHAP)",
        disableInactivity: "Prolonger le délai maximum d'inactivité",
        zaapSearchFilter: 'Afficher le filtre de recherche de zaap'
      },
      fight: {
        header: 'Combat',
        healthBar: 'Afficher des barres de vie en-dessous des combatants',
        focusFightTurn: 'Basculer automatiquement vers un compte à son tour de jeu',
        estimator: "Afficher l'estimation des dégats des sorts en combat",
        fightChronometer: 'Afficher le chronomètre de combat',
        monsterTooltip: 'Afficher les informations des groupes de monstres sur la carte',
        monsterTooltipShortcut: 'Afficher le raccourci pour les informations des groupes de monstres',
        verticalTimeline: 'Afficher la barre des combatants de manière verticale',
        challengePercent: 'Afficher le bonus XP/Drop du challenge'
      },
      group: {
        header: 'Groupes',
        partyMemberOnMap: "Ajouter un indicateur pour savoir si les membres d'un groupe sont sur la même carte",
        partyInfo: {
          level: 'Afficher le niveau du groupe',
          prospecting: 'Afficher la prospection du groupe'
        },
        autoGroup: {
          header: 'Auto Groupe',
          active: 'Activer le groupage automatique',
          warning:
            'Attention, suivre le meneur peut être considéré comme du boting pour les autres joueurs, utilisez le avec modération et dans des zones non peuplées.',
          warningTimer:
            'Attention, cette fonctionnalité peut être considérée comme du boting pour les autres joueurs, utilisez le avec modération et dans des zones non peuplées.',
          explanation1:
            "Les personnages du groupe doivent être amis avec le meneur pour que l'invitation soit automatique.",
          explanation2: 'Les membres suivent le meneur si ce dernier est sur la même carte.',
          leader: 'Nom du meneur',
          members: 'Noms des personnages',
          addMember: 'Ajouter un personnage',
          followLeader: 'Suivre le meneur du groupe',
          disableTimer: "Désactiver le Timer pour l'auto groupe",
          ready: 'Passer automatique en ready',
          fight: 'Entrer dans les combats automatiquement',
          delay: 'Délai avant de suivre (en seconde)',
          followOnMap: 'Suivre le leader sur une carte',
          strictMove: 'Aller sur la même case que le leader',
          pvpWarning: 'Vous ne pouvez pas rejoindre un combat PvP automatiquement'
        }
      },
      job: {
        header: 'Métiers',
        showResources: 'Afficher les ressources de la carte',
        harvestIndicator: 'Afficher des barres de temps sous les récoltes',
        jobsXp: "Activer l'affichage de l'xp a obtenir pour monter de niveau (métier)"
      },
      accounts: {
        header: 'Comptes'
      }
    },
    notifications: {
      title: 'Notifications',
      description:
        'Vous pouvez recevoir des notifications de votre jeu dofus lorsque vous êtes sur une autre application avec dofus en arrière plan. Vous pouvez être notifié :',
      fightTurn: 'En début du tour (combat)',
      privateMessage: "À l'arrivée d'un message privé",
      taxCollector: 'Quand un percepteur est attaqué',
      kolizeum: 'Quand un combat de kolizéum est trouvé',
      partyInvitation: 'Quand un joueur vous invite dans un groupe',
      aggression: 'Quand un joueur vous aggresse',
      saleMessage: 'Quand un item est vendu'
    },
    multiAccount: {
      title: 'Multi Compte',
      enable: 'Activer le multi compte avec motre mot de passe maître',
      notConfigured:
        'Pour utiliser cette fonctionnalité, un mot de passe doit être configuré. Il sera utilisé afin de démarrer Lindo avec les automatismes du multi-compte.',
      configurePassword: 'Configurer le mot de passe',
      addCharacter: 'Ajouter un personnage',
      newTeam: 'Nouvelle équipe',
      removePassword: 'Supprimer le mot de passe',
      changePassword: 'Changer le mot de passe',
      dialogs: {
        characterDialog: {
          title: 'Ajouter un personnage',
          confirm: 'Ajouter',
          cancel: 'Annuler'
        },
        teamDialog: {
          title: 'Nouvelle équipe',
          teamName: "Nom de l'équipe",
          addWindow: 'Ajouter une fenêtre',
          confirm: 'Ajouter',
          cancel: 'Annuler'
        },
        selectCharacter: {
          title: 'Sélectionner un personnage',
          cancel: 'Annuler'
        },
        passwordDialog: {
          configurePassword: 'Configurer le mot de passe maître',
          changePassword: 'Changer le mot de passe',
          removePassword: 'Supprimer le mot de passe?',
          removePasswordInfo: 'Le mot de passe maître sera supprimé, cela va supprimer les comptes enregistrés.',
          password: 'Mot de passe',
          confirmPassword: 'Confirmer le mot de passe',
          oldPassword: 'Ancien mot de passe',
          confirmRemovePassword: 'Supprimer le mot de passe',
          validate: 'Valider',
          cancel: 'Annuler'
        }
      },
      characterCard: {
        characterImageNotLoaded: "L'image du personnage sera chargée après la connexion",
        buttons: {
          select: 'Sélectionner',
          delete: 'Supprimer',
          edit: 'Editer',
          remove: 'Supprimer'
        }
      },
      teamWindowCard: {
        window: 'Fenêtre {position}',
        addCharacter: 'Ajouter un personnage'
      },
      teamAccordion: {
        delete: "Supprimer l'équipe",
        edit: "Editer l'équipe",
        window: 'Fenêtre {position}'
      }
    },
    about: {
      title: 'À propos',
      links: {
        website: 'Site web',
        github: 'Github (code source)',
        chat: 'Serveur de chat',
        reddit: 'Reddit (forum)',
        changelog: 'Notes de version'
      },
      text0: 'Lindo est un logiciel open-source vous permettant de jouer à DOFUS Touch depuis votre ordinateur.',
      text1:
        'Contrairement à un émulateur Android, le code est directement interprété par votre ordinateur, ce qui rend sa lecture plus rapide et vous permet donc de jouer à DOFUS Touch en profitant pleinement des performances de votre ordinateur !',
      text2:
        "Initialement connu sous le nom de DOFUS Touch No-Emu, ce logiciel développé par Daniel et Thomas a été contraint de fermer ses portes suite à un avertissement de la part d'Ankama."
    }
  },
  // MODS Texts
  mod: {
    jobXP: {
      xpMissing: '{xp} XP manquant<br>avant le niveau {nextLevel}'
    },
    monsterTooltip: {
      level: 'Level',
      group: 'Group'
    },
    partyInfo: {
      level: 'Lvl.'
    },
    runeLister: {
      message: 'Obtention de {quantity} {runeName}'
    },
    zaapSearchFilter: {
      placeholder: 'Rechercher un zaap',
      placeholderZaapi: 'Rechercher un zaapi',
      placeholderPrisme: 'Rechercher un prisme'
    }
  }
}

export default fr
