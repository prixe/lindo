## [2.4.0] - 2020-02-15

### Modifications

- Il n'est plus nécessaire de renseigner le mot de passe maître pour supprimer les comptes enregistrés
- Désactivation du rapport d'erreur automatique
- Il est désormais possible de jouer sur la version Early de Dofus Touch avec Lindo
- Mise à jour de la disposition des options générales
- Les échanges peuvent être refusés avec Echap
- Une nouvelle fonctionnalité activable permet d'afficher dans la timeline le temps passé en combat
- Double-cliquer sur un sort permet de l'utiliser instantanément sur soi-même

## [2.3.2] - 2019-10-02

### Modifications

- Forçage du rendu des onglets en arrière plan (corrige le mauvais affichage des résultats de combat)
- Envoi des erreurs automatisés, et anonymisation de l'adresse IP

## [2.3.1] - 2019-09-29

### Ajouts

- Possibilité d'effectuer un rapport de bug auquel sont attachées les précédentes erreurs survenue au cours de l'exécution de Lindo
- Les ajouts des version 2.2.1, 2.2.2 et 2.2.3 n'étaient pas présentent dans la 2.3.0. Ils le sont dans la 2.3.1.

## [2.3.0] - 2019-03-30

### Améliorations

- La prévisualisation du niveau et de la prospection peuvent être activées ou désactivées séparément
- Appuyer sur Echap lorsqu'aucune fenêtre n'est ouverte ouvrira le menu
- Un raccourci clavier supplémentaire pour ouvrir ce menu a été ajouté
- Mise à jour des dépendances, dont Electron

## [2.2.3] - 2019-09-29

### Ajouts

- Nouvelle fonctionnalité pour afficher l'XP restante avant de monter un niveau métier
- Raccourci pour changer de map avec les flèches du clavier

## [2.2.2] - 2019-08-03

### Améliorations

- Ajout d'une option pour désactiver l'ouverture du menu avec la touche Echap

## [2.2.1] - 2019-06-19

### Bugs

- Une tentative de suppression d'assets manquants ne bloque plus la mise à jour

## [2.2.0] - 2018-12-21

### Ajouts

- Prévisualisation du niveau et de la prospection totale d'un groupe. Cette fonctionnalité est activable dans les options de Lindo.

## [2.1.4] - 2018-12-01

### Améliorations

- Mise à jour de la section "À propos"
- Support de l'italien

## [2.1.3] - 2018-09-16

### Bugs

- L'estimation des dégâts est désormais fonctionnelle et compatible avec la version 1.35 de DofusTouch
- Annulation des mises à jours de librairies effectuées pour Lindo v2.1.2, provoquant une non-compatibilité sur Mac. Solution temporaire qui nous donnera le temps de trouver ce qui posait problème.

## [2.1.2] - 2018-08-28

### Améliorations

- Mise à jour de certaines librairies pour corriger des failles de sécurités
- Le mot de passe maître est désormais hashé avec un algorithme plus sécurisé (MD5 => SHA512 + sel)

## [2.1.1] - 2018-08-24

### Améliorations

- Nouvelle option pour cacher les montures de combat. Vous pouvez l'activer dans les options de Lindo avec les autres fonctionnalités. (beta)

### Bugs

- Les barres de vie devraient s'effacer correctement après avoir quitté un combat en tant que spectateur.

## [2.0.0] - 2018-05-19

### Améliorations
- Mise à jour d'Angular et Electron qui devraient offrir une meilleure stabilité, ainsi qu'un meilleur support pour les hautes résolutions.
- Introduction d'un système de mises à jour automatique: Le jeu se met désormais à jour immédiatement après la maintenance. Le téléchargement de cette mise à jour devrait être plus stable et plus rapide, puisque seuls les fichiers nécessaires sont re-téléchargés. Aussi, Lindo n'est plus dépendant des serveurs de Lindo pour fonctionner, ce qui devrait corriger d'éventuels problèmes d'indisponibilité.
- Nouveau bouton dans les paramètres pour vider le cache.

