import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { LocatorManager } from '../../utils/LocatorManager';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: string;
  private readonly passwordInput: string;
  private readonly loginButton: string;
  private readonly registerLink: string;
  private readonly errorMessage: string;
  private readonly welcomeMessage: string;

  constructor(page: Page) {
    super(page);
    
    // Load locators from YAML
    const loginPageLocators = LocatorManager.getPageLocators('parabank.loginPage');
    
    if (!loginPageLocators) {
      throw new Error('Failed to load locators for Parabank login page');
    }
    
    // Initialize locators
    this.usernameInput = loginPageLocators.usernameInput;
    this.passwordInput = loginPageLocators.passwordInput;
    this.loginButton = loginPageLocators.loginButton;
    this.registerLink = loginPageLocators.registerLink;
    this.errorMessage = loginPageLocators.errorMessage;
    this.welcomeMessage = loginPageLocators.welcomeMessage;
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