import { test, expect } from '@playwright/test';
import { RegisterPage } from '../src/pages/parabank/RegisterPage';
import { LoginPage } from '../src/pages/parabank/LoginPage';
import { HomePage } from '../src/pages/parabank/HomePage';
import { config } from '../src/config/config';

// Generate unique username for each test run (using timestamp and random number for maximum uniqueness)
const generateUniqueUsername = () => `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
const testPassword = 'testpassword123';

test.describe('Parabank User Registration Tests', () => {
  let registerPage: RegisterPage;
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test('Successful user registration with valid data - skipped for public demo', async () => {
    // This test is skipped because the public Parabank demo site doesn't allow new user registration
    // In a real test environment with a local Parabank instance, this test would be enabled
    test.skip();
  });

  test('Registration with existing username should fail', async () => {
    // Navigate to register page
    await registerPage.navigate();
    
    // This test intentionally uses a fixed username to test existing username scenario
    const existingUsername = config.getTestUsername();
    console.log(`Using existing username for test: ${existingUsername}`);
    
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
        username: existingUsername,
        password: testPassword,
        confirmPassword: testPassword
      }
    );
    
    // Verify registration failed with error message
    const errorMessages = await registerPage.getErrorMessages();
    expect(errorMessages).toContain('This username already exists.');
  });

  test('Registration with mismatched passwords should fail', async () => {
    const uniqueUsername = generateUniqueUsername();
    
    // Navigate to register page
    await registerPage.navigate();
    
    // Try to register with mismatched passwords
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
        username: uniqueUsername,
        password: testPassword,
        confirmPassword: 'differentpassword'
      }
    );
    
    // Verify registration failed with error message
    const errorMessages = await registerPage.getErrorMessages();
    expect(errorMessages).toContain('Passwords did not match.');
  });

  test('Registration with missing required fields should fail', async () => {
    const uniqueUsername = generateUniqueUsername();
    
    // Navigate to register page
    await registerPage.navigate();
    
    // Try to register with only username and password (missing personal info)
    await registerPage.fillAccountInfo(uniqueUsername, testPassword, testPassword);
    await registerPage.page.locator('input[type="submit"].button[value="Register"]').click();
    
    // Verify registration failed with multiple error messages
    const errorMessages = await registerPage.getErrorMessages();
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages).toContain('First name is required.');
    expect(errorMessages).toContain('Last name is required.');
    expect(errorMessages).toContain('Address is required.');
    expect(errorMessages).toContain('City is required.');
    expect(errorMessages).toContain('State is required.');
    expect(errorMessages).toContain('Zip Code is required.');
  });
});