### Bugs
- Correction du crash sur Linux lié à la récupération de l'adresse Mac (utilisé pour généré le User Agent semi-aléatoire).
- Correction du crash des mods (raccourcis, barres de vies, auto follow...) lors de la reconnexion d'un personnage.
- L'estimation des dégâts air prend correctement en compte les résistances.
- Correction d'un bug provoquant l'ouverture d'une fenêtre restant blanche, introduit dans une beta 2.0.0.
- L'erreur SELF_SIGNED_CERT_IN_CHAIN provoquée lors d'une requête HTTPS depuis certaines connexions est désormais ignoré et non-bloquante.

## [1.1.6] - 2017-11-07

### Amélioration
- Tenter de lancer une nouvelle instance de Lindo ne remet plus à zéro les configurations. À la place, une nouvelle fenêtre sera ouverte.
- Meilleure crédibilité du User-Agent. Préférez ouvrir chaque compte dans une fenêtre séparée pour attribuer un appareil différent par compte ! Un User-Agent fixe sera attribué aléatoirement parmi 1196 combinaisons possibles.

## [1.1.5] - 2017-09-23

### Bugs
- Correction du crash lors de l'entrée en combat en suivi automatique
- Les options des menus déroulants sont à nouveau visibles

## [1.1.4] - 2017-06-19

### Changement
- Déplacement de l'accès à la fenêtre des raccourcis dans les options.
- Suppression de la fenêtre "À propos" et intégrations dans les options.
- Les notes de version sont désormais accessibles par un lien dans les options.
- Ajout d'un délai supplémentaire entre la connexion automatique des comptes pour améliorer la stabilité

### Amélioration
- Refonte de l'ergonomie de la fenêtre des options.
- Refonte de l'ergonomie de la fenêtre des raccourcis.
- Refonte de l'ergonomie de la fenêtre des notes de version.
- Refonte de l'auto-follow
- Appuyer sur entrée valide le mot de passe pour connecter les comptes

### Auto-follow
- L'auto-follow dispose désormais de trois niveaux de suivi :
  - Suivi de carte en carte
  - Suivi de case en case approximatif
  - Suivi de case en case strict
- L'auto-follow a été humanisé dans l'ensemble
  - Temps de réaction humains
  - Choix des cases pour le déplacement de carte en carte approximatif
- Les suiveurs peuvent rejoindre un combat déjà lancé dès qu'ils sont arrivés sur la carte
- Pour des soucis d'équité en AvA, il n'est plus possible de rejoindre un combat automatiquement pour un combat PvP

### User-Agent
- Vous pouvez désormais changer le user-agent du client de Dofus depuis les options

## [1.1.3] - 2017-04-20

### Bugs
- Correction d'un problème qui empêchait l'ouverture des fenêtres multi-compte.

## [1.1.2] - 2017-04-20

### Bugs
- Problème qui empêchait de changer d'onglet dans les options pendant le chargement.
- Les cliques sur les liens en jeu ouvrent maintenant le navigateur de l'ordinateur.
- Certaines touches pour les raccourcis ne fonctionnaient pas (ex: ESPACE, DELETE, etc.)

### Changement
- Intégration de l'écran de saisie du master-password dans la fenêtre principale.
- Intégration de l'écran "À propos" en tant que dialogue interne.
- Intégration de l'écran "Note de mise à jour" en tant que dialogue interne.
- Intégration de l'écran "Préférences" en tant que dialogue interne.
- Isolement de la partie "Raccourcis" en tant que fenêtre de dialogue interne autonome.
- Création d'un menu secondaire d'options au moment du clique sur l'engrenage.
- Les messages en console liés à l'application ont été supprimés.
- Les options "VIP" ont été renommés en "Fonctionnalités".
- L'icône de l'application a été entièrement remplacée.

### Amélioration
- Vitesse d'accès aux fenêtres internes considérablement réduite.
- L'application se lance sur l'écran ou votre souris est positionné.
- La fenêtre de mise à jour automatique des fichier du jeu a été refondu.
- Les polices de caractère ont été embarquées dans l'application.
- Suppression de la fenêtre intermédiaire invisible qui apparaissait brièvement dans votre barre des tâches au lancement de l'application.
- Amélioration de l'entrée en combat automatique pour la fonctionnalité de groupe (ne provoque plus de crash).

## [1.0.0] - 2017-03-29

### Ajout
- Démarrage du projet.
