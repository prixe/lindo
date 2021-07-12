import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService as electron } from 'app/core/electron/electron.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { Subscription } from 'rxjs';
import { Logger } from "app/core/electron/logger.helper";
import { SettingsService } from 'app/core/service/settings.service';
import { js as BeautifyJs, css as BeautifyCss } from 'js-beautify';
const fs = fsLib;
const path = pathLib;
const axios = axiosLib;
const httpAdapter = httpAdapterLib;

/**
 * { "filename": difference }
 * `difference` is equal to -1, 0 or 1 depending if the
 * file is removed, unchanged, or changed
 */
interface Differences {
   [key: string]: number;
}

/**
 * { "filename": "fileContent" }
 */
interface Files {
   [key: string]: (string|Object);
}

interface ManifestFile {
    filename: string,
    version: string
}

interface ManifestFiles {
    [key: string]: ManifestFile;
}

interface Manifest {
    files: ManifestFiles
}

type RegexPatch = [string, string]

interface RegexPatches {
    [key: string]: RegexPatch[]
}

@Component({
    selector: 'component-official-game-update',
    templateUrl: './official-game-update.component.html',
    styleUrls: ['./official-game-update.component.scss']
})
export class OfficialGameUpdateComponent implements OnInit, OnDestroy {

    public progressMode: string = "buffer";
    public progressValue: number = 0;
    public displayedProgress: number = 0;
    public informations: string;
    private sub: Subscription;

    private promiseQueueProcessingMax: number = 30;
    private promiseQueueProcessing: number = 0;
    private promiseQueue: any = [];

    private totalProgress: number = 0;
    private currentProgress: number = 0;

    private destinationPath: string;

    private remoteOrigin: string = this.settingsService.option.general.early ? "https://earlyproxy.touch.dofus.com/" : "https://proxyconnection.touch.dofus.com/";
    private remoteManifestPath: string = "manifest.json";
    private remoteAssetMapPath: string = "assetMap.json";
    private remoteLindoManifest: string = "https://raw.githubusercontent.com/Clover-Lindo/lindo-game-base/master/manifest.json";
    private remoteLindoManifestAlt: string = "https://api.lindo-app.com/manifest.json";
    private remoteKeymaster: string = "https://raw.githubusercontent.com/madrobby/keymaster/master/keymaster.js";
    private remoteITunesAppVersion: string = (this.settingsService.option.general.early ? "https://itunes.apple.com/lookup?id=1245534439" : "https://itunes.apple.com/lookup?id=1041406978") + "&t=" + (new Date().getTime())
    private currentLindoManifest: Manifest;
    private currentManifest: Manifest;
    private currentAssetMap: Manifest;
    private currentRegex: RegexPatches;

    private lindoManifest: Manifest;
    private manifest: Manifest;
    private assetMap: Manifest;

    private versions: any;

    constructor(
        private route: ActivatedRoute,
        private translate: TranslateService,
        private zone: NgZone,
        private ipcRendererService: IpcRendererService,
        private settingsService: SettingsService
    ) { }

