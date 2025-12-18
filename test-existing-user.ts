import { chromium, Page, Browser } from 'playwright';
import { config } from './src/config/config';

async function testExistingUser() {
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();
  
  try {
    console.log('Testing existing user login...');
    
    // Get credentials from config
    const username = config.getTestUsername();
    const password = config.getTestPassword();
    
    console.log(`Using username: ${username}, password: ${password}`);
    
    // Navigate to login page
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check page content and structure
    console.log('Checking page structure...');
    const pageHTML = await page.innerHTML('body');
    
    // Save page HTML to file for debugging
    await page.content().then(content => {
      require('fs').writeFileSync('page-content.html', content);
      console.log('Page content saved to page-content.html');
    });
    
    // Try to find login form elements
    const hasLoginForm = await page.locator('form').isVisible();
    console.log(`Login form visible: ${hasLoginForm}`);
    
    // Try different selectors for username input
    const usernameInputs = await page.locator('input[type="text"]').all();
    console.log(`Found ${usernameInputs.length} text inputs`);
    
    const passwordInputs = await page.locator('input[type="password"]').all();
    console.log(`Found ${passwordInputs.length} password inputs`);
    
    const submitButtons = await page.locator('input[type="submit"]').all();
    console.log(`Found ${submitButtons.length} submit buttons`);
    
    // Try to fill login form using more general selectors
    if (usernameInputs.length > 0) {
      await usernameInputs[0].fill(username);
      console.log('Filled username input');
    }
    
    if (passwordInputs.length > 0) {
      await passwordInputs[0].fill(password);
      console.log('Filled password input');
    }
    
    // Click login button
    if (submitButtons.length > 0) {
      await submitButtons[0].click();
      console.log('Clicked submit button');
    }
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Check if login was successful
    const currentUrl = page.url();
    console.log(`After login URL: ${currentUrl}`);
    
    if (currentUrl.includes('overview.htm')) {
      console.log('✅ Login successful!');
      
      // Get welcome message
      const welcomeMessage = await page.locator('.title').innerText();
      console.log(`Welcome message: ${welcomeMessage}`);
      
      return true;
    } else {
      // Check for error message
      const errorMessage = await page.locator('.error').innerText().catch(() => 'No error message found');
      console.log(`❌ Login failed. Error: ${errorMessage}`);
      return false;
    }
    
  } catch (error) {
    console.error('Error during login test:', error);
    return false;
  } finally {
    await browser.close();
  }
}

// Run the test
testExistingUser().then(success => {
  process.exit(success ? 0 : 1);
});