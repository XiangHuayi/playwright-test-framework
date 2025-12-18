import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class TransferFundsPage extends BasePage {
  // Locators
  private readonly amountInput = '#amount';
  private readonly fromAccountSelect = '#fromAccountId';
  private readonly toAccountSelect = '#toAccountId';
  private readonly transferButton = '.button[value="Transfer"]';
  private readonly successMessage = '.title';
  private readonly errorMessage = '.error';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to transfer funds page
   */
  async navigate(): Promise<void> {
    await super.navigate('/transfer.htm');
  }

  /**
   * Transfer funds between accounts
   * @param amount - Amount to transfer
   * @param fromAccountIndex - Index of from account (0-based)
   * @param toAccountIndex - Index of to account (0-based)
   */
  async transferFunds(amount: number, fromAccountIndex: number = 0, toAccountIndex: number = 1): Promise<void> {
    await this.fill(this.amountInput, amount.toString());
    await this.selectOption(this.fromAccountSelect, fromAccountIndex.toString());
    await this.selectOption(this.toAccountSelect, toAccountIndex.toString());
    await this.click(this.transferButton);
  }

  /**
   * Get success message
   * @returns Success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  /**
   * Get error message
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }
}