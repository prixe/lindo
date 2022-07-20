import path from 'path'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { LOGS_PATH } from '../constants'

console.log('LOGS_PATH', LOGS_PATH)

const prettyJson = winston.format.printf((info) => {
  if (info.message.constructor === Object) {
    info.message = JSON.stringify(info.message, null, 4)
  }
  return `${info.level}: ${info.message}`
})

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      // handleExceptions: true,
      // handleRejections: true,
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.splat(),
        winston.format.simple(),
        prettyJson
      )
    }),
    new DailyRotateFile({
      filename: path.join(LOGS_PATH, 'logs-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '28d',
      handleExceptions: true,
      handleRejections: true,
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf((info) => `${info.level} ${info.timestamp} : ${info.message}`)
      )
    })
  ],
  exitOnError: false
})

export const rendererLogger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: path.join(LOGS_PATH, 'renderer-logs-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '28d',
      handleExceptions: true,
      handleRejections: true,
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf((info) => `${info.level} ${info.timestamp} : ${info.message}`)
      )
    })
  ],
  exitOnError: false
})
