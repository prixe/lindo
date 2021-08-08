import {environment} from "@env/environment";

export class Logger {

    public static verbose(...args) {
        LoggerLindo.verbose(...args);
        if (environment.production) console.log.apply(null, args);
    }

    public static info(...args) {
        LoggerLindo.info(...args);
        if (environment.production) console.info.apply(null, args);
    }

    public static debug(...args) {
        LoggerLindo.debug(...args);
        if (environment.production) console.debug.apply(null, args);
    }

    public static warn(...args) {
        LoggerLindo.warn(...args);
        if (environment.production) console.warn.apply(null, args);
    }

    public static error(...args) {
        LoggerLindo.error(...args);
        console.error.apply(null, args);
    }
}
