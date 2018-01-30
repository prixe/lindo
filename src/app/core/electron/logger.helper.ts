import { environment } from 'environments/environment';

export class Logger {

    public static silly(...args) {
        LoggerLib.silly(...args);
    }

    public static verbose(...args) {
        console.log.apply(null, (!environment.production) ? args : []);
        LoggerLib.verbose(...args);
    }

    public static info(...args) {
        console.info.apply(null, (!environment.production) ? args : []);
        LoggerLib.info(...args);
    }

    public static debug(...args) {
        console.debug.apply(null, (!environment.production) ? args : []);
        LoggerLib.debug(...args);
    }

    public static warn(...args) {
        console.warn.apply(null, (!environment.production) ? args : []);
        LoggerLib.warn(...args);
    }

    public static error(...args) {
        console.error.apply(null, args);
        LoggerLib.error(...args);
    }
}
