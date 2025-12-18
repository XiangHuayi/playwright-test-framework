import { chromium, Page } from '@playwright/test';

async function debugRegistration() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable request/response logging
  context.on('request', request => {
    console.log(`Request: ${request.method()} ${request.url()}`);
  });

  context.on('response', response => {
    console.log(`Response: ${response.status()} ${response.url()}`);
  });

  try {
    // Navigate to register page
    await page.goto('https://parabank.parasoft.com/parabank/register.htm');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Page loaded:', page.url());
    
    // Fill in the registration form
    const uniqueUsername = `testuser_${Date.now()}`;
    const testPassword = 'test12345';
    
    console.log('Using username:', uniqueUsername);
    
    // Fill personal information
    await page.fill('#customer\\.firstName', 'John');
    await page.fill('#customer\\.lastName', 'Doe');
    await page.fill('#customer\\.address\\.street', '123 Main St');
    await page.fill('#customer\\.address\\.city', 'Anytown');
    await page.fill('#customer\\.address\\.state', 'CA');
    await page.fill('#customer\\.address\\.zipCode', '12345');
    await page.fill('#customer\\.phoneNumber', '555-123-4567');
    await page.fill('#customer\\.ssn', '123-45-6789');
    
    // Fill account information
    await page.fill('#customer\\.username', uniqueUsername);
    await page.fill('#customer\\.password', testPassword);
    await page.fill('#repeatedPassword', testPassword);
    
    // Wait a moment
    await page.waitForTimeout(1000);
    
    // Take screenshot before clicking register
    await page.screenshot({ path: 'before-register.png' });
    
    // Click the register button and wait for navigation
    console.log('Clicking register button...');
    
    // Use waitForNavigation to track the navigation
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Try clicking the button
    try {
      const registerButton = page.locator('#customerForm input[type="submit"][value="Register"]');
      await registerButton.waitFor({ state: 'visible' });
      await registerButton.scrollIntoViewIfNeeded();
      await registerButton.click();
      console.log('Register button clicked');
    } catch (error) {
      console.error('Error clicking register button:', error);
      
      // Try alternative selector
      try {
        const button = page.locator('input[type="submit"][value="Register"]');
        await button.click();
        console.log('Alternative button selector clicked');
      } catch (altError) {
        console.error('Alternative selector also failed:', altError);
      }
    }
    
    // Wait for navigation to complete
    try {
      await navigationPromise;
      console.log('Navigation completed to:', page.url());
    } catch (navError) {
      console.error('Navigation failed:', navError);
      console.log('Current URL:', page.url());
    }
    
    // Take screenshot after clicking register
    await page.screenshot({ path: 'after-register.png' });
    
    // Check for error messages
    const errorMessages = page.locator('.error');
    const errorCount = await errorMessages.count();
    
    if (errorCount > 0) {
      console.log(`Found ${errorCount} error message(s):`);
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorMessages.nth(i).textContent();
        console.log(`  - ${errorText}`);
      }
    } else {
      console.log('No error messages found');
    }
    
    // Check if we're on the overview page
    if (page.url().includes('overview.htm')) {
      console.log('SUCCESS: Registration completed and redirected to overview');
    } else {
      console.log('FAILURE: Not redirected to overview page');
      console.log('Current URL:', page.url());
    }
    
  } catch (error) {
    console.error('Error in debug script:', error);
  } finally {
    // Wait before closing
    console.log('\nDebug complete. Press any key to close browser...');
    process.stdin.once('data', async () => {
      await browser.close();
      process.exit(0);
    });
  }
}

debugRegistration();