    ngOnInit() {
        this.translate.get('app.window.update-dofus.information.search').subscribe((res: string) => {
            this.informations = res;
        });

        this.log("Checking for updates");

        this.sub = this.route.params.subscribe(async params => {
            // Defaults to 0 if no query param provided.
            this.destinationPath = decodeURIComponent(params['destinationPath']) + "/";

            let refreshProgressInterval = setInterval(() => {
                this.refreshDisplayedProgress();
            }, 500);

            try {
                let promises = [];

                // Downloading manifests
                this.log("Downloading manifests");

                await Promise.all([
                    this.loadCurrentLindoManifest(), this.loadCurrentManifest(), this.loadCurrentAssetMap(), this.loadVersions(), this.loadCurrentRegex(),
                    this.downloadLindoManifest(), this.downloadManifest(), this.downloadAssetMap()
                ]);

                this.log("Manifests downloaded");

                // Checking differences

                let lindoManifestDifferences = this.differences(this.currentLindoManifest, this.lindoManifest);
                let manifestDifferences = this.differences(this.currentManifest, this.manifest);
                let assetMapDifferences = this.differences(this.currentAssetMap, this.assetMap);

                // Redownload script & style if regex has changed
                if (lindoManifestDifferences['regex.json'] == 1) {
                    for (let i in manifestDifferences)
                        manifestDifferences[i] = 1;
                }

                setTimeout(() => {
                    this.translate.get('app.window.update-dofus.information.downloading').subscribe((res: string) => {
                        this.informations = res;
                    });
                }, 1000);

                this.log("Updating required files");

                this.computeProgressTotal(manifestDifferences, assetMapDifferences);

                // Downloading lindo & game files

                let [lindoMissingFiles, manifestMissingFiles] = await Promise.all([
                    this.downloadMissingFiles(this.lindoManifest, lindoManifestDifferences),
                    this.downloadMissingFiles(this.manifest, manifestDifferences, this.remoteOrigin)
                ]);

                // Downloading Keymaster
                promises.push(this.downloadKeymaster());

                // Downloading & saving assets
                promises.push(this.downloadAndSaveMissingFiles(this.assetMap, assetMapDifferences, this.remoteOrigin));

                // Deleting old files
                promises.push(Promise.all([
                    this.deleteOldFiles(lindoManifestDifferences),
                    this.deleteOldFiles(manifestDifferences),
                    this.deleteOldFiles(assetMapDifferences)
                ]));

                // Downloading game script
                promises.push((async (resolve, reject) => {
                    if (manifestMissingFiles["build/script.js"]) {
                        this.log("Getting new versions numbers");
                        if (this.versions == null)
                            this.versions = {};
                        this.versions.buildVersion = (manifestMissingFiles["build/script.js"] as string).match(/window\.buildVersion\s?=\s?"(\d+\.\d+\.\d+(?:\-\d+)?)"/)[1];
                        this.versions.appVersion = await new Promise((resolve, reject) => {
                            axios.get(this.remoteITunesAppVersion).then((response: any) => {
                                resolve(response.data.results[0].version)
                            }).catch((error: any) => {
                                this.log(JSON.stringify(error, null, 2));
                                reject(error);
                            });
                        });
                    }
                    this.log("buildVersion: " + this.versions.buildVersion + ", appVersion: " + this.versions.appVersion);
                })());


                // Applying regex to game files
                promises.push((async (resolve, reject) => {
                    this.log("Applying regex...");
                    this.applyRegex(lindoManifestDifferences['regex.json'] == 1
                        ? (lindoMissingFiles['regex.json'] as RegexPatches)
                        : this.currentRegex,
                        manifestMissingFiles);
                    this.log("Regex applied. Saving files");

                    // Saving lindo & game files
                    await Promise.all([
                        this.saveFiles(lindoMissingFiles),
                        this.saveFiles(manifestMissingFiles)
                    ]);
                    this.log("Files saved");
                })());


                // Await other promises
                await Promise.all(promises);

                this.log("Saving manifests");

                await Promise.all([
                    this.saveOneFile(this.destinationPath + "lindoManifest.json", JSON.stringify(this.lindoManifest)),
                    this.saveOneFile(this.destinationPath + "manifest.json", JSON.stringify(this.manifest)),
                    this.saveOneFile(this.destinationPath + "assetMap.json", JSON.stringify(this.assetMap)),
                    this.saveOneFile(this.destinationPath + "versions.json", JSON.stringify(this.versions))
                ]);

                this.ipcRendererService.send('update-finished', this.versions);
            } catch (e) {
                this.translate.get('app.window.update-dofus.information.error').subscribe((res: string) => {
                    this.informations = res + " (" + e.message + ")";
                });
                Logger.error(e);
                Logger.error(e.message);
            }

            clearInterval(refreshProgressInterval);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    loadCurrentLindoManifest(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "lindoManifest.json", (err: any, data: string) => {
                if (!err) this.currentLindoManifest = JSON.parse(data);
                resolve();
            });
        });
    }

