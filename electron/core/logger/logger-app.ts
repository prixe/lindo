import * as winston from 'winston';

export const Logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
            handleExceptions: true,
            level: 'silly'
        }),
  ],
  format: winston.format.combine(
    winston.format.colorize({message: false}),
    winston.format.simple()
  ),
  exitOnError: false, // do not exit on handled exceptions
});
