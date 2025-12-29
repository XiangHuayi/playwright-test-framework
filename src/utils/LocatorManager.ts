import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { logger } from './logger';

/**
 * LocatorManager class to load and manage locators from YAML files
 */
export class LocatorManager {
  private static locators: any = null;

  /**
   * Load locators from YAML file
   * @param filePath - Path to the YAML file containing locators
   */
  public static loadLocators(filePath: string = 'src/locators/locators.yaml'): void {
    try {
      const fullPath = `${process.cwd()}/${filePath}`;
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      this.locators = yaml.load(fileContent);
      logger.info(`Locators loaded successfully from ${filePath}`);
    } catch (error) {
      logger.error(`Failed to load locators from ${filePath}: ${error}`);
      throw error;
    }
  }

  /**
   * Get a specific locator by path
   * @param path - Path to the locator (e.g., 'bilibili.loginPage.usernameInput')
   * @returns Locator string or null if not found
   */
  public static getLocator(path: string): string | null {
    if (!this.locators) {
      this.loadLocators();
    }

    try {
      const keys = path.split('.');
      let current: any = this.locators;

      for (const key of keys) {
        if (current[key] === undefined) {
          logger.warn(`Locator not found for path: ${path}`);
          return null;
        }
        current = current[key];
      }

      return current;
    } catch (error) {
      logger.error(`Failed to get locator for path ${path}: ${error}`);
      return null;
    }
  }

  /**
   * Get all locators for a specific page
   * @param pagePath - Path to the page (e.g., 'bilibili.loginPage')
   * @returns Object containing all locators for the page or null if not found
   */
  public static getPageLocators(pagePath: string): Record<string, string> | null {
    if (!this.locators) {
      this.loadLocators();
    }

    try {
      const keys = pagePath.split('.');
      let current: any = this.locators;

      for (const key of keys) {
        if (current[key] === undefined) {
          logger.warn(`Page locators not found for path: ${pagePath}`);
          return null;
        }
        current = current[key];
      }

      return current;
    } catch (error) {
      logger.error(`Failed to get page locators for path ${pagePath}: ${error}`);
      return null;
    }
  }
}