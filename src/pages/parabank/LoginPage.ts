import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput = '.login input[name="username"]';
  private readonly passwordInput = '.login input[name="password"]';
  private readonly loginButton = '.login [type="submit"]';
  private readonly registerLink = 'a[href="/parabank/register.htm"]';
  private readonly errorMessage = '.error';
  private readonly welcomeMessage = '.title';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await super.navigate();
  }

  /**
   * Login with username and password
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Click on register link
   */
  async clickRegisterLink(): Promise<void> {
    await this.click(this.registerLink);
  }

  /**
   * Get error message
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Get welcome message
   * @returns Welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Check if login button is enabled
   * @returns True if login button is enabled, false otherwise
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }
}