import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Configuration interface for the test framework
 */
export interface Config {
  baseURL: string;
  testUsername: string;
  testPassword: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  slowMo: number;
  pageTimeout: number;
  elementTimeout: number;
  logLevel: string;
  generateReport: boolean;
}

/**
 * Configuration class to manage framework settings
 */
export class Configuration {
  private static instance: Configuration;
  private config: Config;

  private constructor() {
    this.config = {
      baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank/',
      testUsername: process.env.TEST_USERNAME || '',
      testPassword: process.env.TEST_PASSWORD || '',
      browser: (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium',
      headless: process.env.HEADLESS?.toLowerCase() === 'true',
      slowMo: parseInt(process.env.SLOW_MO || '0', 10),
      pageTimeout: parseInt(process.env.PAGE_TIMEOUT || '30000', 10),
      elementTimeout: parseInt(process.env.ELEMENT_TIMEOUT || '5000', 10),
      logLevel: process.env.LOG_LEVEL || 'info',
      generateReport: process.env.GENERATE_REPORT?.toLowerCase() === 'true'
    };

    // Validate required configuration
    this.validateConfig();
  }

  /**
   * Get singleton instance of Configuration
   */
  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }

  /**
   * Validate required configuration parameters
   */
  private validateConfig(): void {
    const requiredParams: Array<keyof Config> = ['baseURL'];
    
    requiredParams.forEach(param => {
      if (!this.config[param]) {
        throw new Error(`Required configuration parameter '${param}' is missing or empty`);
      }
    });
  }

  /**
   * Get current configuration
   */
  public getConfig(): Config {
    return { ...this.config };
  }

  /**
   * Update configuration (for testing purposes)
   */
  public updateConfig(updates: Partial<Config>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get base URL
   */
  public getBaseURL(): string {
    return this.config.baseURL;
  }

  /**
   * Get test username
   */
  public getTestUsername(): string {
    return this.config.testUsername;
  }

  /**
   * Get test password
   */
  public getTestPassword(): string {
    return this.config.testPassword;
  }

  /**
   * Get browser type
   */
  public getBrowser(): 'chromium' | 'firefox' | 'webkit' {
    return this.config.browser;
  }

  /**
   * Get headless mode setting
   */
  public isHeadless(): boolean {
    return this.config.headless;
  }

  /**
   * Get slow motion setting
   */
  public getSlowMo(): number {
    return this.config.slowMo;
  }

  /**
   * Get page timeout
   */
  public getPageTimeout(): number {
    return this.config.pageTimeout;
  }

  /**
   * Get element timeout
   */
  public getElementTimeout(): number {
    return this.config.elementTimeout;
  }

  /**
   * Get log level
   */
  public getLogLevel(): string {
    return this.config.logLevel;
  }

  /**
   * Get report generation setting
   */
  public shouldGenerateReport(): boolean {
    return this.config.generateReport;
  }
}

// Export singleton instance
export const config = Configuration.getInstance();
