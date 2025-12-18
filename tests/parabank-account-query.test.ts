import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/parabank/LoginPage';
import { HomePage } from '../src/pages/parabank/HomePage';
import { RegisterPage } from '../src/pages/parabank/RegisterPage';

// Generate unique username for test user creation
const generateUniqueUsername = () => `testuser_${Date.now()}`;
const testPassword = 'testpassword123';

test.describe('Parabank Account Query Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let registerPage: RegisterPage;
  
  // Store created user credentials
  let testUsername: string;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    registerPage = new RegisterPage(page);
  });

  // Create a test user before running account query tests
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

  test('View account overview after login', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Verify we're on the home page
    const welcomeText = await homePage.getWelcomeMessage();
    expect(welcomeText).toContain(`Welcome ${testUsername}`);
    
    // Check that account numbers are displayed
    const accountNumbers = await homePage.getAccountNumbers();
    expect(accountNumbers.length).toBeGreaterThan(0);
    
    // Check that account balances are displayed and have valid values
    const balance = await homePage.getAccountBalance(0);
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  test('View specific account details and transactions', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Get account numbers
    const accountNumbers = await homePage.getAccountNumbers();
    expect(accountNumbers.length).toBeGreaterThan(0);
    
    // Click on the first account number link
    await homePage.clickAccountNumber(0);
    
    // Verify we're on the account activity page
    const currentUrl = await homePage.getCurrentUrl();
    expect(currentUrl).toContain('/activity.htm');
    
    // Check that transaction history is displayed
    const pageContent = await homePage.getText('body');
    expect(pageContent).toContain('Account Activity');
    
    // Verify account number is displayed on the activity page
    expect(pageContent).toContain(accountNumbers[0]);
  });

  test('Navigate to account overview from home page', async () => {
    // Login to the application
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Click on Account Overview link
    await homePage.clickAccountOverview();
    
    // Verify we're on the account overview page
    const currentUrl = await homePage.getCurrentUrl();
    expect(currentUrl).toContain('/overview.htm');
    
    // Check that account information is displayed
    const accountNumbers = await homePage.getAccountNumbers();
    expect(accountNumbers.length).toBeGreaterThan(0);
  });
});