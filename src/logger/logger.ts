/* eslint-disable no-unused-vars */

export enum LoggerLevel {
  fatal,
  error,
  warn,
  info,
  debug,
  trace,
}

export abstract class Logger {
  abstract log(level: LoggerLevel, message?: any, ...optionalParams: any[]): void;

  fatal(message?: any, ...optionalParams: any[]): void {
    this.log(LoggerLevel.fatal, message, optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    this.log(LoggerLevel.error, message, optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    this.log(LoggerLevel.warn, message, optionalParams);
  }

  info(message?: any, ...optionalParams: any[]): void {
    this.log(LoggerLevel.info, message, optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]): void {
    this.log(LoggerLevel.debug, message, optionalParams);
  }

  trace(message?: any, ...optionalParams: any[]): void {
    this.log(LoggerLevel.trace, message, optionalParams);
  }
}
