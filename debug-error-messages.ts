import { chromium, Browser, Page } from 'playwright';

async function debugErrorMessages() {
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();
  
  try {
    console.log('Navigating to registration page...');
    await page.goto('https://parabank.parasoft.com/parabank/register.htm');
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    console.log('Page loaded. Filling form with existing username...');
    
    // Fill the form with a known existing username
    await page.fill('#customer\\.firstName', 'Test');
    await page.fill('#customer\\.lastName', 'User');
    await page.fill('#customer\\.address\\.street', '123 Test St');
    await page.fill('#customer\\.address\\.city', 'Test City');
    await page.fill('#customer\\.address\\.state', 'Test State');
    await page.fill('#customer\\.address\\.zipCode', '12345');
    await page.fill('#customer\\.phoneNumber', '123-456-7890');
    await page.fill('#customer\\.ssn', '123-45-6789');
    await page.fill('#customer\\.username', 'testuser123'); // Known existing username
    await page.fill('#customer\\.password', 'password123');
    await page.fill('#repeatedPassword', 'password123');
    
    console.log('Form filled. Clicking Register button...');
    
    // Click the Register button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }).catch(() => {}),
      page.click('#customerForm input[type="submit"][value="Register"]')
    ]);
    
    console.log('After clicking Register, current URL:', page.url());
    
    // Check for error messages using various selectors
    console.log('\n=== Checking for error messages ===');
    
    // Check for .error class
    const errorElements = await page.locator('.error').all();
    console.log(`Found ${errorElements.length} elements with .error class:`);
    for (let i = 0; i < errorElements.length; i++) {
      const text = await errorElements[i].innerText();
      const tagName = await errorElements[i].evaluate(el => el.tagName);
      const outerHTML = await errorElements[i].evaluate(el => el.outerHTML);
      console.log(`  ${i + 1}. ${tagName}: "${text}"`);
      console.log(`     HTML: ${outerHTML}`);
    }
    
    // Check for .errorMessage class
    const errorMessageElements = await page.locator('.errorMessage').all();
    console.log(`\nFound ${errorMessageElements.length} elements with .errorMessage class:`);
    for (let i = 0; i < errorMessageElements.length; i++) {
      const text = await errorMessageElements[i].innerText();
      const tagName = await errorMessageElements[i].evaluate(el => el.tagName);
      const outerHTML = await errorMessageElements[i].evaluate(el => el.outerHTML);
      console.log(`  ${i + 1}. ${tagName}: "${text}"`);
      console.log(`     HTML: ${outerHTML}`);
    }
    
    // Check for #login-error-message
    const loginErrorElement = await page.locator('#login-error-message').first();
    const loginErrorText = await loginErrorElement.innerText();
    console.log(`\nLogin error message: "${loginErrorText}"`);
    
    // Check for all span elements containing error text
    const spanElements = await page.locator('span').all();
    console.log(`\nFound ${spanElements.length} span elements. Checking for error text...`);
    for (let i = 0; i < spanElements.length; i++) {
      const text = await spanElements[i].innerText();
      if (text.includes('error') || text.includes('Error') || text.includes('already exists')) {
        const outerHTML = await spanElements[i].evaluate(el => el.outerHTML);
        console.log(`  Span ${i + 1}: "${text}"`);
        console.log(`     HTML: ${outerHTML}`);
      }
    }
    
    // Check for all div elements containing error text
    const divElements = await page.locator('div').all();
    console.log(`\nChecking div elements for error text...`);
    for (let i = 0; i < divElements.length; i++) {
      const text = await divElements[i].innerText();
      if (text.includes('already exists')) {
        const outerHTML = await divElements[i].evaluate(el => el.outerHTML);
        console.log(`  Div ${i + 1}: "${text}"`);
        console.log(`     HTML: ${outerHTML}`);
      }
    }
    
    // Take a screenshot for reference
    await page.screenshot({ path: 'error-messages-screenshot.png', fullPage: true });
    console.log('\nScreenshot saved as "error-messages-screenshot.png"');
    
  } catch (error) {
    console.error('Error during debugging:', error);
  } finally {
    await browser.close();
    console.log('\nBrowser closed. Debugging complete.');
  }
}

debugErrorMessages();