import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';

async function testParabank() {
  let browser: Browser | null = null;
  let page: Page;

  try {
    // Launch browser
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();

    // Navigate to parabank home page
    console.log('Navigating to parabank home page...');
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await page.waitForLoadState('networkidle');

    console.log('Home page loaded:', await page.title());
    
    // Take screenshot of home page
    await page.screenshot({ path: 'home-page.png', fullPage: true });
    console.log('Home page screenshot saved as home-page.png');
    
    // Get all links on the page
    const links = await page.$$eval('a', anchors => anchors.map(anchor => ({
      text: anchor.textContent?.trim(),
      href: anchor.getAttribute('href')
    })));
    
    console.log('Links found on home page:');
    links.forEach(link => {
      console.log(`  ${link.text}: ${link.href}`);
    });

    // Try alternative ways to navigate to register page
    console.log('\nTrying alternative ways to navigate to register page...');
    
    // Option 1: Try direct navigation
    console.log('Option 1: Direct navigation to register page...');
    await page.goto('https://parabank.parasoft.com/parabank/register.htm');
    await page.waitForLoadState('networkidle');
    
    console.log('Register page loaded:', await page.title());
    
    // Take screenshot of register page
    await page.screenshot({ path: 'register-page.png', fullPage: true });
    console.log('Register page screenshot saved as register-page.png');

    // Get the HTML content of the register page
    console.log('\nGetting register page HTML content...');
    const html = await page.content();
    
    // Save the HTML to a file for analysis
    fs.writeFileSync('register-page.html', html);
    console.log('Register page HTML saved as register-page.html');
    
    // Look for registration form fields in the HTML
    console.log('\nSearching for registration form fields...');
    
    // Check for input elements
    const inputElements = await page.$$eval('input', inputs => inputs.map(input => ({
      id: input.id,
      name: input.name,
      type: input.type,
      placeholder: input.placeholder
    })));
    
    console.log('Input elements found:');
    inputElements.forEach(input => {
      console.log(`  ${input.type}: id="${input.id}", name="${input.name}", placeholder="${input.placeholder}"`);
    });
    
    // Check for form element
    const formElements = await page.$$eval('form', forms => forms.map(form => ({
      action: form.action,
      method: form.method,
      id: form.id
    })));
    
    console.log('\nForm elements found:');
    formElements.forEach(form => {
      console.log(`  Form: id="${form.id}", action="${form.action}", method="${form.method}"`);
    });

    console.log('Test completed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testParabank();