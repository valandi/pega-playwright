import { test } from '@playwright/test';
import { BatchInfo, Configuration, VisualGridRunner, BrowserType, Eyes, Target } from '@applitools/eyes-playwright';

export let Batch: BatchInfo;
export let config: Configuration;
export let Runner: VisualGridRunner;

const username = "cacsr@cosmos";
const password = "install12345!";

test.beforeAll(async() => {
  Runner = new VisualGridRunner({ testConcurrency: 1 });

  Batch = new BatchInfo({name: 'Pega App - Playwright'});
  config = new Configuration();

  config.setBatch(Batch);

  config.setWaitBeforeScreenshots(5000);
  config.setDisableBrowserFetching(true);
  config.addBrowser(1920, 1080, BrowserType.CHROME);
  config.addBrowser(1920, 1080, BrowserType.FIREFOX);
});

test.describe('ACME Bank', () => {
  let eyes: Eyes;

  test.beforeEach(async ({ page }) => {
    eyes = new Eyes(Runner, config);
    await eyes.open(page, 'Pega App', 'Pega Test');
  });
  
  test('log into a bank account', async ({ page }) => {

    await page.goto("https://lab0578.lab.pega.com/prweb/app/CustomerService/interactions/I-9062");
      
    // Verify the full login page loaded correctly.
    await eyes.check('Login window', Target.window().fully());

    // Perform login.
    await page.locator('id=txtUserID').fill(username);
    await page.locator('id=txtPassword').fill(password);
    await page.locator('id=sub').click();

    await eyes.check('Home Screen', Target.window().fully());

    // Click plus
    await page.locator('xpath=//html/body/app-root/div/div[1]/nav/div[1]/div[1]/ul/li/button').click();
    await eyes.check('After clicking plus', Target.window().fully());
    
    // Click 'Demo Pop: Steve Smith, verified'
    await page.locator('xpath=//html/body/app-root/div/div[1]/nav/div[1]/div[1]/ul/li/div/div[2]/div/fieldset/ul/li[2]/button').click();
    await eyes.check('After clicking \"Demo Pop:Steve Smith, verified\"', Target.window().fully());

    // Click 'Accept'
    await page.locator('xpath=//*[@id="root-container"]/article/header/div[2]/button').click();
    await eyes.check('After clicking \"Accept\"', Target.window().fully());
    

    await eyes.check('Tasks Page', Target.window().fully());
  });
  
  test.afterEach(async () => {
    await eyes.closeAsync();
  });
});

test.afterAll(async() => {
  const results = await Runner.getAllTestResults();
  console.log('Visual test results', results);
});
