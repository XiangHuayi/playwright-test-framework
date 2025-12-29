import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { LocatorManager } from '../../utils/LocatorManager';

export class TransferFundsPage extends BasePage {
  // Page elements
  private readonly amountInput: string;
  private readonly fromAccountSelect: string;
  private readonly toAccountSelect: string;
  private readonly transferButton: string;
  private readonly successMessage: string;
  private readonly errorMessage: string;

  constructor(page: Page) {
    super(page);
    
    // Load locators from YAML
    const transferFundsPageLocators = LocatorManager.getPageLocators('parabank.transferFundsPage');
    
    if (!transferFundsPageLocators) {
      throw new Error('Failed to load locators for transfer funds page');
    }
    
    // Initialize locators
    this.amountInput = transferFundsPageLocators.amountInput;
    this.fromAccountSelect = transferFundsPageLocators.fromAccountSelect;
    this.toAccountSelect = transferFundsPageLocators.toAccountSelect;
    this.transferButton = transferFundsPageLocators.transferButton;
    this.successMessage = transferFundsPageLocators.successMessage;
    this.errorMessage = transferFundsPageLocators.errorMessage;
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