    loadCurrentManifest(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "manifest.json", (err: any, data: string) => {
                if (!err) this.currentManifest = JSON.parse(data);
                resolve();
            });
        });
    }

    loadCurrentAssetMap(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "assetMap.json", (err: any, data: string) => {
                if (!err) this.currentAssetMap = JSON.parse(data);
                resolve();
            });
        });
    }

    loadVersions(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "versions.json", (err: any, data: string) => {
                if (!err) this.versions = JSON.parse(data);
                resolve();
            });
        });
    }

    loadCurrentRegex(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "regex.json", (err: any, data: string) => {
                if (!err) this.currentRegex = JSON.parse(data);
                resolve();
            });
        });
    }

    download(url: string, json: boolean = false, weight: number = 1): Promise<any> {
        let currentProgress = 0;
        return new Promise((resolve, reject) => {
            axios.get(url, {
                onDownloadProgress: (progressEvent: any) => {
                    if (progressEvent.total) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        let progress = percentCompleted * weight;
                        this.addProgress(progress - currentProgress);
                        currentProgress = progress;
                    }
                }
            }).then((response: any) => {
                this.addProgress(weight - currentProgress);
                resolve(response.data);
            }).catch((error: any) => {
                Logger.error(error);
                reject(error);
            });
        });
    }

    async downloadLindoManifest(): Promise<Manifest> {
        try {
            this.lindoManifest = await this.download(this.remoteLindoManifest, true);
            this.log("Lindo manifest downloaded");
            return this.lindoManifest
        } catch (e) {
            return await this.downloadLindoManifestAlt();
        }
    }

    async downloadLindoManifestAlt(): Promise<Manifest> {
        this.lindoManifest = await this.download(this.remoteLindoManifestAlt, true);
        this.log("Lindo manifest downloaded from alternative server");
        return this.lindoManifest;
    }

    async downloadManifest(): Promise<Manifest> {
        try {
            this.manifest = await this.download(this.remoteOrigin + this.remoteManifestPath, true);
        } catch (e) {
            this.log(e);
            this.log("Can't download Dofus Touch manifest");
            throw e;
        }
        this.log("Dofus Touch manifest downloaded");
        return this.manifest;
    }

    async downloadAssetMap(): Promise<Manifest> {
        this.assetMap = await this.download(this.remoteOrigin + this.remoteAssetMapPath, true);
        this.log("Assets map downloaded");
        return this.assetMap;
    }

    downloadKeymaster(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "keymaster.js", async (err: any) => {
                try {
                    if (err) {
                        let body = await this.download(this.remoteKeymaster);
                        await this.saveOneFile(this.destinationPath + "keymaster.js", body);
                        resolve();
                    }
                    else resolve();
                } catch (e) { reject(e.message); }
            });
        });
    }

    differences(manifestA: Manifest, manifestB: Manifest): Differences {
        let differences = {};

        // If not present in previous manifest, or version different => New file
        if (manifestB && manifestB.files) {
            for (let i in manifestB.files) {
                if (!manifestA
                    || !manifestA.files
                    || !manifestA.files[i]
                    || manifestA.files[i].version != manifestB.files[i].version)
                    differences[i] = 1;
                else differences[i] = 0;
            }
        }

        // If previous file not present in new manifest => Remove file
        if (manifestA && manifestA.files) {
            for (let i in manifestA.files) {
                if (!manifestB
                    || !manifestB.files
                    || !manifestB.files[i])
                    differences[i] = -1;
            }
        }

        return differences;
    }

    computeProgressTotal(manifestDifferences: Differences, assetMapDifferences: Differences) {
        let total = 0;
        for (var i in manifestDifferences)
            if (manifestDifferences[i] == 1) total += this.getFileEstimatedWeight(i);
        for (var i in assetMapDifferences)
            if (assetMapDifferences[i] == 1) total += this.getFileEstimatedWeight(i);
        this.totalProgress = total;
    }

    addProgress(progress: number) {
        if (this.totalProgress > 0) {
            this.zone.run(() => {
                this.progressMode = "determinate";
                this.currentProgress += progress;
                this.progressValue = this.currentProgress / this.totalProgress * 100;
            });
        }
    }

    refreshDisplayedProgress() {
        this.zone.run(() => {
            this.displayedProgress = this.progressValue;
        });
    }

    getFileEstimatedWeight(filename: string) {
        switch (filename) {
            case "build/script.js":
                return 100;
            default:
                return 1;
        }
    }

    async downloadMissingFiles(manifest: Manifest, differences: Differences, basePath: string = ""): Promise<Files> {
        let files = {};
        for (var i in differences) {
            if (differences[i] == 1) {
                files[i] = await this.download(basePath + manifest.files[i].filename, false, this.getFileEstimatedWeight(manifest.files[i].filename));
            }
        }
        this.log("Downloaded missing files from one manifest");
        return files;
    }

    applyRegex(regex: RegexPatches, files: Files) {
        for (let filename in regex) {
            if (files[filename]) {
                if (/.js$/.test(filename)) {
                    files[filename] = BeautifyJs(files[filename], { "break_chained_methods": true });
                }
                else if (/.css$/.test(filename)) {
                    files[filename] = BeautifyCss(files[filename]);
                }
                for (let i in regex[filename]) {
                    files[filename] = (files[filename] as string).replace(new RegExp(regex[filename][i][0], 'g'), regex[filename][i][1]);
                }
            }
        }
    }

    async saveFiles(files: Files): Promise<void[]> {
        let promises = [];
        try {
            for (var filename in files) {
                let fileContent: string;
                if (typeof files[filename] == 'object') fileContent = JSON.stringify(files[filename]);
                else fileContent = (files[filename] as string);
                promises.push(this.saveOneFile(this.destinationPath + filename, fileContent));
            }
        } catch (e) { Logger.error(e.message); }
        return await Promise.all(promises);
    }

    saveOneFile(filePath: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.ensureDirectoryExists(filePath);
            fs.writeFile(filePath, content, (err: any) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async downloadAndSaveMissingFiles(manifest, differences: Differences, basePath: string = ""): Promise<void> {
        let promises = [];
        try {
            for (var i in differences) {
                if (differences[i] == 1) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                    promises.push(this.queueNextFile(
                        basePath + manifest.files[i].filename,
                        this.destinationPath + manifest.files[i].filename));
                }
            }
        } catch (e) { Logger.error(e.message); }
        await Promise.all(promises);
        return;
    }

    queueNextFile(url: string, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.queuePromise(() => {
                return this.downloadAndSaveFile(url, filePath);
            })
                .then(resolve)
                .catch(err => reject(err));
        });
    }

    queuePromise(fct: () => Promise<any>): Promise<void> {
        return new Promise((resolve, reject) => {
            let retry = 0;
            let fctToRetry = () => {
                this.promiseQueueProcessing++;
                fct()
                    .then(resolve)
                    .catch(() => {
                        retry++;
                        this.log('Failed on queued function! Retrying... (' + retry + ')');
                        if (retry < 6)
                            fctToRetry();
                        else
                            reject();
                    })
                    .then(() => {
                        this.promiseQueueProcessing--;
                        this.processNextPromise();
                    });
            };
            this.promiseQueue.push(fctToRetry);
            if (this.promiseQueueProcessing < this.promiseQueueProcessingMax)
                this.processNextPromise();
        });
    }

    processNextPromise() {
        if (this.promiseQueue.length > 0) {
            this.promiseQueue.shift()();
        }
    }

    downloadAndSaveFile(url: string, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ensureDirectoryExists(filePath);
                let fileStream = fs.createWriteStream(filePath);
                fileStream.on('finish', () => {
                    this.addProgress(1);
                    resolve();
                });
                fileStream.on('error', (error: Error) => {
                    reject(error.message);
                });
                axios.get(url, {
                    responseType: 'stream',
                    adapter: httpAdapter
                }).then((response: any) => {
                    response.data.pipe(fileStream);
                }).catch((error: any) => {
                    reject(error);
                });
            } catch (e) { Logger.error(e.message); reject(e.message); }
        });
    }

    deleteOldFiles(differences: Differences): Promise<void[]> {
        var promises = [];
        for (var i in differences) {
            if (differences[i] == -1) {
                ((filename) => {
                    promises.push(new Promise((resolve, reject) => {
                        fs.unlink(this.destinationPath + filename, (err: any) => {
                            try {
                                if (err) {
                                    this.deleteFolderRecursive()
                                }
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }));
                })(i);
            }
        }

        return Promise.all(promises);
    }

    async deleteFolderRecursive(): Promise<void> {
        if (fs.existsSync(this.destinationPath)) {
            await fs.readdirSync(this.destinationPath).forEach((file: string) => {
                const curPath = path.join(this.destinationPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.deleteFolderRecursive();
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    ensureDirectoryExists(filePath: string) {
        var dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExists(dirname);
        fs.mkdirSync(dirname);
    }


    log(msg: any) {
        Logger.info("[UPDATE] " + msg);
    }

    fail(err: any) {
        Logger.error(err);
        this.zone.run(() => {
            this.translate.get('app.window.update-dofus.information.error').subscribe((res: string) => {
                this.informations = res;
            });
        });
    }

    formatUnit(count: number): string {
        if (count >= 1000000) {
            return (Math.round((count / 1000000) * 100) / 100) + ' Mb';
        }
        else if (count >= 1000) {
            return (Math.round((count / 1000) * 100) / 100) + ' Kb';
        }
        else {
            return (Math.round(count * 100) / 100) + ' B';
        }
    }

    public closeWindow() {
        electron.close();
    }
}