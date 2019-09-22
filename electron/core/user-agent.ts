const settings = require('electron-settings');
import { Logger } from '../core/logger/logger-electron';

interface Crosswalk {
    chrome: String;
    crosswalk: String;
}

export class UserAgent {

    private subSeed: number;
    private userAgentString: string;

    constructor(
        subSeed: number
    ) {
        this.subSeed = subSeed;
        this.generateUserAgentString();
    }

    private _phones:String[] = [
        "Linux; Android 6.0.1; SM-G900F Build/MMB29M",
        "Linux; Android 7.0; SAMSUNG-SM-G891A Build/NRD90M",
        "Linux; Android 7.0; SM-G930S Build/NRD90M",
        "Linux; Android 7.1.2; Nexus 5X Build/N2G47O",
        "Linux; Android 7.0; SM-G930S Build/NRD90M",
        "Linux; Android 6.0.1; XT1254 Build/MCG24.251-5-5",
        "Linux; Android 4.3; GT-I9300 Build/JSS15J",
        "Linux; Android 6.0; LG-F460K Build/MRA58K",
        "Linux; Android 5.0.1; ALE-L21 Build/HuaweiALE-L21",
        "Linux; Android 7.0; ZTE A2017U Build/NRD90M",
        "Linux; Android 7.0; Nexus 5X Build/NRD90M",
        "Linux; Android 4.3; GT-I9300 Build/JSS15J",
        "Linux; Android 6.0.1; Z988 Build/MMB29M",
        "Linux; Android 7.0; Nexus 5X Build/NRD90M",
        "Linux; Android 4.1.2; GT-I8552 Build/JZO54K",
        "Linux; Android 5.1; LPT_200AR Build/LMY47I",
        "Linux; Android 7.1.1; K92 Build/NMF26V",
        "Linux; Android 4.2.2; GT-I9295 Build/JDQ39",
        "Linux; Android 6.0; HTC One_M8 Build/MRA58K6",
        "Linux; Android 7.1.1; ONEPLUS A5000 Build/NMF26X",
        "Linux; Android 5.1.1; SM-G928X Build/LMY47X",
        "Linux; Android 6.0.1; Nexus 6P Build/MMB29P",
        "Linux; Android 6.0.1; E6653 Build/32.2.A.0.253",
        "Linux; Android 6.0; HTC One M9 Build/MRA58K",
        "Linux; Android 6.0.1; SM-G920V Build/MMB29K",
        "Linux; Android 7.0; LG-H840 Build/NRD90U"
    ];

    private _tablets:String[] = [
        "Linux; Android 4.4.4; DUK-AL20 Build/KTU84P",
        "Linux; Android 5.1; LPT_200AR Build/LMY47I",
        "Linux; Android 5.1.1; HUAWEI M2-801L Build/HUAWEIM2-801L",
        "Linux; Android 4.0.4; SM-T330 Build/IMM76D",
        "Linux; Android 7.0; Pixel C Build/NRD90M",
        "Linux; Android 7.1.2; SAMSUNG SM-T700 Build/N2G47E",
        "Linux; Android 7.1.2; SM-T805 Build/N2G47O",
        "Linux; Android 6.0.1; SAMSUNG SM-T805 Build/MMB29K",
        "Linux; Android 6.0.1; SM-T705Y Build/MMB29K",
        "Linux; Android 6.0.1; SM-T705 Build/MMB29K",
        "Linux; Android 6.0.1; SM-T800 Build/MMB29U",
        "Linux; Android 5.0.2; SM-T800 Build/LRX22G",
        "Linux; Android 6.0.1; SM-T800 Build/MMB29K",
        "Linux; Android 5.0.2; SAMSUNG SM-T805Y Build/LRX22G",
        "Linux; Android 6.0.1; SGP771 Build/32.2.A.0.253",
        "Linux; Android 5.1.1; SHIELD Tablet Build/LMY48C",
        "Linux; Android 5.0; SHIELD Tablet Build/LRX21M",
        "Linux; Android 4.4.2; SHIELD Tablet Build/KOT49H",
        "Linux; Android 5.0.1; SHIELD Tablet Build/LRX22C",
        "Linux; Android 6.0; SHIELD Tablet K1 Build/MRA58K",
        "Linux; Android 7.0; SHIELD Tablet K1 Build/NRD90M",
        "Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G",
        "Linux; Android 4.4.2; SM-T325 Build/KOT49H",
        "Linux; Android 5.1; SM-T330 Build/IMM76D",
        "Linux; Android 7.0; SAMSUNG SM-T820 Build/NRD90M",
        "Linux; Android 6.0; BTV-DL09 Build/HUAWEIBEETHOVEN-DL09"
    ];

