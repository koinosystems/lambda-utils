import { Logger, LoggerLevel } from '../logger';

export class ConsoleLogger extends Logger {
  log(level: LoggerLevel, message?: any, error?: Error): void {
    if (level === LoggerLevel.error || error) {
      console.error(message, error);
    }
    console.log(level, message, error);
  }
}
