import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/parabank/LoginPage';
import { HomePage } from '../src/pages/parabank/HomePage';
import { TransferFundsPage } from '../src/pages/parabank/TransferFundsPage';
import { RegisterPage } from '../src/pages/parabank/RegisterPage';

// Generate unique username for test user creation
const generateUniqueUsername = () => `testuser_${Date.now()}`;
const testPassword = 'testpassword123';

test.describe('Parabank Transfer Funds Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let transferPage: TransferFundsPage;
  let registerPage: RegisterPage;
  
  // Store created user credentials
  let testUsername: string;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    transferPage = new TransferFundsPage(page);
    registerPage = new RegisterPage(page);
  });

  // Create a test user before running transfer tests
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

  test('Successful fund transfer between accounts', async () => {
    const transferAmount = 100;
    
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to transfer funds page
    await homePage.clickTransferFunds();
    
    // Transfer funds
    await transferPage.transferFunds(transferAmount);
    
    // Verify transfer success
    const successMessage = await transferPage.getSuccessMessage();
    expect(successMessage).toContain('Transfer Complete!');
    expect(successMessage).toContain(`$${transferAmount}`);
  });

  test('Transfer with zero amount should fail', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to transfer funds page
    await homePage.clickTransferFunds();
    
    // Try to transfer zero amount
    await transferPage.transferFunds(0);
    
    // Verify transfer failed with error message
    const errorMessage = await transferPage.getErrorMessage();
    expect(errorMessage).toContain('Please enter a valid amount');
  });

  test('Transfer with negative amount should fail', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to transfer funds page
    await homePage.clickTransferFunds();
    
    // Try to transfer negative amount
    await transferPage.transferFunds(-100);
    
    // Verify transfer failed with error message
    const errorMessage = await transferPage.getErrorMessage();
    expect(errorMessage).toContain('Please enter a valid amount');
  });

  test('Transfer to same account should fail', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Navigate to transfer funds page
    await homePage.clickTransferFunds();
    
    // Try to transfer to same account
    await transferPage.transferFunds(100, 0, 0);
    
    // Verify transfer failed with error message
    const errorMessage = await transferPage.getErrorMessage();
    expect(errorMessage).toContain('You cannot transfer funds to the same account');
  });
});