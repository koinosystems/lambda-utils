"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const logger_1 = require("../logger");
class ConsoleLogger extends logger_1.Logger {
    log(level, message, error) {
        if (level === logger_1.LoggerLevel.error || error) {
            console.error(message, error);
        }
        console.log(level, message, error);
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=console.logger.js.map