    private _crosswalks:Crosswalk[] = [
        {
            chrome: "Chrome/44.0.2403.157",
            crosswalk: "Crosswalk/15.44.384.13"
        },
        {
            chrome: "Chrome/53.0.2785.143",
            crosswalk: "Crosswalk/23.53.589.4"
        },
        {
            chrome: "Chrome/43.0.2357.18",
            crosswalk: "Crosswalk/14.43.336.0"
        },
        {
            chrome: "Chrome/50.0.2661.102",
            crosswalk: "Crosswalk/20.50.533.12"
        },
        {
            chrome: "Chrome/50.0.2661.102",
            crosswalk: "Crosswalk/20.50.533.27"
        },
        {
            chrome: "Chrome/53.0.2785.143",
            crosswalk: "Crosswalk/23.53.589.2"
        },
        {
            chrome: "Chrome/40.0.2214.91",
            crosswalk: "Crosswalk/11.40.277.7"
        },
        {
            chrome: "Chrome/43.0.2357.130",
            crosswalk: "Crosswalk/14.43.343.22"
        },
        {
            chrome: "Chrome/40.0.2214.91",
            crosswalk: "Crosswalk/11.40.277.7"
        },
        {
            chrome: "Chrome/50.0.2661.102",
            crosswalk: "Crosswalk/20.50.533.27"
        },
        {
            chrome: "Chrome/50.0.2661.102",
            crosswalk: "Crosswalk/20.50.533.12"
        },
        {
            chrome: "Chrome/43.0.2357.130",
            crosswalk: "Crosswalk/14.43.343.22"
        },
        {
            chrome: "Chrome/50.0.2661.102",
            crosswalk: "Crosswalk/20.50.533.19"
        },
        {
            chrome: "Chrome/43.0.2357.130",
            crosswalk: "Crosswalk/14.43.343.22"
        },
        {
            chrome: "Chrome/44.0.2403.157",
            crosswalk: "Crosswalk/15.44.384.6"
        },
        {
            chrome: "Chrome/50.0.2661.102",
            crosswalk: "Crosswalk/20.50.533.11"
        },
        {
            chrome: "Chrome/40.0.2214.28",
            crosswalk: "Crosswalk/11.40.277.1"
        },
        {
            chrome: "Chrome/50.0.2661.102",
            crosswalk: "Crosswalk/20.50.533.11"
        },
        {
            chrome: "Chrome/45.0.2454.101",
            crosswalk: "Crosswalk/16.45.421.19"
        },
        {
            chrome: "Chrome/39.0.2171.71",
            crosswalk: "Crosswalk/10.39.235.15"
        },
        {
            chrome: "Chrome/43.0.2357.130",
            crosswalk: "Crosswalk/14.43.343.22"
        },
        {
            chrome: "Chrome/45.0.2454.101",
            crosswalk: "Crosswalk/16.45.421.196"
        },
        {
            chrome: "Chrome/44.0.2403.157",
            crosswalk: "Crosswalk/15.44.384.13"
        }
    ];

    public getString(): string {
        return this.userAgentString;
    }

    private generateUserAgentString(): void {
        let mac = settings.get("macAddress");
        let seed = 0, i, chr;
        for (i = 0; i < mac.length; i++) {
            chr   = mac.charCodeAt(i);
            seed  = ((seed << 5) - seed) + chr;
            seed |= 0; // Convert to 32bit integer
        }
        seed = Math.abs(seed);
        seed += this.subSeed * Math.floor(seed / Math.pow(10, Math.floor(Math.log10(seed))));


        let deviceType = seed % 2 == 0 ? 'phone' : 'tablet';
        let devicesList = deviceType == 'phone' ? this._phones : this._tablets;
        let randomDevice = seed % devicesList.length;
        let randomCrosswalk = seed % this._crosswalks.length;
        let firstMobile = deviceType == 'phone' ? (seed % 5 <= 2 ? ' Mobile' : '') : '';
        let secondMobile = deviceType == 'phone' ? (seed % 5 >= 2 ? ' Mobile' : '') : '';
        this.userAgentString = "Mozilla/5.0 (" + devicesList[randomDevice] + ")"
            + " AppleWebKit/537.36 (KHTML, like Gecko) "
            + this._crosswalks[/*randomCrosswalk*/0].chrome + firstMobile + ' '
            + this._crosswalks[/*randomCrosswalk*/0].crosswalk + secondMobile + " Safari/537.36";
    }
}
