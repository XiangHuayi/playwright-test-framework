import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { logger } from '../../utils/logger';

/**
 * Bilibili Login Page
 */
export class LoginPage extends BasePage {
  // Page elements
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginSubmitButton: Locator;
  private readonly qrCodeLoginTab: Locator;
  private readonly passwordLoginTab: Locator;
  private readonly mobileLoginTab: Locator;
  private readonly qrCodeContainer: Locator;
  private readonly errorMessage: Locator;
  private readonly forgetPasswordLink: Locator;
  private readonly registerLink: Locator;
  private readonly closeButton: Locator;
  private readonly captchaImage: Locator;
  private readonly captchaInput: Locator;
  private readonly loginForm: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.usernameInput = page.locator('#login-username');
    this.passwordInput = page.locator('#login-passwd');
    this.loginSubmitButton = page.locator('#geetest-wrap > div > div.btn-box > a.btn.btn-login');
    this.qrCodeLoginTab = page.locator('.login-type > ul > li:nth-child(1)');
    this.passwordLoginTab = page.locator('.login-type > ul > li:nth-child(2)');
    this.mobileLoginTab = page.locator('.login-type > ul > li:nth-child(3)');
    this.qrCodeContainer = page.locator('.login-qrcode');
    this.errorMessage = page.locator('.error-tip');
    this.forgetPasswordLink = page.locator('.forgetpwd');
    this.registerLink = page.locator('.register-link');
    this.closeButton = page.locator('.login-mask-close');
    this.captchaImage = page.locator('.geetest_item_img');
    this.captchaInput = page.locator('.geetest_input');
    this.loginForm = page.locator('.login-form');
  }

  /**
   * Switch to password login tab
   */
  async switchToPasswordLogin(): Promise<void> {
    logger.info('Switching to password login tab');
    await this.click(this.passwordLoginTab);
  }

  /**
   * Switch to QR code login tab
   */
  async switchToQrCodeLogin(): Promise<void> {
    logger.info('Switching to QR code login tab');
    await this.click(this.qrCodeLoginTab);
  }

  /**
   * Switch to mobile login tab
   */
  async switchToMobileLogin(): Promise<void> {
    logger.info('Switching to mobile login tab');
    await this.click(this.mobileLoginTab);
  }

  /**
   * Enter username
   * @param username - Username
   */
  async enterUsername(username: string): Promise<void> {
    logger.info(`Entering username: ${username}`);
    await this.fill(this.usernameInput, username);
  }

  /**
   * Enter password
   * @param password - Password
   */
  async enterPassword(password: string): Promise<void> {
    logger.info('Entering password');
    await this.fill(this.passwordInput, password);
  }

  /**
   * Submit login form
   */
  async submitLogin(): Promise<void> {
    logger.info('Submitting login form');
    await this.click(this.loginSubmitButton);
  }

  /**
   * Perform login with username and password
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in with username: ${username}`);
    await this.switchToPasswordLogin();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.submitLogin();
  }

  /**
   * Get error message text
   * @returns Error message text or null if not present
   */
  async getErrorMessageText(): Promise<string | null> {
    logger.info('Getting error message text');
    if (await this.isVisible(this.errorMessage)) {
      return this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Check if login failed
   * @returns True if login failed, false otherwise
   */
  async isLoginFailed(): Promise<boolean> {
    logger.info('Checking if login failed');
    return this.isVisible(this.errorMessage);
  }



  /**
   * Click forget password link
   */
  async clickForgetPassword(): Promise<void> {
    logger.info('Clicking forget password link');
    await this.click(this.forgetPasswordLink);
  }

  /**
   * Click register link
   */
  async clickRegister(): Promise<void> {
    logger.info('Clicking register link');
    await this.click(this.registerLink);
  }

  /**
   * Close login modal
   */
  async closeLoginModal(): Promise<void> {
    logger.info('Closing login modal');
    await this.click(this.closeButton);
  }

  /**
   * Check if captcha is required
   * @returns True if captcha is required, false otherwise
   */
  async isCaptchaRequired(): Promise<boolean> {
    logger.info('Checking if captcha is required');
    return this.isVisible(this.captchaImage);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    logger.info('Waiting for login page to load');
    // 尝试多种方式检测登录页面加载
    try {
      // 先尝试等待登录表单或标签页
      await Promise.any([
        this.waitForVisible(this.loginForm, 10000),
        this.waitForVisible(this.qrCodeLoginTab, 10000),
        this.waitForVisible(this.passwordLoginTab, 10000),
        this.waitForVisible(this.mobileLoginTab, 10000),
        // 尝试等待关闭按钮（通常在登录模态框上）
        this.waitForVisible(this.closeButton, 10000)
      ]);
    } catch (error) {
      logger.warn('Failed to detect login page using specific elements, trying fallback...');
      // 作为备选，等待页面上任何可能与登录相关的元素
      await this.page.waitForTimeout(5000);
    }
  }

  /**
   * Get username input locator
   * @returns Username input locator
   */
  getUsernameInput(): Locator {
    return this.usernameInput;
  }

  /**
   * Get password input locator
   * @returns Password input locator
   */
  getPasswordInput(): Locator {
    return this.passwordInput;
  }

  /**
   * Get login submit button locator
   * @returns Login submit button locator
   */
  getLoginSubmitButton(): Locator {
    return this.loginSubmitButton;
  }

  /**
   * Get error message locator
   * @returns Error message locator
   */
  getErrorMessage(): Locator {
    return this.errorMessage;
  }

  /**
   * Get login form locator
   * @returns Login form locator
   */
  getLoginForm(): Locator {
    return this.loginForm;
  }

  /**
   * Get QR code login tab locator
   * @returns QR code login tab locator
   */
  getQrCodeLoginTab(): Locator {
    return this.qrCodeLoginTab;
  }

  /**
   * Get password login tab locator
   * @returns Password login tab locator
   */
  getPasswordLoginTab(): Locator {
    return this.passwordLoginTab;
  }

  /**
   * Get mobile login tab locator
   * @returns Mobile login tab locator
   */
  getMobileLoginTab(): Locator {
    return this.mobileLoginTab;
  }

  /**
   * Get QR code container locator
   * @returns QR code container locator
   */
  getQrCodeContainer(): Locator {
    return this.qrCodeContainer;
  }
}
