import { Mod } from "../mod";
import { MapComplementaryInformationsDataMessage } from "app/types/message.types";
import { ShortcutsHelper } from "@helpers/shortcuts.helper";
import { CustomWindow } from "@helpers/windowHelper/customWindow";
import { Button } from "@helpers/windowHelper/inputs/button";

export class DtMap extends Mod {
    private shortcutsHelper: ShortcutsHelper;
    private canLog: boolean = false;

    private window: CustomWindow;
    private iframe: HTMLIFrameElement;
    private iframeWindow: Window;

    private mapIds: number[] = [];
    private toSkip: number[] = [-1, 2, 11, 12, 13, 15, 16, 22, 27, 40, 41, 48, 49, 50, 56, 57, 58, 60, 62, 63, 64, 65, 69, 70, 72, 73, 82, 83, 85, 86, 88, 90, 92, 93, 94, 95, 96, 97, 99, 100, 102, 103, 106, 107, 115, 116, 117, 118, 119, 120, 122, 127, 128, 129, 137, 138, 139, 140, 141, 142, 143, 144, 145, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224];
    private db: IDBDatabase;

    startMod() {
        this.params = this.settings.option.vip.general;

        // Initialize helper
        this.shortcutsHelper = new ShortcutsHelper(this.wGame);

        // Define and apply css
        let dtmapCss = document.createElement('style');
        dtmapCss.id = 'dtmapCss';
        dtmapCss.innerHTML = `
            #dtmap {
                min-width: 50vw; min-height: 30vh;
                left: 0;
                top: 0;
            }
            #dtmap .windowBody {
                padding: 0 0 4px 0 !important;
            }
            #dtmap-iframe {
                border: none;
                width: 100%;
                height: 100%;
            }
        `;
        this.wGame.document.querySelector('head').appendChild(dtmapCss);

        // Set shortcut to open map
        this.shortcutsHelper.bind(this.params.dtmap_shortcut, () => this.toggle());

        // Set Listener
        this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', (e: MapComplementaryInformationsDataMessage) => {
            this.updatePlayerMarker(e);
            this.getData(e);
        });

        this.createWindow();
        this.loadDb();

        this.wGame.debugDtmap = (isActivated: boolean) => {
            this.canLog = isActivated;
            console.log(`Debug Dtmap session ${(isActivated) ? 'start' : 'end'}`);
        }
    }

    private createWindow() {
        const centerBtn = Button.createIconButton(this.wGame, 'dtmap-center', {icon: 'centerButton'});

        this.window = CustomWindow.createDofusWindow(this.wGame, 'Dofus Touch Map', 'dtmap')
            .makeDraggable()
            .makeResizable()
            .addFullScreenButton()
            .addButtonToLeftToHeader(centerBtn);

        centerBtn.addEvent(() => this.centerViewOnPlayerMarker());

        this.iframe = this.wGame.document.createElement("iframe");
        this.iframe.id = "dtmap-iframe";
        this.iframe.src = 'https://www.dofus-touch-map.com';

        this.window.addContent(this.iframe).hide();

        this.iframe.addEventListener('load', () => {
            this.iframeWindow = this.iframe.contentWindow;
        });
    }

    private centerViewOnPlayerMarker() {
        this.iframeWindow.postMessage({ type: 'centerViewOnPlayerMarker' }, 'https://www.dofus-touch-map.com');
    }

    private updatePlayerMarker(data: MapComplementaryInformationsDataMessage) {
        if (data.mapId === this.wGame?.gui?.playerData?.position?.mapPosition?.id && this.iframeWindow) {
            var pos = {
                // Maybe use "gui.playerData.position.coordinates.posX" for coord in underground map
                x: this.wGame?.gui?.playerData?.position?.mapPosition?.posX,
                y: this.wGame?.gui?.playerData?.position?.mapPosition?.posY,
            };
            // Update marker on dtmap-iframe
            this.iframeWindow.postMessage({ type: 'updatePlayerMarker', pos }, 'https://www.dofus-touch-map.com');
        }
        else setTimeout(() => this.updatePlayerMarker(data), 200);
    }

    private async getData(e: MapComplementaryInformationsDataMessage) {
        // Check if map is not already visit during the session
        if (this.mapIds.includes(e.mapId)) {
            this.logMsg("This map already visit today !");
            return;
        }

        var skip: boolean = false;
        // Check if data is present on Db
        await this.getDataFromDb(e.mapId).then(
            (response: any) => {
                const lastUpdate = new Date(response.lastUpdate).getTime();
                const now = new Date().getTime();
                const oneWeek = 7 * 24 * 3600 * 1000;

                if ((lastUpdate + oneWeek) <= now) {
                    this.logMsg("Les données sont trop vieilles");
                    this.addDataToDB({ lastUpdate: new Date(), mapId: e.mapId });
                }
                else {
                    this.logMsg("Les données sont à jour");
                    skip = true;
                };
            },
            (nodata) => {
                this.logMsg("Ajout de la carte en BDD");
                this.addDataToDB({ lastUpdate: new Date(), mapId: e.mapId });
            }
        );

        if (skip) return;

        var interactives = {};
        var result = { mapId: e.mapId, interactives: [] };
        var toSend = "";

        // For all interactives on map check if is not to skip and count quantity
        const skippedResources = [];
        e.interactiveElements.forEach((i: any) => {
            const typeId: number = i.elementTypeId;
            // Skip resource
            if (this.toSkip.includes(typeId)) skippedResources.push(i);
            // If resource is a garbage
            else if (typeId == -1 && i.enabledSkills?.[0]?.skillId == 153) interactives[105] = (interactives[105]) ? interactives[105] + 1 : 1;
            // If resource already in "interactives" add 1 else init with 1
            else interactives[typeId] = (interactives[typeId]) ? interactives[typeId] + 1 : 1
        });
        this.logMsg("Ressources ignorées : ", skippedResources);

        // For all interactives parse add in result object
        for (const i in interactives) {
            result.interactives.push({ id: i, quantity: interactives[i] });
        };

        // Check if we have content to send
        if (result.interactives.length == 0) result.interactives = [];
        toSend = JSON.stringify(result);

        this.logMsg("Données envoyées : ", toSend);

        fetch('https://api.dofus-touch-map.com/api/v2/resources', {
            method: 'POST',
            body: toSend,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'authorization': 'Bearer DP55zH7g.m6uCv5C8IxQUQFpgSoRghkQiOK0AAcLNbZEqzfTj'
            }
        }).catch((error) => console.warn('Something went wrong.', error) );

        this.mapIds.push(e.mapId);
    }


    /**************************************************************\
    * DataBase Code                                                *
    \**************************************************************/

    private loadDb() {
        // Open the database
        const dbconnect: IDBOpenDBRequest = window.indexedDB.open('flashDb', 1);
        dbconnect.onerror = (event: any) => console.error(`[DtMap] Erreur lors de la création / ouverture de la BDD`, event.target.error);
        dbconnect.onsuccess = () => this.logMsg(`[DtMap] BDD créer avec succès`);

        // Create or update the db
        dbconnect.onupgradeneeded = (ev: any) => {
            this.logMsg('Création / Mise à jour de la BDD');
            const db = ev.target.result;
            db.onerror = (event: any) => console.error(`[DtMap] Erreur BDD`, event.target.errorCode);

            db.createObjectStore('mapsVisited', { keyPath: 'mapId', autoIncrement: false });
        }

        // Load the db
        dbconnect.onsuccess = (ev: any) => {
            this.logMsg('BDD chargée!');
            this.db = ev.target.result;
        };
    }

    private addDataToDB(data: any) {
        // Open objectStore
        const transaction: IDBTransaction = this.db.transaction('mapsVisited', 'readwrite');
        const mapsVisitedStore: IDBObjectStore = transaction.objectStore('mapsVisited');

        transaction.onerror = (ev: any) => console.error(`[DtMap] Une erreur est survenue!`, ev.target.error.message);
        transaction.oncomplete = () => this.logMsg(`Les données ont été ajoutées avec succès à la BDD!`);

        // Add data to db
        mapsVisitedStore.put(data);
    }

    private getDataFromDb(key: number): Promise<boolean> {
        const transaction: IDBTransaction = this.db.transaction(["mapsVisited"]);
        const mapsVisitedStore: IDBObjectStore = transaction.objectStore("mapsVisited");
        const request: IDBRequest = mapsVisitedStore.get(key);

        request.onerror = () => console.error(`[DtMap] Echec de la requête !`);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if (request.result) return resolve(request.result);
                else return reject(null);
            };
        });
    }

    private logMsg(...data: any[]) {
        if (this.canLog) console.log(...data);
    }

    private toggle() {
        if (this.window.isVisible()) this.window.hide();
        else this.window.show();
    }

    public reset() {
        super.reset();
        this.window.destroy();
        this.wGame.document.getElementById('dtmapCss')?.remove;
    }
}