import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { LocatorManager } from '../../utils/LocatorManager';

export class RegisterPage extends BasePage {
  // Page elements
  private readonly firstNameInput: string;
  private readonly lastNameInput: string;
  private readonly addressInput: string;
  private readonly cityInput: string;
  private readonly stateInput: string;
  private readonly zipCodeInput: string;
  private readonly phoneInput: string;
  private readonly ssnInput: string;
  private readonly usernameInput: string;
  private readonly passwordInput: string;
  private readonly confirmPasswordInput: string;
  private readonly registerButton: string;
  private readonly registerButtonByValue: string;
  private readonly successMessage: string;
  private readonly errorMessages: string;
  private readonly registerForm: string;

  constructor(page: Page) {
    super(page);
    
    // Load locators from YAML
    const registerPageLocators = LocatorManager.getPageLocators('parabank.registerPage');
    
    if (!registerPageLocators) {
      throw new Error('Failed to load locators for register page');
    }
    
    // Initialize locators
    this.firstNameInput = registerPageLocators.firstNameInput;
    this.lastNameInput = registerPageLocators.lastNameInput;
    this.addressInput = registerPageLocators.addressInput;
    this.cityInput = registerPageLocators.cityInput;
    this.stateInput = registerPageLocators.stateInput;
    this.zipCodeInput = registerPageLocators.zipCodeInput;
    this.phoneInput = registerPageLocators.phoneInput;
    this.ssnInput = registerPageLocators.ssnInput;
    this.usernameInput = registerPageLocators.usernameInput;
    this.passwordInput = registerPageLocators.passwordInput;
    this.confirmPasswordInput = registerPageLocators.confirmPasswordInput;
    this.registerButton = registerPageLocators.registerButton;
    this.registerButtonByValue = registerPageLocators.registerButtonByValue;
    this.successMessage = registerPageLocators.successMessage;
    this.errorMessages = registerPageLocators.errorMessages;
    this.registerForm = registerPageLocators.registerForm;
  }

  /**
   * Click register button
   */
  async clickRegisterButton(): Promise<void> {
    // First wait for the form to be visible
    await this.page.waitForSelector(this.registerForm, { state: 'visible' });
    
    // Try multiple selectors for the register button
    let buttonFound = false;
    
    // Try using the form-specific selector first
    try {
      const button = this.page.locator(this.registerButton);
      await button.waitFor({ state: 'visible', timeout: 5000 });
      await button.scrollIntoViewIfNeeded();
      await button.click();
      buttonFound = true;
      console.log('Clicked register button using form-specific selector');
    } catch (error) {
      console.log('Failed to click register button using form-specific selector:', error);
    }
    
    // If first selector failed, try using the value attribute
    if (!buttonFound) {
      try {
        const button = this.page.locator(this.registerButtonByValue);
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await button.scrollIntoViewIfNeeded();
        await button.click();
        buttonFound = true;
        console.log('Clicked register button using value selector');
      } catch (error) {
        console.log('Failed to click register button using value selector:', error);
      }
    }
    
    // If both selectors failed, try a more general approach
    if (!buttonFound) {
      try {
        const button = this.page.locator('input[type="submit"][value="Register"]');
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await button.scrollIntoViewIfNeeded();
        await button.click();
        buttonFound = true;
        console.log('Clicked register button using general selector');
      } catch (error) {
        console.log('Failed to click register button using general selector:', error);
      }
    }
    
    if (!buttonFound) {
      throw new Error('Could not find or click the register button using any selector');
    }
  }

  /**
   * Navigate to register page
   */
  async navigate(): Promise<void> {
    await super.navigate('/register.htm');
  }

  /**
   * Fill personal information
   * @param firstName - First name
   * @param lastName - Last name
   * @param address - Address
   * @param city - City
   * @param state - State
   * @param zipCode - Zip code
   * @param phone - Phone number
   * @param ssn - Social Security Number
   */
  async fillPersonalInfo(
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    ssn: string
  ): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.addressInput, address);
    await this.fill(this.cityInput, city);
    await this.fill(this.stateInput, state);
    await this.fill(this.zipCodeInput, zipCode);
    await this.fill(this.phoneInput, phone);
    await this.fill(this.ssnInput, ssn);
  }

  /**
   * Fill account information
   * @param username - Username
   * @param password - Password
   * @param confirmPassword - Confirm password
   */
  async fillAccountInfo(username: string, password: string, confirmPassword: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.fill(this.confirmPasswordInput, confirmPassword);
  }

  /**
   * Complete registration form
   * @param personalInfo - Personal information
   * @param accountInfo - Account information
   */
  async register(
    personalInfo: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      phone: string;
      ssn: string;
    },
    accountInfo: {
      username: string;
      password: string;
      confirmPassword: string;
    }
  ): Promise<void> {
    await this.fillPersonalInfo(
      personalInfo.firstName,
      personalInfo.lastName,
      personalInfo.address,
      personalInfo.city,
      personalInfo.state,
      personalInfo.zipCode,
      personalInfo.phone,
      personalInfo.ssn
    );
    await this.fillAccountInfo(accountInfo.username, accountInfo.password, accountInfo.confirmPassword);
    await this.clickRegisterButton();
  }

  /**
   * Check if registration was successful
   * @returns True if registration succeeded, false otherwise
   */
  async isRegistrationSuccessful(): Promise<boolean> {
    try {
      // After successful registration, the page should redirect to the overview page
      await this.page.waitForURL('**/overview.htm', { timeout: this.pageTimeout });
      return true;
    } catch (error) {
      // If redirection doesn't happen, check if we're still on the register page
      const currentURL = this.page.url();
      if (currentURL.includes('register.htm')) {
        return false;
      }
      return false;
    }
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
    const messages: string[] = [];
    
    // Try multiple selectors to find error messages
    const errorSelectors = [
      this.errorMessages, // Default .error selector
      '.errorMessage',    // Common alternative error class
      '#login-error-message', // Login error message specific to ParaBank
      '#customerForm .error', // Errors within the customer form
      'p.error'           // Paragraphs with error class
    ];
    
    for (const selector of errorSelectors) {
      const elements = this.page.locator(selector);
      const count = await elements.count();
      
      for (let i = 0; i < count; i++) {
        const text = await elements.nth(i).textContent();
        if (text) {
          const trimmedText = text.trim();
          if (trimmedText && !messages.includes(trimmedText)) {
            messages.push(trimmedText);
          }
        }
      }
    }
    
    // Also check for any span elements that might contain errors
    const spanElements = this.page.locator('span');
    const spanCount = await spanElements.count();
    
    for (let i = 0; i < spanCount; i++) {
      const span = spanElements.nth(i);
      const text = await span.textContent();
      const className = await span.getAttribute('class');
      
      if (text && className) {
        const trimmedText = text.trim();
        if (trimmedText && trimmedText.length > 0 && 
            (className.includes('error') || trimmedText.includes('error') || trimmedText.includes('already exists'))) {
          if (!messages.includes(trimmedText)) {
            messages.push(trimmedText);
          }
        }
      }
    }
    
    return messages;
  }


}