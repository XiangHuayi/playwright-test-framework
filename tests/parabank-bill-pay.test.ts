import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/parabank/LoginPage';
import { HomePage } from '../src/pages/parabank/HomePage';
import { BillPayPage } from '../src/pages/parabank/BillPayPage';
import { RegisterPage } from '../src/pages/parabank/RegisterPage';

// Generate unique username for test user creation
const generateUniqueUsername = () => `testuser_${Date.now()}`;
const testPassword = 'testpassword123';

test.describe('Parabank Bill Pay Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let billPayPage: BillPayPage;
  let registerPage: RegisterPage;
  
  // Store created user credentials
  let testUsername: string;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    billPayPage = new BillPayPage(page);
    registerPage = new RegisterPage(page);
  });

  // Create a test user before running bill pay tests
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const registerPage = new RegisterPage(page);
    
    testUsername = generateUniqueUsername();
    
    // Navigate to register page
    await registerPage.navigate();
    
    // Register a new user
    await registerPage.register(
      {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        phone: '1234567890',
        ssn: '123456789'
      },
      {
        username: testUsername,
        password: testPassword,
        confirmPassword: testPassword
      }
    );
    
    await page.close();
  });

  test('Successful bill payment with valid information', async () => {
    const payeeName = 'John Doe';
    const address = '456 Bill Street';
    const city = 'Payment City';
    const state = 'PC';
    const zipCode = '67890';
    const phone = '9876543210';
    const accountNumber = '1234567890';
    const amount = 50;

    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to bill pay page
    await homePage.clickBillPay();
    
    // Fill in bill payment form
    await billPayPage.fillPayeeInformation(payeeName, address, city, state, zipCode, phone);
    await billPayPage.fillPaymentInformation(accountNumber, amount);
    await billPayPage.clickSendPayment();
    
    // Verify payment success
    const successMessage = await billPayPage.getSuccessMessage();
    expect(successMessage).toContain('Bill Payment to');
    expect(successMessage).toContain(payeeName);
    expect(successMessage).toContain(`$${amount}`);
  });

  test('Bill payment with missing required fields should fail', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to bill pay page
    await homePage.clickBillPay();
    
    // Try to submit empty form (only account number and amount)
    await billPayPage.fillPaymentInformation('1234567890', 50);
    await billPayPage.clickSendPayment();
    
    // Verify form submission failed due to missing required fields
    const errorMessages = await billPayPage.getErrorMessages();
    expect(errorMessages).toHaveLength(1); // At least one error message should be displayed
  });

  test('Bill payment with invalid zip code should fail', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to bill pay page
    await homePage.clickBillPay();
    
    // Fill in form with invalid zip code
    await billPayPage.fillPayeeInformation('John Doe', '456 Bill Street', 'Payment City', 'PC', 'invalidzip', '9876543210');
    await billPayPage.fillPaymentInformation('1234567890', 50);
    await billPayPage.clickSendPayment();
    
    // Verify form submission failed due to invalid zip code
    const errorMessages = await billPayPage.getErrorMessages();
    expect(errorMessages).toHaveLength(1); // At least one error message should be displayed
  });

  test('Bill payment with invalid phone number should fail', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to bill pay page
    await homePage.clickBillPay();
    
    // Fill in form with invalid phone number
    await billPayPage.fillPayeeInformation('John Doe', '456 Bill Street', 'Payment City', 'PC', '67890', 'invalidphone');
    await billPayPage.fillPaymentInformation('1234567890', 50);
    await billPayPage.clickSendPayment();
    
    // Verify form submission failed due to invalid phone number
    const errorMessages = await billPayPage.getErrorMessages();
    expect(errorMessages).toHaveLength(1); // At least one error message should be displayed
  });

  test('Bill payment with zero amount should fail', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to bill pay page
    await homePage.clickBillPay();
    
    // Fill in form with zero amount
    await billPayPage.fillPayeeInformation('John Doe', '456 Bill Street', 'Payment City', 'PC', '67890', '9876543210');
    await billPayPage.fillPaymentInformation('1234567890', 0);
    await billPayPage.clickSendPayment();
    
    // Verify form submission failed due to zero amount
    const errorMessages = await billPayPage.getErrorMessages();
    expect(errorMessages).toHaveLength(1); // At least one error message should be displayed
  });

  test('Bill payment with negative amount should fail', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to bill pay page
    await homePage.clickBillPay();
    
    // Fill in form with negative amount
    await billPayPage.fillPayeeInformation('John Doe', '456 Bill Street', 'Payment City', 'PC', '67890', '9876543210');
    await billPayPage.fillPaymentInformation('1234567890', -50);
    await billPayPage.clickSendPayment();
    
    // Verify form submission failed due to negative amount
    const errorMessages = await billPayPage.getErrorMessages();
    expect(errorMessages).toHaveLength(1); // At least one error message should be displayed
  });
});