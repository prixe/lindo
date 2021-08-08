class AppPreferences {

    public store(success: () => void, fail: (err: Error) => void, key: string, value: string) {

        // @ts-ignore
        electronSettings.setSync('appPreferences.' + key, value).then(() => {
            return success();
        }).catch((err: Error) => {
            return fail(err);
        });
    }

    public fetch(success: (val: any) => void, fail: (err: Error) => void, key: string) {

        // @ts-ignore
        electronSettings.getSync('appPreferences.' + key).then((val: any) => {
            return success(val);
        }).catch((err: Error) => {
            return fail(err);
        });
    }

    public remove(success: () => void, fail: (err:Error) => void, key: string) {

        // @ts-ignore
        electronSettings.delete(key).then(() => {
            return success();
        }).catch((err:Error) => {
            return fail(err);
        });
    }

    public show(success: () => void, fail: () => void) {
        return this.fetch(success, fail, 'appPreferences');
    }
}

export class Plugins {
    private wGame: Window | any;
    public appPreferences: AppPreferences;

    constructor(wGame: Window | any){
        this.wGame = wGame;

        this.appPreferences = new AppPreferences();
    }
}