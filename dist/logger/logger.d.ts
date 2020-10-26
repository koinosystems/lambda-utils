export declare enum LoggerLevel {
    fatal = 0,
    error = 1,
    warn = 2,
    info = 3,
    debug = 4,
    trace = 5
}
export declare abstract class Logger {
    abstract log(level: LoggerLevel, message?: any, ...optionalParams: any[]): void;
    fatal(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    trace(message?: any, ...optionalParams: any[]): void;
}
