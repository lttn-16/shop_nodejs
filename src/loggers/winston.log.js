const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const { v4: uuid } = require('uuid')

class MyLogger {
    constructor() {
        const formatPrint = format.printf(
            ({ level, message, context, requestId, timestamp, metadata }) => {
                return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`;
            },
        );

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                formatPrint,
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: "src/logs",
                    filename: "application-%DATE%.info.log",
                    datePattern: "YYYY-MM-DD-HH-mm", // 20, 21 YYYY-MM-DD-HH-mm
                    zippedArchive: true, // true: backup log zipped archive
                    maxSize: "1m", // dung luong file log
                    maxFiles: "14d", // neu dat thi se xoa log trong vong 14 ngay
                    format: format.combine(
                        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                        formatPrint,
                    ),
                    level: "info",
                }),
                new transports.DailyRotateFile({
                    dirname: "src/logs",
                    filename: "application-%DATE%.error.log",
                    datePattern: "YYYY-MM-DD-HH-mm", // 20, 21 YYYY-MM-DD-HH-mm
                    zippedArchive: true, // true: backup log zipped archive
                    maxSize: "1m", // dung luong file log
                    maxFiles: "14d", // neu dat thi se xoa log trong vong 14 ngay
                    format: format.combine(
                        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                        formatPrint,
                    ),
                    level: "error",
                }),
            ],
        });
    }

    commonParams(params) {
        let context, req, metadata;
        if (!Array.isArray(params)) {
            context = params;
        } else {
            [context, req, metadata] = params;
        }

        const requestId = req?.requestId || uuid();
        return {
            requestId,
            context,
            metadata,
        };
    }

    log(message, params) {
        const formatParams = this.commonParams(params)
        const logObj = Object.assign({ message }, formatParams);
        this.logger.info(logObj);
    }

    error(message, params) {
        const formatParams = this.commonParams(params)
        const logObj = Object.assign({ message }, formatParams);
        this.logger.error(logObj);
    }
}

module.exports = new MyLogger();
