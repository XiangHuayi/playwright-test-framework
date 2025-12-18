import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/parabank/LoginPage';
import { HomePage } from '../src/pages/parabank/HomePage';
import { config } from '../src/config/config';
import { RegisterPage } from '../src/pages/parabank/RegisterPage';

// Generate unique username for test user creation
const generateUniqueUsername = () => `testuser_${Date.now()}`;
const testPassword = 'testpassword123';

test.describe('Parabank Login Tests', () => {
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

  // Create a test user before running login tests
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

  test('Successful login with valid credentials', async () => {
    // Navigate to login page
    await loginPage.navigate();
    
    // Login with valid credentials
    await loginPage.login(testUsername, testPassword);
    
    // Verify login success
    const welcomeText = await homePage.getWelcomeMessage();
    expect(welcomeText).toContain(`Welcome ${testUsername}`);
  });

  test('Login with invalid username should fail', async () => {
    // Navigate to login page
    await loginPage.navigate();
    
    // Login with invalid username
    await loginPage.login('invalidusername123', testPassword);
    
    // Verify login failed with error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid username or password');
  });

  test('Login with invalid password should fail', async () => {
    // Navigate to login page
    await loginPage.navigate();
    
    // Login with invalid password
    await loginPage.login(testUsername, 'invalidpassword123');
    
    // Verify login failed with error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid username or password');
  });

  test('Login with empty credentials should fail', async () => {
    // Navigate to login page
    await loginPage.navigate();
    
    // Login with empty credentials
    await loginPage.login('', '');
    
    // Verify login failed with error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Please enter a username and password');
  });

  test('Login with empty username should fail', async () => {
    // Navigate to login page
    await loginPage.navigate();
    
    // Login with empty username
    await loginPage.login('', testPassword);
    
    // Verify login failed with error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Please enter a username and password');
  });

  test('Login with empty password should fail', async () => {
    // Navigate to login page
    await loginPage.navigate();
    
    // Login with empty password
    await loginPage.login(testUsername, '');
    
    // Verify login failed with error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Please enter a username and password');
  });

  test('Logout functionality should work correctly', async () => {
    // First login to the system
    await loginPage.navigate();
    await loginPage.login(testUsername, testPassword);
    
    // Verify login success
    const welcomeText = await homePage.getWelcomeMessage();
    expect(welcomeText).toContain(`Welcome ${testUsername}`);
    
    // Logout from the system
    await homePage.logout();
    
    // Verify we are back to login page
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/parabank/index.htm');
    
    // Verify login button is visible
    expect(await loginPage.isLoginButtonEnabled()).toBeTruthy();
  });
});