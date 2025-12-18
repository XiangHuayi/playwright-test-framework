import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { config } from '../config/config';

// Ensure logs directory exists
const logsDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Logger interface for the test framework
 */
export interface ILogger {
  error(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  verbose(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
  silly(message: string, ...meta: any[]): void;
}

/**
 * Logger class to handle logging functionality
 */
export class Logger implements ILogger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    // Create Winston logger configuration
    this.logger = winston.createLogger({
      level: config.getLogLevel(),
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({
          stack: true
        }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'bilibili-test-framework' },
      transports: [
        // File transport - Error logs
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
          maxsize: 5 * 1024 * 1024, // 5MB
          maxFiles: 5,
          tailable: true
        }),
        // File transport - Combined logs
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          tailable: true
        })
      ]
    });

    // Add console transport in non-CI environments
    if (!process.env.CI) {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      );
    }
  }

  /**
   * Get singleton instance of Logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log error message
   * @param message - Error message
   * @param meta - Additional metadata
   */
  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  /**
   * Log warning message
   * @param message - Warning message
   * @param meta - Additional metadata
   */
  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  /**
   * Log info message
   * @param message - Info message
   * @param meta - Additional metadata
   */
  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  /**
   * Log verbose message
   * @param message - Verbose message
   * @param meta - Additional metadata
   */
  verbose(message: string, ...meta: any[]): void {
    this.logger.verbose(message, ...meta);
  }

  /**
   * Log debug message
   * @param message - Debug message
   * @param meta - Additional metadata
   */
  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  /**
   * Log silly message
   * @param message - Silly message
   * @param meta - Additional metadata
   */
  silly(message: string, ...meta: any[]): void {
    this.logger.silly(message, ...meta);
  }

  /**
   * Set log level
   * @param level - Log level to set
   */
  setLevel(level: string): void {
    this.logger.level = level;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
