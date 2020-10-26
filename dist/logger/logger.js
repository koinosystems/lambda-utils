"use strict";
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LoggerLevel = void 0;
var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["fatal"] = 0] = "fatal";
    LoggerLevel[LoggerLevel["error"] = 1] = "error";
    LoggerLevel[LoggerLevel["warn"] = 2] = "warn";
    LoggerLevel[LoggerLevel["info"] = 3] = "info";
    LoggerLevel[LoggerLevel["debug"] = 4] = "debug";
    LoggerLevel[LoggerLevel["trace"] = 5] = "trace";
})(LoggerLevel = exports.LoggerLevel || (exports.LoggerLevel = {}));
class Logger {
    fatal(message, ...optionalParams) {
        this.log(LoggerLevel.fatal, message, optionalParams);
    }
    error(message, ...optionalParams) {
        this.log(LoggerLevel.error, message, optionalParams);
    }
    warn(message, ...optionalParams) {
        this.log(LoggerLevel.warn, message, optionalParams);
    }
    info(message, ...optionalParams) {
        this.log(LoggerLevel.info, message, optionalParams);
    }
    debug(message, ...optionalParams) {
        this.log(LoggerLevel.debug, message, optionalParams);
    }
    trace(message, ...optionalParams) {
        this.log(LoggerLevel.trace, message, optionalParams);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map