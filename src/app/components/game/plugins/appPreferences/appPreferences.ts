
export class AppPreferences {
    constructor() {

    }

    public store(success: () => void, fail: (err: Error) => void, key: string, value: string) {
        electronSettings.set('appPreferences.' + key, value).then(() => {
            return success();
        }).catch((err: Error) => {
            return fail(err);
        });
    }

    public fetch(success: (val: any) => void, fail: (err: Error) => void, key: string) {
        electronSettings.get('appPreferences.' + key).then((val: any) => {
            return success(val);
        }).catch((err: Error) => {
            return fail(err);
        });
    }

    public remove(success: () => void, fail: (err:Error) => void, key: string) {
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