# Lindo01

[![Build Status](https://travis-ci.org/JulienCoutault/lindo01.svg?branch=master01)](https://travis-ci.org/JulienCoutault/lindo01)
[![Known Vulnerabilities](https://snyk.io/test/github/JulienCoutault/lindo01/badge.svg)](https://snyk.io/test/github/JulienCoutault/lindo01)

This repo is a fork of [Lindo](https://github.com/prixe/lindo), the branch [lindo01/master](https://github.com/JulienCoutault/lindo01/tree/master) is sync with [lindo/master](https://github.com/prixe/lindo/tree/master).

The default branch of this repo is [lindo01/master01](https://github.com/JulienCoutault/lindo01/tree/master01). This branch contain all features and bugfix not merge yet in Lindo.


# Lindo
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1da8c9d640994bb18d961b41a8c2aaec)](https://app.codacy.com/app/git_25/lindo01?utm_source=github.com&utm_medium=referral&utm_content=JulienCoutault/lindo01&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/prixe/lindo.svg?branch=master)](https://travis-ci.org/prixe/lindo)
[![npm](https://img.shields.io/badge/npm-%3E%3D%205.6.0-blue.svg)]()
[![node](https://img.shields.io/badge/node-%3E%3D%2010.0.0-green.svg)]()
[![Github All Releases](https://img.shields.io/github/downloads/prixe/lindo/total.svg)]()



Lindo allow you to play DofusTouch without android emulator, it's entirely coded in javascript via electron & angular. Lindo is totally corss-platform.

**/!\ Dofus Touch is the entire property of Ankama Games, and we are not affiliated in any way with Ankama. None of the files hosted in this repository is under copyright: They come from Open Source projects, libraries, the original DofusTouch No-Emu created by Daniel & Thomas, and our own Team (Lindo). Also, this project is for educational purposes only, we will never make any money from it.**

**Keep in mind that Lindo doesn't respect the TOU (also known as Conditions Générales d'Utilisation in french) of Dofus Touch, use it at your own risk.**

## Supported Platform
Lindo No-Emu works on :
- **Windows** 7 and newer (ia32/amd64)
- **macOS** 10.9 and newer
- **Linux** (Debian >= 8, Ubuntu >= 12, Fedora >= 21) (ia32/amd64)

## Table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Community](#community)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
    - [Node.js](#nodejs)
    - [Gulp](#gulp)
  - [Build Lindo](#build-lindo)
- [Start project in dev mode](#start-project-in-dev-mode)
- [Distribution building](#distribution-building)
  - [Windows](#windows)
  - [Linux](#linux)
  - [macOS](#macos)
- [Development](#development)
  - [Introduction](#introduction)
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
#### Gulp
```sh
$ npm install -g gulp
```
### Build Lindo
```sh
$ git clone https://github.com/prixe/lindo.git
$ cd lindo-master
$ npm install
```

## Start project in dev mode
Compile electron typescript source and angular source in developpement mode with a watcher :
```sh
$ npm run build:dev
```
Start the project in electron :
```sh
$ npm start
```
## Distribution building
If you want to make a release for a specific system you can use this command :
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
