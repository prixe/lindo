const settings = require('electron-settings');

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
        "Linux; Android 12; SM-G998U1",//s12 ultra 5g
        "Linux; Android 7.0; SAMSUNG-SM-G891A Build/NRD90M",
        "Linux; Android 7.0; SM-G930S Build/NRD90M",
        "Linux; Android 7.1.2; Nexus 5X Build/N2G47O",
        "Linux; Android 7.0; SM-G930S Build/NRD90M",
        "Linux; Android 9.0.0; SM-G960F Build/R16NW", // Samsung Galaxy S9
        "Linux; Android 7.0; SM-G892A Build/NRD90M", // Samsung Galaxy S8
        "Linux; Android 7.0; SM-G930VC Build/NRD90M", // Samsung Galaxy S7
        "Linux; Android 7.0; ZTE A2017U Build/NRD90M",
        "Linux; Android 7.0; Nexus 5X Build/NRD90M",
        "Linux; Android 7.0; Nexus 5X Build/NRD90M",
        "Linux; Android 7.1.1; K92 Build/NMF26V",
        "Linux; Android 7.1.1; G8231 Build/41.2.A.0.219", // Sony Xperia XZ
        "Linux; Android 7.1.1; ONEPLUS A5000 Build/NMF26X",
        "Linux; Android 7.0; LG-H840 Build/NRD90U"
    ];

    //Mobile Phone
    //Tablet
    //SELECT `Comment`, `Device_Name`, `Device_Code_Name`, `Device_Brand_Name`, `Device_Maker`, `isTablet`, `isMobileDevice` FROM `users` WHERE `isMobileDevice` = '""true""' OR `isTablet` = '""true""'

    private _tablets:String[] = [
        "Linux; Android 11; SM-T720",
        "Linux; Android 11; SM-T970",
        "Linux; Android 11; 21051182G",
        "Linux; Android 12; SM-T870",
        "Linux; Android 7.1.1; SM-T350",
        "Linux; Android 10; REALME RMX1911 Build/NMF26F",
        "Linux; Android 7.0.1; DSGP771 Build/32.2.A.0.253", // Sony Xperia Z4 Tablet
        "Linux; Android 7.0; SM-T827R4 Build/NRD90M", // Samsung Galaxy Tab S3
        "Linux; Android 7.0; Pixel C Build/NRD90M", // Google Pixel C
        "Linux; Android 7.1.2; SAMSUNG SM-T700 Build/N2G47E",
        "Linux; Android 7.1.2; SM-T805 Build/N2G47O",
        "Linux; Android 6.0.1; SM-T705Y Build/MMB29K",
        "Linux; Android 6.0.1; SM-T705 Build/MMB29K",
        "Linux; Android 7.0; SHIELD Tablet K1 Build/NRD90M",
        "Linux; Android 7.0; SAMSUNG SM-T820 Build/NRD90M",
    ];

    //https://en.wikipedia.org/wiki/Google_Chrome_version_history
    private _chromes:String[] = [
        "Chrome/98.0.4758.87",
        "Chrome/98.0.4758.82",
        "Chrome/97.0.4692.98",
        "Chrome/96.0.4664.96",
        "Chrome/95.0.4638.95",
        "Chrome/94.0.4606.94",
        "Chrome/93.0.4577.93",
        "Chrome/92.0.4515.92",
        "Chrome/91.0.4472.91",
    ];

    public getString(): string {
        if(settings.getSync('appVersion') != null)
            return this.userAgentString + " DofusTouch Client " + settings.getSync('appVersion');
        return this.userAgentString
    }

    private generateUserAgentString(): void {
        let mac = settings.getSync("macAddress");
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
