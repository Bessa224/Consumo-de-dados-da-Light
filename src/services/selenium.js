
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class SeleniumService {
    constructor() {
        this.options = new chrome.Options()
            // .addArguments('--headless=new')  // Updated headless syntax
            // .addArguments('--no-sandbox')
            // .addArguments('--disable-dev-shm-usage');
            .addArguments('--start-maximized')
            .addArguments('--disable-notifications');
    }

    async createDriver() {
        return new Builder()
            .forBrowser('chrome')
            .setChromeOptions(this.options)
            .build();
    }

    async performSearch(url, searchTerm) {
        let driver;
        try {
            driver = await this.createDriver();
            await driver.get(url);

            // Wait for search input and perform search
            const searchInput = await driver.findElement(By.name('q'));
            await searchInput.sendKeys(searchTerm, Key.RETURN);

            // Wait for results and get some data
            await driver.wait(until.elementLocated(By.css('h3')), 5000);
            const results = await driver.findElements(By.css('h3'));

            const titles = await Promise.all(
                results.slice(0, 5).map(element => element.getText())
            );

            return {
                success: true,
                searchTerm,
                results: titles
            };

        } catch (error) {
            console.error('Search error:', error);
            throw error;
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
    }
    async performLogin(url,username,password){
        let driver;
        try{
            driver = await this.createDriver();
            await driver.get(url);

            const loginInput = await driver.findElement(By.name("wt17$OutSystemsUIWeb_wt12$block$wtContent$wt21$OutSystemsUIWeb_wt37$block$wtInput$wtUserNameInput"))
            await loginInput.sendKeys(username);
            await driver.manage().window().setRect({ width: 1920, height: 1080 });

            const passwordInput = await driver.findElement(By.name("wt17$OutSystemsUIWeb_wt12$block$wtContent$wt21$OutSystemsUIWeb_wt68$block$wtInput$wtPasswordInput"))
            await passwordInput.sendKeys(password);
            await driver.manage().window().setRect({ width: 1920, height: 1080 });

            const submitButton = await driver.findElement(By.name("wt17$OutSystemsUIWeb_wt12$block$wtContent$wt21$OutSystemsUIWeb_wt40$block$wtColumn2$wtbtnEntrar"))
            await driver.wait(
                until.stalenessOf(submitButton),
                30000,
                "esperando o preenchimento do CAPTCHA"

            )
            
            const additionalDetails = await driver.findElement(By.id("wt20_OutSystemsUIWeb_wt28_block_wtContent_wtMainContent_AGV_Acesso_VW_wt22_block_wt2_wt21"))
            await additionalDetails.click()
            const containerSelector = 'div[id*="wtContainerReferencia"]';
            return {
                value: await driver.findElement(By.xpath("//div[contains(@class, 'margin-top-xs font-bold')][contains(text(), 'kWh')]")).getText(), 
                
                //value: await driver.findElement(By.xpath("//div[contains(@class, 'margin-top-xs font-bold')][contains(text(), 'R$')]")).getText()
             } 
   
            
        }catch (error) {
            console.error('Search error:', error);
            throw error;
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
        
    }
    async takeScreenshot(url) {
        let driver;
        try {
            driver = await this.createDriver();
            await driver.get(url);
    
            // Wait for body and ensure page is fully loaded
            await driver.wait(async () => {
                const readyState = await driver.executeScript('return document.readyState');
                return readyState === 'complete';
            }, 10000, 'Timeout waiting for page load');
    
            // Wait for any dynamic content
            await driver.sleep(2000); // Add small delay for dynamic content
    
            // Set window size to ensure consistent screenshots
            await driver.manage().window().setRect({ width: 720, height: 480 });
    
            // Take screenshot and convert to PNG buffer
            const screenshot = await driver.takeScreenshot();
            const buffer = Buffer.from(screenshot, 'base64');
    
            return {
                success: true,
                screenshot: buffer,
                contentType: 'image/png'
            };
    
        } catch (error) {
            console.error('Screenshot error:', error);
            throw error;
        } finally {
            if (driver) {
                await driver.quit();
            }
        }
    }
}

module.exports = new SeleniumService();