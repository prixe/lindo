import {Mod} from "../mod";

export class JsFixes extends Mod {
    startMod(): void {
        this.contextLost();
        this.spritesOutOfScreen();
    }

    private contextLost() {
        const onWebGLContextLost = (event: any) => {
            Logger.info('reload webglcontext cause: webglcontextlost');
            this.wGame.isoEngine.background.render()
            event.preventDefault();
        };
        const canvas = this.wGame.document.getElementById("mapScene-canvas");
        canvas.addEventListener("webglcontextlost", onWebGLContextLost, false);

        this.addOnResetListener(() => {
            canvas.removeEventListener("webglcontextlost", onWebGLContextLost);
        });
    }

    private spritesOutOfScreen() {
        this.wGame.isoEngine.mapScene._refreshAreasBackup = this.wGame.isoEngine.mapScene._refreshAreas;
        this.wGame.isoEngine.mapScene._refreshAreas = function () {
            for (const id in this.areasToRefresh) {
                if (this.areasToRefresh[id][3] < this.t) {
                    this.areasToRefresh[id][2] = this.t;
                    this.areasToRefresh[id][3] = this.t + 5;
                }
                if (this.areasToRefresh[id][1] < this.l) {
                    this.areasToRefresh[id][0] = this.l;
                    this.areasToRefresh[id][1] = this.l + 5;
                }
            }
            this._refreshAreasBackup();
        }

        this.addOnResetListener(() => {
            this.wGame.isoEngine.mapScene._refreshAreas = this.wGame.isoEngine.mapScene._refreshAreasBackup;
            delete this.wGame.isoEngine.mapScene._refreshAreasBackup;
        });
    }
    public reset() {
        super.reset();
    }
}
