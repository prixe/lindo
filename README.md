# Lindo
[![Build Status](https://travis-ci.org/prixe/lindo.svg?branch=master)](https://travis-ci.org/prixe/lindo)
[![npm](https://img.shields.io/badge/npm-%3E%3D%205.6.0-blue.svg)]()
[![node](https://img.shields.io/badge/node-%3E%3D%2010.0.0-green.svg)]()
[![Github All Releases](https://img.shields.io/github/downloads/prixe/lindo/total.svg)]()

http://lindo.no-emu.co

🇬🇧 Lindo allows you to play Dofus Touch on your computer (Windows / Mac OS / Linux) without android emulator, it is based on crossplatform technologies.

🇫🇷 Lindo vous permet de jouer à Dofus Touch sur votre ordinateur (Windows / Mac OS / Linux) sans utiliser d'émulateur, il est basé sur des technologies crossplateformes.

**⚠️ Dofus Touch is the entire property of Ankama Games, and we are not affiliated with Ankama. None of the files hosted in this repository are under copyright: They come from Open Source projects, libraries, the original DofusTouch No-Emu created by Daniel & Thomas and the work of direct contributors. We do not intend to cause any harm to Ankama Games and will never take any revenue from this project.**

**Keep in mind that Lindo doesn't officially respect the TOU (also known as CGU, Conditions Générales d'Utilisation in french) of Dofus Touch, use it at your own risk.**

## Supported Platform
Lindo No-Emu works on :
- **Windows** 7 and newer (ia32/amd64) 
- **macOS** 10.9 and newer
- **Linux** (Debian >= 9, Ubuntu >= 18) (amd64)

## Table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Community](#community)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
    - [Node.js](#nodejs)
  - [Build Lindo](#build-lindo)
- [Start project in dev mode](#start-project-in-dev-mode)
- [Distribution building](#distribution-building)
  - [Windows](#windows)
  - [Linux](#linux)
  - [macOS](#macos)
- [Development](#development)
  - [Introduction](#introduction)
  - [Commands explanation](#commands-explanation)
    - [Subcommands](#subcommands)
  - [How to help ?](#how-to-help-)
  - [Generate the TOC](#generate-the-toc)
  - [Structure of the application](#structure-of-the-application)
- [License](#license)
- [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Community
- [Discord](https://discord.gg/xdt5J4N)
- [Trello](https://trello.com/b/d1mc9DeS/lindo)

## Installation 
### Prerequisites
#### Node.js
- Windows : [Website](https://nodejs.org)
- Linux
```sh
$ apt-get install nodejs
```
- macOS
```sh
$ brew install nodejs
```
### Build Lindo
```sh
$ git clone https://github.com/prixe/lindo.git
$ cd lindo
$ npm install
```

## Start project in dev mode
Compile electron typescript source and angular source in developpement mode with a watcher (don't stop this command until you stop developing) :
```sh
$ npm run build:dev
```
Start the project in electron (open a new terminal) : 
```sh
$ npm start
```
Each time you change something in your code, you must restart lindo (restart 'npm start')

## Distribution building
If you want to make a release for a specific system, make sure build the project in production mode first:
```sh
$ npm run build:prod
```
Then you can use this command :

### Windows
On a windows environment :
```sh
$ npm run release:win
```
On a unix system (require docker)
```sh
$ docker-compose up
```
### Linux
```sh
$ npm run release:linux
```
### macOS
Only available on macOS system :
```sh
$ npm run release:mac
```

## Development
### Introduction
**Lindo** is developed with [Angular](https://angular.io/) as web framework and uses [Material](https://material.angular.io/) for the UI. It uses [electron](https://github.com/electron/electron) to be run as an standalone application, wich is based on Node.js and Chromium.

So we have to distinguish 2 contexts :
- **Navigator context** -> executed by Chromium (the Angular part) 
- **Electron context** -> executed by Node.js (it's allow platform interaction)

Navigator context is in the ```src/```folder and Electron context is in the ```electron/``` folder.


The idea is to simulate the environment Dofus Touch to run it on PC, because Dofus Touch is based on [Apache Cordova](https://cordova.apache.org/).

### Commands explanation
```sh
$ npm install
```
Installs the packages in package.json and their dependencies

```sh
$ npm run build:dev
```
Executes multiple subcommands to build for development

```sh
$ npm start
```
Executes `electron ./` and since `"main": "/dist/electron/main.js"` (in package.json) it becomes executing `electron ./dist/electron/main.js` which in turn eventually loads `/dist/app/index.html` (which is the angular context) once it gets to `main-window.js`

```sh
$ npm run build:prod
```
Executes multiple subcommands to build for production

```sh
$ npm run release:win
```
(or release:mac or release:linux): executes in the case of release:win for example `build --win --x64 --ia32` to compile and build the final binaries using electron-builder that in turn is using `loaded configuration file=package.json ("build" field)`, and `writing effective config file=releases\builder-effective-config.yaml` resulting in usable files in releases folder

#### Subcommands
- `$ npm run build:dev`
  - `$ npm run build:electron:dev`
    - `$ tsc -p electron/`: transpiles electron context files from TS to JS and puts them in `dist/electron`
    - `$ ncp electron/i18n dist/electron/i18n`: copies i18n files from `electron/i18n` to `dist/electron/i18n`
  - `$ npm run lint`: executes `ng lint` to start lint verification of the files
  - `$ ng build --watch`: builds angular context into dist/app, watches the source files for changes then builds them without the need to re-run this command

- `$ npm run build:prod`
  - `$ npm run build:electron:prod`
    - `$ tsc -p electron/tsconfig.prod.json`: transpiles electron context files from TS to JS and puts them in `dist/electron`
    - `$ ncp electron/i18n dist/electron/i18n`: copies i18n files from `electron/i18n` to `dist/electron/i18n`
  - `$ npm run lint`: executes `$ ng lint` to start lint verification of the files
  - `$ ng build --configuration=production`: builds angular context into dist/app

The config used by angular in `$ ng build (--configuration=production)` is at angular.json and particularly projects => lindo => architect => build => configurations => production. There is also stuff like file replacements inside.

**In the case of errors during building use an older version of node temporarily until the project gets updated and uses a more recent version. I personally use nvm to use the version 8.17.0 of Nodejs when building Lindo.**


### How to help ?
You can contact a senior developer of the project as [Clover](https://github.com/Clover-Lindo) or [Prixe](https://github.com/prixe). Or you can eventually join our [Discord](https://discord.gg/wcCgtsv).
Then you can create a pull request to add or fix features, you can also submit improvement idea or bug issue in the [issues section](https://github.com/prixe/lindo/issues).

### Generate the TOC 
If you edit the README.MD you wanna update the table of contents you can easily achieve it by using this command :
```sh
$ npm run toc
```

### Structure of the application
[TODO]

## License
**Lindo** is under GNU GPLv3 read [LICENCE](https://github.com/prixe/lindo/blob/master/LICENCE)

## Credits
- Daniel & Thomas for created the original **No-Emu**
- Ankama which allows us to increase our competences without legal consequence
