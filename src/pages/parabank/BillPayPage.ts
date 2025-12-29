import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { LocatorManager } from '../../utils/LocatorManager';

export class BillPayPage extends BasePage {
  // Page elements
  private readonly payeeNameInput: string;
  private readonly payeeAddressInput: string;
  private readonly payeeCityInput: string;
  private readonly payeeStateInput: string;
  private readonly payeeZipCodeInput: string;
  private readonly payeePhoneInput: string;
  private readonly payeeAccountInput: string;
  private readonly payeeVerifyAccountInput: string;
  private readonly amountInput: string;
  private readonly fromAccountSelect: string;
  private readonly sendPaymentButton: string;
  private readonly successMessage: string;
  private readonly errorMessages: string;

  constructor(page: Page) {
    super(page);
    
    // Load locators from YAML
    const billPayPageLocators = LocatorManager.getPageLocators('parabank.billPayPage');
    
    if (!billPayPageLocators) {
      throw new Error('Failed to load locators for bill pay page');
    }
    
    // Initialize locators
    this.payeeNameInput = billPayPageLocators.payeeNameInput;
    this.payeeAddressInput = billPayPageLocators.payeeAddressInput;
    this.payeeCityInput = billPayPageLocators.payeeCityInput;
    this.payeeStateInput = billPayPageLocators.payeeStateInput;
    this.payeeZipCodeInput = billPayPageLocators.payeeZipCodeInput;
    this.payeePhoneInput = billPayPageLocators.payeePhoneInput;
    this.payeeAccountInput = billPayPageLocators.payeeAccountInput;
    this.payeeVerifyAccountInput = billPayPageLocators.payeeVerifyAccountInput;
    this.amountInput = billPayPageLocators.amountInput;
    this.fromAccountSelect = billPayPageLocators.fromAccountSelect;
    this.sendPaymentButton = billPayPageLocators.sendPaymentButton;
    this.successMessage = billPayPageLocators.successMessage;
    this.errorMessages = billPayPageLocators.errorMessages;
  }

  /**
   * Navigate to bill pay page
   */
  async navigate(): Promise<void> {
    await super.navigate('/billpay.htm');
  }

  /**
   * Fill payee information
   * @param name - Payee name
   * @param address - Payee address
   * @param city - Payee city
   * @param state - Payee state
   * @param zipCode - Payee zip code
   * @param phone - Payee phone number
   */
  async fillPayeeInfo(
    name: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string
  ): Promise<void> {
    await this.fill(this.payeeNameInput, name);
    await this.fill(this.payeeAddressInput, address);
    await this.fill(this.payeeCityInput, city);
    await this.fill(this.payeeStateInput, state);
    await this.fill(this.payeeZipCodeInput, zipCode);
    await this.fill(this.payeePhoneInput, phone);
  }

  /**
   * Fill payment information
   * @param account - Payee account number
   * @param verifyAccount - Verify account number
   * @param amount - Payment amount
   * @param fromAccountIndex - Index of from account (0-based)
   */
  async fillPaymentInfo(
    account: string,
    verifyAccount: string,
    amount: number,
    fromAccountIndex: number = 0
  ): Promise<void> {
    await this.fill(this.payeeAccountInput, account);
    await this.fill(this.payeeVerifyAccountInput, verifyAccount);
    await this.fill(this.amountInput, amount.toString());
    await this.selectOption(this.fromAccountSelect, fromAccountIndex.toString());
  }

  /**
   * Complete bill payment
   * @param payeeInfo - Payee information
   * @param paymentInfo - Payment information
   */
  async payBill(
    payeeInfo: {
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      phone: string;
    },
    paymentInfo: {
      account: string;
      verifyAccount: string;
      amount: number;
      fromAccountIndex: number;
    }
  ): Promise<void> {
    await this.fillPayeeInfo(
      payeeInfo.name,
      payeeInfo.address,
      payeeInfo.city,
      payeeInfo.state,
      payeeInfo.zipCode,
      payeeInfo.phone
    );
    await this.fillPaymentInfo(
      paymentInfo.account,
      paymentInfo.verifyAccount,
      paymentInfo.amount,
      paymentInfo.fromAccountIndex
    );
    await this.click(this.sendPaymentButton);
  }

  /**
   * Get success message
   * @returns Success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  /**
   * Get all error messages
   * @returns Array of error messages
   */
  async getErrorMessages(): Promise<string[]> {
    const elements = this.page.locator(this.errorMessages);
    const count = await elements.count();
    const messages: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await elements.nth(i).textContent();
      if (text) {
        messages.push(text.trim());
      }
    }

    return messages;
  }
}