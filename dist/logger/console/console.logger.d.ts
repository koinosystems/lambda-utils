import { Logger, LoggerLevel } from '../logger';
export declare class ConsoleLogger extends Logger {
    log(level: LoggerLevel, message?: any, error?: Error): void;
}
