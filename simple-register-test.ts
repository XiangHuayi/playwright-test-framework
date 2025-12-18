import { chromium, Browser, Page } from 'playwright';

async function simpleRegisterTest() {
  const browser: Browser = await chromium.launch({ headless: true });
  const page: Page = await browser.newPage();
  
  try {
    console.log('Navigating to registration page...');
    await page.goto('https://parabank.parasoft.com/parabank/register.htm');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page has any unusual content or messages
    console.log('Checking page content...');
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);
    
    // Check for any banner messages or alerts
    const bannerText = await page.locator('.banner').innerText().catch(() => 'No banner found');
    console.log(`Banner text: ${bannerText}`);
    
    // Check for any JavaScript errors
    page.on('console', msg => console.log(`Page console: ${msg.text()}`));
    
    // Take a screenshot of the initial page
    await page.screenshot({ path: 'initial-register-page.png', fullPage: true });
    console.log('Initial page screenshot taken');
    
    // Use a manually created, extremely unique username
    const uniqueUsername = `trae_test_user_2023_${Math.random().toString(36).substring(2)}`;
    console.log(`Using unique username: ${uniqueUsername}`);
    
    console.log('Filling registration form...');
    
    // Fill the form directly using Playwright API
    await page.fill('#customer\\.firstName', 'Test');
    await page.fill('#customer\\.lastName', 'User');
    await page.fill('#customer\\.address\\.street', '123 Test St');
    await page.fill('#customer\\.address\\.city', 'Test City');
    await page.fill('#customer\\.address\\.state', 'Test State');
    await page.fill('#customer\\.address\\.zipCode', '12345');
    await page.fill('#customer\\.phoneNumber', '123-456-7890');
    await page.fill('#customer\\.ssn', '123-45-6789');
    await page.fill('#customer\\.username', uniqueUsername);
    await page.fill('#customer\\.password', 'password123');
    await page.fill('#repeatedPassword', 'password123');
    
    console.log('Form filled. Verifying form values...');
    
    // Verify all form fields are correctly filled
    const firstName = await page.inputValue('#customer\\.firstName');
    const lastName = await page.inputValue('#customer\\.lastName');
    const username = await page.inputValue('#customer\\.username');
    const password = await page.inputValue('#customer\\.password');
    const confirmPassword = await page.inputValue('#repeatedPassword');
    
    console.log(`Verified values:`);
    console.log(`  First Name: ${firstName}`);
    console.log(`  Last Name: ${lastName}`);
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
    console.log(`  Confirm Password: ${confirmPassword}`);
    
    // Wait a moment before clicking (to ensure all fields are processed)
    await page.waitForTimeout(1000);
    
    // Enable request interception to track network requests
    await page.route('**/*', route => {
      const url = route.request().url();
      const method = route.request().method();
      if (method === 'POST' && url.includes('register.htm')) {
        console.log(`Intercepted POST request to: ${url}`);
        // Log request data
        const postData = route.request().postData();
        console.log(`POST data: ${postData}`);
      }
      route.continue();
    });
    
    console.log('Clicking Register button...');
    
    // Click the Register button
    await page.click('#customerForm input[type="submit"][value="Register"]');
    
    // Wait for navigation or page update
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    
    // Take a screenshot after clicking
    await page.screenshot({ path: 'after-register-click.png', fullPage: true });
    console.log('After click screenshot taken');
    
    console.log('After clicking Register, current URL:', page.url());
    
    // Check if registration was successful
    if (page.url().includes('overview.htm')) {
      console.log('✅ Registration successful!');
      
      // Try to login with the new credentials to verify
      console.log('Logging in with new credentials...');
      await page.goto('https://parabank.parasoft.com/parabank/index.htm');
      await page.fill('#loginPanel input[name="username"]', uniqueUsername);
      await page.fill('#loginPanel input[name="password"]', 'password123');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }),
        page.click('#loginPanel input[type="submit"][value="Log In"]')
      ]);
      
      if (page.url().includes('overview.htm')) {
        console.log('✅ Login successful!');
      } else {
        console.log('❌ Login failed!');
        console.log('Current URL after login attempt:', page.url());
      }
      
    } else {
      console.log('❌ Registration failed!');
      
      // Check for error messages
      const errorElements = await page.locator('.error').all();
      console.log(`Found ${errorElements.length} error messages:`);
      for (let i = 0; i < errorElements.length; i++) {
        const text = await errorElements[i].innerText();
        console.log(`  ${i + 1}. "${text}"`);
      }
    }
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
    console.log('Browser closed. Test complete.');
  }
}

simpleRegisterTest();