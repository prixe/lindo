const settings = require('electron-settings');
import { Logger } from '../core/logger/logger-electron';

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
        "Linux; Android 8.0.0; SM-G960F Build/R16NW", // Samsung Galaxy S9
        "Linux; Android 7.0; SM-G892A Build/NRD90M", // Samsung Galaxy S8
        "Linux; Android 7.0; SM-G930VC Build/NRD90M", // Samsung Galaxy S7
        "Linux; Android 7.0; ZTE A2017U Build/NRD90M",
        "Linux; Android 7.0; Nexus 5X Build/NRD90M",
        "Linux; Android 6.0.1; SM-G920V Build/MMB29K", // Samsung Galaxy S6
        "Linux; Android 6.0.1; Z988 Build/MMB29M",
        "Linux; Android 7.0; Nexus 5X Build/NRD90M",
        "Linux; Android 6.0.1; SM-G928X Build/LMY47X", // Samsung Galaxy S6 Edge Plus
        "Linux; Android 6.0.1; Nexus 6P Build/MMB29P", // Nexus 6P
        "Linux; Android 7.1.1; K92 Build/NMF26V",
        "Linux; Android 7.1.1; G8231 Build/41.2.A.0.219", // Sony Xperia XZ
        "Linux; Android 6.0; HTC One X10 Build/MRA58K", // HTC One X10
        "Linux; Android 7.1.1; ONEPLUS A5000 Build/NMF26X",
        "Linux; Android 5.1.1; SM-G928X Build/LMY47X",
        "Linux; Android 6.0.1; Nexus 6P Build/MMB29P",
        "Linux; Android 6.0.1; E6653 Build/32.2.A.0.253",
        "Linux; Android 6.0.1; E6653 Build/32.2.A.0.253", // Sony Xperia Z5
        "Linux; Android 6.0.1; SM-G920V Build/MMB29K",
        "Linux; Android 7.0; LG-H840 Build/NRD90U"
    ];

    private _tablets:String[] = [
        "Linux; Android 4.4.4; DUK-AL20 Build/KTU84P",
        "Linux; Android 5.1; LPT_200AR Build/LMY47I",
        "Linux; Android 5.1.1; HUAWEI M2-801L Build/HUAWEIM2-801L",
        "Linux; Android 7.0; SM-T827R4 Build/NRD90M", // Samsung Galaxy Tab S3
        "Linux; Android 7.0; Pixel C Build/NRD90M", // Google Pixel C
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
        "Linux; Android 5.0.2; LG-V410/V41020c Build/LRX22G", // LG G Pad 7.0
        "Linux; Android 5.0.1; SHIELD Tablet Build/LRX22C",
        "Linux; Android 6.0; SHIELD Tablet K1 Build/MRA58K",
        "Linux; Android 7.0; SHIELD Tablet K1 Build/NRD90M",
        "Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G",
        "Linux; Android 4.4.2; SM-T325 Build/KOT49H",
        "Linux; Android 5.1; SM-T330 Build/IMM76D",
        "Linux; Android 7.0; SAMSUNG SM-T820 Build/NRD90M",
        "Linux; Android 6.0; BTV-DL09 Build/HUAWEIBEETHOVEN-DL09"
    ];

    private _chromes:String[] = [
        "Chrome/72.0.3626.121",
        "Chrome/71.0.3578.80",
        "Chrome/71.0.3578.98",
        "Chrome/70.0.3538.102",
        "Chrome/70.0.3538.80",
        "Chrome/70.0.3538.67",
        "Chrome/70.0.3538.77",
        "Chrome/70.0.3538.110",
        "Chrome/69.0.3497.100",
        "Chrome/69.0.3497.81",
        "Chrome/69.0.3497.92",
        "Chrome/68.0.3440.91",
        "Chrome/68.0.3440.106",
        "Chrome/68.0.3440.84",
        "Chrome/68.0.3440.1805",
        "Chrome/68.0.3440.75",
        "Chrome/67.0.3396.87",
        "Chrome/67.0.3396.99",
        "Chrome/67.0.3396.79",
        "Chrome/67.0.3396.62",
        "Chrome/66.0.3359.117",
        "Chrome/66.0.3359.139",
        "Chrome/66.0.3359.181",
        "Chrome/66.0.3359.158",
        "Chrome/66.0.3359.170",
        "Chrome/65.0.3325.181",
        "Chrome/65.0.3325.109",
        "Chrome/65.0.3325.162",
        "Chrome/64.0.3282.186",
        "Chrome/64.0.3282.140",
        "Chrome/64.0.3282.137",
        "Chrome/64.0.3282.167",
        "Chrome/64.0.3282.119",
        "Chrome/63.0.3239.83",
        "Chrome/63.0.3239.111",
        "Chrome/63.0.3239.108",
        "Chrome/63.0.3239.84",
        "Chrome/63.0.3239.132",
        "Chrome/62.0.3202.94",
        "Chrome/62.0.3202.89",
        "Chrome/62.0.3202.84",
        "Chrome/62.0.3202.62",
        "Chrome/61.0.3163.100",
        "Chrome/61.0.3163.79",
        "Chrome/61.0.3163.98",
        "Chrome/60.0.3112.78",
        "Chrome/60.0.3112.90",
        "Chrome/60.0.3112.113",
        "Chrome/60.0.3112.116",
        "Chrome/60.0.3112.101",
        "Chrome/59.0.3071.115",
        "Chrome/59.0.3071.125",
        "Chrome/58.0.3029.110"
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
        let randomChrome = seed % this._chromes.length;
        let device = devicesList[randomDevice];
        let chrome = this._chromes[randomChrome];
        chrome = chrome.replace(/(\w+\/)((\d+\.){3})(\d+)/, "$1$2" + Math.round(seed % 90 + 60));
        this.userAgentString = "Mozilla/5.0 (" + device + "; wv)"
            + " AppleWebKit/537.36 (KHTML, like Gecko) "
            + chrome
            + " Mobile Safari/537.36";
    }
}
