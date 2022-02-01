/**
 * crédit : le grand et beau switool (https://github.com/SwiTool)
 * 
 */
import { Mod } from "../mod";

export class AssetTheme extends Mod {
    private intervalUpdate

    private outdoor
    private cycleMode
    private nightMode
    private nightModeCustom
    private nightModeCustomDate

    private percentColors
    private bgPctColor

    startMod(): void {
        Logger.info('- enable AssetTheme');

        this.cycleMode = this.settings.option.vip.general.cyclemode;
        this.nightMode = this.settings.option.vip.general.nightmode;
        this.nightModeCustom = this.settings.option.vip.general.nightmodecustom;
        this.nightModeCustomDate = this.settings.option.vip.general.nightmodecustomdate;

        this.percentColors = [
            { pct: 0, color: { r: 0x66, g: 0x66, b: 0xcc } },
            { pct: 6, color: { r: 0x86, g: 0x86, b: 0xec } },
            { pct: 7, color: { r: 0x132, g: 0xcc, b: 0xcc } },
            { pct: 12, color: { r: 0x118, g: 0x118, b: 0x118 } },
            { pct: 21, color: { r: 0xa6, g: 0xa6, b: 0xec } },
            { pct: 23.99, color: { r: 0x66, g: 0x66, b: 0xcc } },
        ];
        this.bgPctColor = [
            { pct: 0, color: { r: 0x33, g: 0x4c, b: 0xff } },
            { pct: 6, color: { r: 0x53, g: 0x6c, b: 0xff } },
            { pct: 8, color: { r: 0xbf, g: 0x7f, b: 0x4c } },
            { pct: 12, color: { r: 0x118, g: 0x118, b: 0x118 } },
            { pct: 21, color: { r: 0xa3, g: 0xbc, b: 0xff } },
            { pct: 23.99, color: { r: 0x33, g: 0x4c, b: 0xff } },
        ];

        this.outdoor = true
        this.action()
        
        //"fausse" data: this.wGame.gui.playerData.position.mapPosition.outdoor
        //exemple extérieur taverne d'incarnam, ça considere un intérieur
        //this.wGame.isoEngine.on('mapLoaded', (packet) => {
        //    console.log("this.outdoor:"+this.outdoor+', this.wGame.gui.playerData.position.mapPosition.outdoor:'+this.wGame.gui.playerData.position.mapPosition.outdoor)
        //    if(!this.wGame.gui.playerData.position.mapPosition.outdoor && this.outdoor != this.wGame.gui.playerData.position.mapPosition.outdoor){
        //        this.resetMapColor()
        //        this.outdoor = false
        //    }else if(this.wGame.gui.playerData.position.mapPosition.outdoor && this.outdoor != this.wGame.gui.playerData.position.mapPosition.outdoor){
        //        this.action()
        //        this.outdoor = true
        //    }
        //})
    }

    private action(){
        if (this.cycleMode) {
            this.intervalUpdate = setInterval(() => {
                this.setMapColorFromTime(); // a  appeler toutes les minutes
            }, 1000*60);
        }else if(this.nightMode){
            if(this.nightModeCustom && this.nightModeCustomDate != null){
                const dateCustom = new Date(this.nightModeCustomDate)
                this.setMapColorFromTime(dateCustom.getHours(),dateCustom.getMinutes());//set custom
            }else{
                this.setMapColorFromTime(0,0);//set minuit
            }
        }
    }

    private setMapColorFromTime(h = -1,m = -1) {
        const d = new Date();
        if(h == -1 && m == -1){
            h = d.getHours();
            m = d.getMinutes();
        }
        const value = h + m / 60;
        const color =this.getColorForPercentage(this.percentColors, value);
        const bgColor = this.getColorForPercentage(this.bgPctColor, value);

        this.wGame.isoEngine.mapRenderer.background.hue = [bgColor.r, bgColor.g, bgColor.b, 1];
        this.wGame.isoEngine.mapRenderer.graphics.forEach((g) =>
            g?._sprites?.forEach((s) => {
                s.hue = [color.r, color.g, color.b, 1];
            })
        );
        this.wGame.isoEngine.mapRenderer.animatedElements.forEach((s) => {
            s.hue = [color.r, color.g, color.b, 1];
        });
    }

    private resetMapColor(){
        this.wGame.isoEngine.mapRenderer.background.hue = [1,1,1,1]
        this.wGame.isoEngine.mapRenderer.graphics.forEach((g) =>
            g?._sprites?.forEach((s) => {
                s.hue = [1, 1, 1, 1];
            })
        );
        this.wGame.isoEngine.mapRenderer.animatedElements.forEach((s) => {
            s.hue = [1, 1, 1, 1];
        });
    }

    private getColorForPercentage(colorsArr, pct) {
        let i;
        for (i = 1; i < colorsArr.length - 1; i++) {
            if (pct < colorsArr[i].pct) {
                break;
            }
        }
        const lower = colorsArr[i - 1];
        const upper = colorsArr[i];
        const range = upper.pct - lower.pct;
        const rangePct = (pct - lower.pct) / range;
        const pctLower = 1 - rangePct;
        const pctUpper = rangePct;
        const color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper) / 255,
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper) / 255,
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper) / 255,
        };
        return color;
    }

    public reset() {
        super.reset();
        if (this.cycleMode) {
            clearInterval(this.intervalUpdate)
        }else if(this.nightMode){
            
        }
    }

}