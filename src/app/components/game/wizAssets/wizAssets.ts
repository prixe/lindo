import { Logger } from "app/core/electron/logger.helper";
import { HttpClient } from '@angular/common/http';
const fs = fsExtraLib;
const https = httpsLib;

export class WizAssets {

    private cachePath: string;
    private http: HttpClient;

    constructor(cachePath: string, http: HttpClient) {
        this.cachePath = cachePath;
        this.http = http;
    }

    private getFileExtension(file: string) {
        return (/[.]/.exec(file)) ? /[^.]+$/.exec(file)[0] : undefined;
    }

    /*
     - Call this method first to know if plugin initialization went well. In some rare corner cases (if device storage is not writable for an unknown reason for instance) it can fail.
     - If initialization failed, any other API call will call the error callback.
     */
    public initialize(success: () => void, fail: (error: Error) => void) {
        //throw new Error('initialize not implemented');
        success();
    }

    /*
     - downloads a file to native App directory @ ./ + gameDir+ / + assetId
     - A success returns a local URL string like; file://documents/settings/img/cards/card001.jpg
     - An error returns an error object such as: (cf doc)
     */
    public downloadFile(remoteURL: string, assetId: string, success: (file: string) => void, fail: (error: Error) => void) {
        //throw new Error('downloadFile not implemented');

        let filePath: string = this.cachePath + "/" + assetId;

        //Logger.info('downloadFile');
        //Logger.info(filePath);

        fs.exists(filePath, (exists: number) => {
            if (exists) {
                return success(filePath);
            }

            fs.ensureFile(filePath, (err: Error) => {

                if (err) {
                    Logger.info(err);
                    return fail(err);
                }

                let f = fs.createWriteStream(filePath);

                https.get(remoteURL, function (res: any) {
                    res.on('data', (chunk: string) => {
                        f.write(chunk);
                    });
                    res.on('end', () => {
                        f.end();
                    });
                    res.on('error', (err: any) => {
                        Logger.info(err);
                        return fail(err);
                    });
                }).on('error', (err: any) => {
                    Logger.info(err);
                    Logger.info(remoteURL);
                    Logger.info('retry');
                    return this.downloadFile(remoteURL, assetId, success, fail);
                });

                f.on('error', (err: any) => {
                    Logger.info(err);
                    return fail(err);
                });

                f.on('close', (err: any) => {
                    return success(filePath);
                })
            });
        });
    }

    /*
     - deletes the file specified by the asset id
     - if the asset id does not exist fail will be called with error NotFoundError
     - if the asset id cannot be deleted (i.e. file resides in read-only memory) fail will be called with an error message
     */
    public deleteFile(assetId: string, success: () => void, fail: (error: Error) => void) {

        let filePath: string = this.cachePath + "/" + assetId;

        Logger.info('deleteFile');

        fs.exists(filePath, function (exists: boolean) {
            if (exists) {
                fs.remove(filePath, (err: Error) => {
                    if (err) return fail(err);

                    success();
                });
            } else {
                // TODO: renvoyer une erreur NotFoundError
                success();
            }
        });
    }

    /*
     - delete files specified by their asset id in Array
     - if an asset id uses a path format and matches a folder, then the folder content will be deleted; img/cards
     - if an asset id cannot be deleted (i.e. file resides in read-only memory) fail will be called with an error message
     - the array CAN contain one asset id
     */
    public deleteFiles(assetIds: Array<string>, success: () => void, fail: (error: Error) => void) {
        assetIds.forEach((assetId) => {
            this.deleteFile(assetId, success, fail);
        });
    }

    /*
     - A success returns a local URL string like file://documents/settings/img/cards/card001.jpg
     - A failure returns an error message
     */
    public getFileURI(assetId: string, success: (file: string) => void, fail: (error: Error) => void) {
        throw new Error('getFileURI not implemented');

    }

    /*
     - A success returns a hashmap of asset id matching its local URL such as
     - A failure returns an error message
     */
    public getFileURIs(success: ({ [assetId: number]: string }), fail: (error: Error) => void) {
        throw new Error('getFileURIs not implemented');

    }

}