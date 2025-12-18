import { chromium } from '@playwright/test';

async function checkRegistrationButton() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the register page
    await page.goto('https://parabank.parasoft.com/parabank/register.htm');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Check all forms on the page
    const forms = page.locator('form');
    const formCount = await forms.count();
    console.log(`Number of forms found: ${formCount}`);
    
    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);
      const formId = await form.getAttribute('id');
      const formAction = await form.getAttribute('action');
      console.log(`Form ${i+1}: id="${formId}", action="${formAction}"`);
      
      // Check all submit buttons in this form
      const submitButtons = form.locator('input[type="submit"]');
      const buttonCount = await submitButtons.count();
      
      for (let j = 0; j < buttonCount; j++) {
        const button = submitButtons.nth(j);
        const buttonType = await button.getAttribute('type');
        const buttonValue = await button.getAttribute('value');
        const buttonId = await button.getAttribute('id');
        const buttonName = await button.getAttribute('name');
        
        console.log(`  Button ${j+1}: type="${buttonType}", value="${buttonValue}", id="${buttonId}", name="${buttonName}"`);
        
        // Highlight the button for visual confirmation
        await button.evaluate(b => {
          b.style.backgroundColor = 'yellow';
          b.style.border = '2px solid red';
        });
      }
    }
    
    // Also check all submit buttons on the entire page
    console.log('\nAll submit buttons on page:');
    const allSubmitButtons = page.locator('input[type="submit"]');
    const allButtonCount = await allSubmitButtons.count();
    
    for (let i = 0; i < allButtonCount; i++) {
      const button = allSubmitButtons.nth(i);
      const buttonType = await button.getAttribute('type');
      const buttonValue = await button.getAttribute('value');
      const buttonId = await button.getAttribute('id');
      const buttonName = await button.getAttribute('name');
      const buttonParent = await button.locator('xpath=..').first();
      const parentId = await buttonParent.getAttribute('id');
      const parentClass = await buttonParent.getAttribute('class');
      
      console.log(`Button ${i+1}: type="${buttonType}", value="${buttonValue}", id="${buttonId}", name="${buttonName}"`);
      console.log(`  Parent: id="${parentId}", class="${parentClass}"`);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'register-page-with-highlights.png' });
    console.log('\nScreenshot saved as "register-page-with-highlights.png"');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Wait before closing to allow visual inspection
    console.log('\nPress any key to close...');
    process.stdin.once('data', async () => {
      await browser.close();
      process.exit(0);
    });
  }
}

checkRegistrationButton();