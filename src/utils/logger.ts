import winston from 'winston';

/**
 * Logger utility class.
 */
export class Logger {
  public static logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  /**
   * Logs an info message.
   * @param message - The message to log.
   * @param meta - Optional metadata.
   */
  public static info(message: string, ...meta: any[]) {
    this.logger.info(message, ...meta);
  }

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @param meta - Optional metadata.
   */
  public static warn(message: string, ...meta: any[]) {
    this.logger.warn(message, ...meta);
  }

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param meta - Optional metadata.
   */
  public static error(message: string, ...meta: any[]) {
    this.logger.error(message, ...meta);
  }
}
