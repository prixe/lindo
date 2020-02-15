import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService as electron } from 'app/core/electron/electron.service';
import { IpcRendererService } from 'app/core/electron/ipcrenderer.service';
import { Subscription } from 'rxjs';
import { Logger } from "app/core/electron/logger.helper";
import { SettingsService } from 'app/core/service/settings.service';
import { js as BeautifyJs, css as BeautifyCss } from 'js-beautify';
const progress = requestProgressLib;
const request = requestLib;
const fs = fsLib;
const path = pathLib;

@Component({
    selector: 'component-official-game-update',
    templateUrl: './official-game-update.component.html',
    styleUrls: ['./official-game-update.component.scss']
})
export class OfficialGameUpdateComponent implements OnInit, OnDestroy {

    public progressMode: string = "indeterminate";
    public progressValue: number = 0;
    private saveFile: any;
    public informations: string;
    private sub: Subscription;

    private promiseQueueProcessingMax: number = 6;
    private promiseQueueProcessing: number = 0;
    private promiseQueue: any = [];

    private totalProgress: number = 0;
    private currentProgress: number = 0;

    private destinationPath: string;

    private remoteOrigin: string = this.settingsService.option.general.early ? "https://earlyproxy.touch.dofus.com/" : "https://proxyconnection.touch.dofus.com/";
    private remoteManifestPath: string = "manifest.json";
    private remoteAssetMapPath: string = "assetMap.json";
    private remoteLindoManifest: string = "https://raw.githubusercontent.com/Clover-Lindo/lindo-game-base/master/manifest.json";
    private remoteLindoManifestAlt: string = "http://api.no-emu.co/manifest.json";
    private remoteKeymaster: string = "https://raw.githubusercontent.com/madrobby/keymaster/master/keymaster.js";
    private remoteITunesAppVersion: string = (this.settingsService.option.general.early ? "https://itunes.apple.com/lookup?id=1245534439" : "https://itunes.apple.com/lookup?id=1041406978") + "&t=" + (new Date().getTime())
    private currentLindoManifest: any;
    private currentManifest: any;
    private currentAssetMap: any;
    private currentRegex: any;

    private lindoManifest: any;
    private manifest: any;
    private assetMap: any;

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


            try {

                let promises = [];

                promises.push(this.downloadKeymaster());

                // Downloading manifests

                await Promise.all([
                    this.loadCurrentLindoManifest(), this.loadCurrentManifest(), this.loadCurrentAssetMap(), this.loadVersions(), this.loadCurrentRegex(),
                    this.downloadLindoManifest(), this.downloadManifest(), this.downloadAssetMap()
                ]);


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

                this.progressMode = "determinate";


                // Downloading & saving assets

                promises.push(this.downloadAndSaveMissingFiles(this.assetMap, assetMapDifferences, this.remoteOrigin));


                // Deleting old files

                promises.push(Promise.all([
                    this.deleteOldFiles(lindoManifestDifferences),
                    this.deleteOldFiles(manifestDifferences),
                    this.deleteOldFiles(assetMapDifferences)
                ]));


                // Downloading lindo & game files

                let [lindoMissingFiles, manifestMissingFiles] = await Promise.all([
                    this.downloadMissingFiles(this.lindoManifest, lindoManifestDifferences),
                    this.downloadMissingFiles(this.manifest, manifestDifferences, this.remoteOrigin)
                ]);



                promises.push((async (resolve, reject) => {
                    if (manifestMissingFiles["build/script.js"]) {
                        this.log("Getting new versions numbers");
                        if (this.versions == null)
                            this.versions = {};
                        this.versions.buildVersion = manifestMissingFiles["build/script.js"].match(/window\.buildVersion\s?=\s?"(\d+\.\d+\.\d+(?:\-\d+)?)"/)[1];
                        this.versions.appVersion = await new Promise((resolve, reject) => {
                            request(this.remoteITunesAppVersion, (err, response, body) => {
                                try {
                                    if (err) reject(err);
                                    else resolve(JSON.parse(body).results[0].version)
                                } catch (e) {
                                    this.log(JSON.stringify(response, null, 2));
                                    reject(e);
                                }
                            });
                        });
                    }
                    this.log("buildVersion: " + this.versions.buildVersion + ", appVersion: " + this.versions.appVersion);
                })());


                // Applying regex to game files

                promises.push((async (resolve, reject) => {

                    this.log("Applying regex...");

                    this.applyRegex(lindoManifestDifferences['regex.json'] == 1
                        ? JSON.parse(lindoMissingFiles['regex.json'])
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
                Logger.error(e.message);
            }

        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    loadCurrentLindoManifest() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "lindoManifest.json", (err, data) => {
                if (err) resolve(null);
                else {
                    this.currentLindoManifest = JSON.parse(data);
                    resolve(data);
                }
            });
        });
    }

