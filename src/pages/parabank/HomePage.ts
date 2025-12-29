import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { LocatorManager } from '../../utils/LocatorManager';

export class HomePage extends BasePage {
  // Locators
  private readonly accountOverviewLink: string;
  private readonly transferFundsLink: string;
  private readonly billPayLink: string;
  private readonly findTransactionsLink: string;
  private readonly updateContactInfoLink: string;
  private readonly logoutLink: string;
  private readonly welcomeMessage: string;
  private readonly accountNumberLinks: string;
  private readonly balanceAmounts: string;

  constructor(page: Page) {
    super(page);
    
    // Load locators from YAML
    const homePageLocators = LocatorManager.getPageLocators('parabank.homePage');
    
    if (!homePageLocators) {
      throw new Error('Failed to load locators for Parabank home page');
    }
    
    // Initialize locators
    this.accountOverviewLink = homePageLocators.accountOverviewLink;
    this.transferFundsLink = homePageLocators.transferFundsLink;
    this.billPayLink = homePageLocators.billPayLink;
    this.findTransactionsLink = homePageLocators.findTransactionsLink;
    this.updateContactInfoLink = homePageLocators.updateContactInfoLink;
    this.logoutLink = homePageLocators.logoutLink;
    this.welcomeMessage = homePageLocators.welcomeMessage;
    this.accountNumberLinks = homePageLocators.accountNumberLinks;
    this.balanceAmounts = homePageLocators.balanceAmounts;
  }

  /**
   * Navigate to home page
   */
  async navigate(): Promise<void> {
    await super.navigate();
  }

  /**
   * Click on Account Overview link
   */
  async clickAccountOverview(): Promise<void> {
    await this.click(this.accountOverviewLink);
  }

  /**
   * Click on Transfer Funds link
   */
  async clickTransferFunds(): Promise<void> {
    await this.click(this.transferFundsLink);
  }

  /**
   * Click on Bill Pay link
   */
  async clickBillPay(): Promise<void> {
    await this.click(this.billPayLink);
  }

  /**
   * Click on Find Transactions link
   */
  async clickFindTransactions(): Promise<void> {
    await this.click(this.findTransactionsLink);
  }

  /**
   * Click on Update Contact Info link
   */
  async clickUpdateContactInfo(): Promise<void> {
    await this.click(this.updateContactInfoLink);
  }

  /**
   * Click on Logout link
   */
  async logout(): Promise<void> {
    await this.click(this.logoutLink);
  }

  /**
   * Get welcome message
   * @returns Welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Get account numbers
   * @returns Array of account numbers
   */
  async getAccountNumbers(): Promise<string[]> {
    const elements = this.page.locator(this.accountNumberLinks);
    const count = await elements.count();
    const accountNumbers: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await elements.nth(i).textContent();
      if (text) {
        accountNumbers.push(text.trim());
      }
    }

    return accountNumbers;
  }

  /**
   * Get account balance
   * @param accountIndex - Index of account (0-based)
   * @returns Account balance as number
   */
  async getAccountBalance(accountIndex: number = 0): Promise<number> {
    const elements = this.page.locator(this.balanceAmounts);
    const text = await elements.nth(accountIndex).textContent();
    if (text) {
      // Remove currency symbols and commas, then convert to number
      const balance = parseFloat(text.replace(/[^\d.-]/g, ''));
      return balance;
    }
    return 0;
  }

  /**
   * Click on specific account number link
   * @param accountIndex - Index of account (0-based)
   */
  async clickAccountNumber(accountIndex: number = 0): Promise<void> {
    const elements = this.page.locator(this.accountNumberLinks);
    await elements.nth(accountIndex).click();
  }
}