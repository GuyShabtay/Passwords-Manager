import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

(async function test() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/#/register');

        await driver.wait(until.elementLocated(By.id('userName')), 10000);
        await driver.wait(until.elementLocated(By.id('email')), 10000);
        await driver.wait(until.elementLocated(By.id('password')), 10000);
        await driver.wait(until.elementLocated(By.id('confirmPassword')), 10000);

        let usernameField = await driver.findElement(By.id('userName'));
        let emailField = await driver.findElement(By.id('email'));
        let passwordField = await driver.findElement(By.id('password'));
        let confirmPasswordField = await driver.findElement(By.id('confirmPassword'));
        let registerButton = await driver.findElement(By.css('button[type="submit"]'));

        await usernameField.sendKeys('John Doe');
        await emailField.sendKeys('john.doe@example.com');
        await passwordField.sendKeys('password123');
        await confirmPasswordField.sendKeys('password123');
        await registerButton.click();

        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return url === 'http://localhost:5173/#/login';
        }, 15000);

        console.log('Registration test passed! Redirected to login page.');

        await driver.get('http://localhost:5173/#/login');

        await driver.wait(until.elementLocated(By.id('email')), 10000);
        await driver.wait(until.elementLocated(By.id('password')), 10000);

        let loginEmailField = await driver.findElement(By.id('email'));
        let loginPasswordField = await driver.findElement(By.id('password'));
        let loginButton = await driver.findElement(By.css('button[type="submit"]'));

        await loginEmailField.sendKeys('john.doe@example.com');
        await loginPasswordField.sendKeys('password123');
        await loginButton.click();

        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return url === 'http://localhost:5173/#/home-page';
        }, 15000);

        console.log('Login test passed! Redirected to home page.');

        await driver.wait(until.elementLocated(By.id('add-credentials-icon')), 10000);
        let addCredentialsButton = await driver.findElement(By.id('add-credentials-icon'));
        await addCredentialsButton.click();

        await driver.wait(until.elementLocated(By.id('website')), 10000);
        await driver.wait(until.elementLocated(By.id('password')), 10000);

        let websiteField = await driver.findElement(By.id('website'));
        let credentialPasswordField = await driver.findElement(By.id('password'));
        let addButton = await driver.findElement(By.css('button[type="submit"]'));

        await websiteField.sendKeys('example.com');
        await credentialPasswordField.sendKeys('securepassword123');
        await addButton.click();

        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return url === 'http://localhost:5173/#/home-page';
        }, 15000);

        console.log('Add Credentials test passed! Successfully added credentials.');

        await driver.wait(until.elementLocated(By.id('input-with-sx')), 10000);
        let searchBox = await driver.findElement(By.id('input-with-sx'));
        await searchBox.sendKeys('example.com');

        await driver.wait(until.elementLocated(By.css('.credentials-container')), 10000);
        
        let credentialsList = await driver.findElement(By.css('.credentials-container'));
        let credentialsText = await credentialsList.getText();
        
        assert(credentialsText.includes('example.com'), 'The added credentials are not found in the search results.');
        
        console.log('Search test passed! The added website appears in the search results.');

        await driver.wait(until.elementLocated(By.css('.btn-secondary')), 10000);
        let logoutButton = await driver.findElement(By.css('.btn-secondary'));
        await logoutButton.click();

        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return url === 'http://localhost:5173/#/login';
        }, 15000);

        console.log('Logout test passed! Redirected to login page.');

    } catch (err) {
        console.error('Test failed', err);
    } finally {
        await driver.quit();
    }
})();