    loadCurrentManifest() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "manifest.json", (err, data) => {
                if (err) resolve(null);
                else {
                    this.currentManifest = JSON.parse(data);
                    resolve(data);
                }
            });
        });
    }

    loadCurrentAssetMap() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "assetMap.json", (err, data) => {
                if (err) resolve(null);
                else {
                    this.currentAssetMap = JSON.parse(data);
                    resolve(data);
                }
            });
        });
    }

    loadVersions() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "versions.json", (err, data) => {
                if (err) resolve(null);
                else {
                    this.versions = JSON.parse(data);
                    resolve(data);
                }
            });
        });
    }

    loadCurrentRegex() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "regex.json", (err, data) => {
                if (err) resolve(null);
                else {
                    this.currentRegex = JSON.parse(data);
                    resolve(data);
                }
            });
        });
    }

    download(url, json = false, weight = 1) {
        let currentProgress = 0;
        return new Promise((resolve, reject) => {
            progress(request(url, (err, response, body) => {
                if (err) {
                    reject(err);
                }
                else if (response.statusCode >= 300) {
                    reject(response.statusCode);
                }
                else {
                    this.addProgress(weight - currentProgress);
                    if (json)
                        resolve(JSON.parse(body));
                    else
                        resolve(body);
                }
            })).on("progress", (state) => {
                let progress = state.percent * weight;
                this.addProgress(progress - currentProgress);
                currentProgress = progress;
            });
        });
    }

    async downloadLindoManifest() {
        try {
            return this.lindoManifest = await this.download(this.remoteLindoManifest, true);
        } catch (e) {
            return await this.downloadLindoManifestAlt();
        }
    }

    async downloadLindoManifestAlt() {
        return this.lindoManifest = await this.download(this.remoteLindoManifestAlt, true);
    }

    async downloadManifest() {
        return this.manifest = await this.download(this.remoteOrigin + this.remoteManifestPath, true);
    }

    async downloadAssetMap() {
        return this.assetMap = await this.download(this.remoteOrigin + this.remoteAssetMapPath, true);
    }

    downloadKeymaster() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.destinationPath + "keymaster.js", async (err, data) => {
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

    /**
     * { "filename": difference }
     * 
     * `difference` is equal to -1, 0 or 1 depending if the file is removed, unchanged, or changed
     */
    differences(manifestA, manifestB) {
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

    computeProgressTotal(manifestDifferences, assetMapDifferences) {
        let total = 0;
        for (var i in manifestDifferences)
            if (manifestDifferences[i] == 1) total += this.getFileEstimatedWeight(i);
        for (var i in assetMapDifferences)
            if (assetMapDifferences[i] == 1) total += this.getFileEstimatedWeight(i);
        this.totalProgress = total;
    }

    addProgress(progress) {
        if (this.totalProgress > 0) {
            this.zone.run(() => {
                if (progress > 60) debugger;
                this.currentProgress += progress;
                this.progressValue = this.currentProgress / this.totalProgress * 100;
            });
        }
    }

    getFileEstimatedWeight(filename) {
        switch (filename) {
            case "build/script.js":
                return 100;
            default:
                return 1;
        }
    }

    /**
     * { "filename": "fileContent" }
     */
    async downloadMissingFiles(manifest, differences, basePath = "") {
        let files = {};
        for (var i in differences) {
            if (differences[i] == 1) {
                files[i] = await this.download(basePath + manifest.files[i].filename, false, this.getFileEstimatedWeight(manifest.files[i].filename));
            }
        }
        this.log("Downloaded missing files from one manifest");
        return files;
    }

    applyRegex(regex, files) {
        for (let filename in regex) {
            if (files[filename]) {
                if (/.js$/.test(filename)) {
                    files[filename] = BeautifyJs(files[filename], { "break_chained_methods": true });
                }
                else if (/.css$/.test(filename)) {
                    files[filename] = BeautifyCss(files[filename]);
                }
                for (let i in regex[filename]) {
                    files[filename] = files[filename].replace(new RegExp(regex[filename][i][0], 'g'), regex[filename][i][1]);
                }
            }
        }
    }

    async saveFiles(files) {
        let promises = [];
        try {
            for (var filename in files) {
                promises.push(this.saveOneFile(this.destinationPath + filename, files[filename]));
            }
        } catch (e) { Logger.error(e.message); }
        return await Promise.all(promises);
    }

    saveOneFile(filePath, content) {
        return new Promise((resolve, reject) => {
            this.ensureDirectoryExists(filePath);
            fs.writeFile(filePath, content, err => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async downloadAndSaveMissingFiles(manifest, differences, basePath = "") {
        let promises = [];
        try {
            for (var i in differences) {
                if (differences[i] == 1) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    promises.push(this.queueNextFile(
                        basePath + manifest.files[i].filename,
                        this.destinationPath + manifest.files[i].filename));
                }
            }
        } catch (e) { Logger.error(e.message); }
        await Promise.all(promises);
        return;
    }

    queueNextFile(url, filePath) {
        return new Promise((resolve, reject) => {
            this.queuePromise(() => {
                return this.downloadAndSaveFile(url, filePath);
            })
                .then(resolve)
                .catch(err => reject(err));
        });
    }

    queuePromise(fct) {
        return new Promise((resolve, reject) => {
            var retry = 0;
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
                    .finally(() => {
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

    downloadAndSaveFile(url, filePath) {
        return new Promise((resolve, reject) => {
            try {
                this.ensureDirectoryExists(filePath);
                let fileStream = fs.createWriteStream(filePath);
                progress(request(url))
                    .on('error', err => {
                        reject(err);
                    })
                    .on('end', () => {
                        this.addProgress(1);
                        resolve();
                    })
                    .pipe(fileStream);
            } catch (e) { Logger.error(e.message); reject(e.message); }
        });
    }

    deleteOldFiles(differences) {
        var promises = [];
        for (var i in differences) {
            if (differences[i] == -1) {
                ((filename) => {
                    promises.push(new Promise((resolve, reject) => {
                        fs.unlink(this.destinationPath + filename, err => {
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

    async deleteFolderRecursive() {

        if (fs.existsSync(this.destinationPath)) {
            await fs.readdirSync(this.destinationPath).forEach((file, index) => {
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

    ensureDirectoryExists(filePath) {
        var dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExists(dirname);
        fs.mkdirSync(dirname);
    }


    log(msg) {
        Logger.info("[UPDATE] " + msg);
    }

    fail(err) {
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
