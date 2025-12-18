import { Page, Locator, FrameLocator } from '@playwright/test';
import { config } from '../../config/config';

/**
 * BasePage class provides common functionality for all page objects
 */
export class BasePage {
  protected page: Page;
  protected baseURL: string;
  protected pageTimeout: number;
  protected elementTimeout: number;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = config.getBaseURL();
    this.pageTimeout = config.getPageTimeout();
    this.elementTimeout = config.getElementTimeout();
  }

  /**
   * Navigate to the specified URL
   * @param url - Relative or absolute URL to navigate to
   */
  async navigate(url: string = ''): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    await this.page.goto(fullUrl, { timeout: this.pageTimeout });
  }

  /**
   * Wait for an element to be visible
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForVisible(locator: any, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: 'visible', timeout: timeout || this.elementTimeout });
  }

  /**
   * Wait for an element to be hidden
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForHidden(locator: Locator | string, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: 'hidden', timeout: timeout || this.elementTimeout });
  }

  /**
   * Click on an element
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async click(locator: Locator | string, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    await element.click({ timeout: timeout || this.elementTimeout });
  }

  /**
   * Fill text into an input field
   * @param locator - Element locator
   * @param text - Text to fill
   * @param timeout - Optional timeout in milliseconds
   */
  async fill(locator: Locator | string, text: string, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    await element.fill(text, { timeout: timeout || this.elementTimeout });
  }

  /**
   * Type text into an input field (simulates real typing)
   * @param locator - Element locator
   * @param text - Text to type
   * @param timeout - Optional timeout in milliseconds
   */
  async type(locator: Locator | string, text: string, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    await element.type(text, { timeout: timeout || this.elementTimeout });
  }

  /**
   * Get text content of an element
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   * @returns Text content of the element
   */
  async getText(locator: Locator | string, timeout?: number): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    const textContent = await element.textContent();
    return textContent || '';
  }

  /**
   * Get value of an input field
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   * @returns Value of the input field
   */
  async getValue(locator: Locator | string, timeout?: number): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    return element.inputValue();
  }

  /**
   * Check if an element is visible
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   * @returns True if element is visible, false otherwise
   */
  async isVisible(locator: Locator | string, timeout?: number): Promise<boolean> {
    try {
      const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
      await this.waitForVisible(element, timeout);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if an element is enabled
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   * @returns True if element is enabled, false otherwise
   */
  async isEnabled(locator: Locator | string, timeout?: number): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    return element.isEnabled();
  }

  /**
   * Select an option from a dropdown
   * @param locator - Element locator
   * @param value - Option value or label to select
   * @param timeout - Optional timeout in milliseconds
   */
  async selectOption(locator: Locator | string, value: string, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    await element.selectOption(value);
  }

  /**
   * Check a checkbox
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async check(locator: Locator | string, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    await element.check();
  }

  /**
   * Uncheck a checkbox
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async uncheck(locator: Locator | string, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await this.waitForVisible(element, timeout);
    await element.uncheck();
  }

  /**
   * Get the current URL
   * @returns Current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the page title
   * @returns Page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for page load to complete
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load', { timeout: this.pageTimeout });
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: this.pageTimeout });
  }

  /**
   * Take a screenshot
   * @param name - Screenshot name
   * @returns Screenshot buffer
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `${name}.png` });
  }

  /**
   * Switch to a frame
   * @param locator - Frame locator
   * @returns FrameLocator object
   */
  async switchToFrame(locator: string | FrameLocator): Promise<FrameLocator> {
    const frame = typeof locator === 'string' ? this.page.frameLocator(locator) : locator;
    return frame;
  }

  /**
   * Scroll to an element
   * @param locator - Element locator
   */
  async scrollToElement(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Hover over an element
   * @param locator - Element locator
   */
  async hover(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.hover();
  }
}
