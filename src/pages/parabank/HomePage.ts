import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class HomePage extends BasePage {
  // Locators
  private readonly accountOverviewLink = 'a[href="/parabank/overview.htm"]';
  private readonly transferFundsLink = 'a[href="/parabank/transfer.htm"]';
  private readonly billPayLink = 'a[href="/parabank/billpay.htm"]';
  private readonly findTransactionsLink = 'a[href="/parabank/findtrans.htm"]';
  private readonly updateContactInfoLink = 'a[href="/parabank/updateprofile.htm"]';
  private readonly logoutLink = 'a[href="/parabank/logout.htm"]';
  private readonly welcomeMessage = 'p:has-text("Welcome")';
  private readonly accountNumberLinks = 'a[href^="/parabank/activity.htm?id="]';
  private readonly balanceAmounts = '.balance';

  constructor(page: Page) {
    super(page);
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