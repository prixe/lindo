import * as winston from 'winston';

export const Logger = new (winston.Logger)({
    exitOnError: false,
    transports: [
        new (winston.transports.Console)({
            handleExceptions: true,
            colorize: true,
            level: 'silly'
        }),
        //new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});