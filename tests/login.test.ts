import { test, expect } from '@playwright/test';
import { PageFactory } from '../src/pages/base/PageFactory';
import { Configuration } from '../src/config/config';
import { logger } from '../src/utils/logger';
import { TestDataManager } from '../src/utils/testDataManager';
import { HomePage } from '../src/pages/bilibili/HomePage';
import { LoginPage } from '../src/pages/bilibili/LoginPage';

const config = Configuration.getInstance();
const testDataManager = TestDataManager.getInstance();

test.describe('用户登录功能测试', () => {
  let pageFactory: PageFactory;
  
  test.beforeEach(async ({ page }) => {
    pageFactory = new PageFactory();
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.navigateToHomePage();
  });

  test.afterEach(() => {
    pageFactory.clear();
  });

  test('测试成功登录', async ({ page }) => {
    logger.info('执行测试：测试成功登录');
    
    // 获取测试数据
    const userData = testDataManager.getJsonData('userData');
    const validUser = userData.validUser;
    
    // 导航到登录页面
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.clickLoginButton();
    
    // 执行登录操作
    const loginPage = pageFactory.getPage(page, 'login') as LoginPage;
    await loginPage.waitForPageLoad();
    await loginPage.login(validUser.username, validUser.password);
    
    // 验证登录成功（检查用户头像是否显示）
    await expect(homePage.getUserAvatar()).toBeVisible();
    
    logger.info('测试通过：成功登录');
  });

  test('测试失败登录 - 无效用户名', async ({ page }) => {
    logger.info('执行测试：测试失败登录 - 无效用户名');
    
    // 获取测试数据
    const userData = testDataManager.getJsonData('userData');
    const invalidUser = userData.invalidUser;
    
    // 导航到登录页面
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.clickLoginButton();
    
    // 执行登录操作
    const loginPage = pageFactory.getPage(page, 'login') as LoginPage;
    await loginPage.waitForPageLoad();
    await loginPage.login(invalidUser.username, invalidUser.password);
    
    // 验证登录失败（检查错误消息是否显示）
    const errorMessage = await loginPage.getErrorMessageText();
    await expect(errorMessage).not.toBeNull();
    await expect(loginPage.isLoginFailed()).toBeTruthy();
    
    logger.info('测试通过：无效用户名登录失败');
  });

  test('测试登录表单元素存在', async ({ page }) => {
    logger.info('执行测试：测试登录表单元素存在');
    
    // 导航到登录页面
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.clickLoginButton();
    
    // 检查登录表单元素是否存在
    const loginPage = pageFactory.getPage(page, 'login') as LoginPage;
    await loginPage.waitForPageLoad();
    
    await expect(loginPage.getUsernameInput()).toBeVisible();
    await expect(loginPage.getPasswordInput()).toBeVisible();
    await expect(loginPage.getLoginSubmitButton()).toBeVisible();
    await expect(loginPage.getQrCodeLoginTab()).toBeVisible();
    await expect(loginPage.getPasswordLoginTab()).toBeVisible();
    await expect(loginPage.getMobileLoginTab()).toBeVisible();
    
    logger.info('测试通过：登录表单元素存在');
  });

  test('测试登录页面切换', async ({ page }) => {
    logger.info('执行测试：测试登录页面切换');
    
    // 导航到登录页面
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.clickLoginButton();
    
    // 测试页面切换
    const loginPage = pageFactory.getPage(page, 'login') as LoginPage;
    await loginPage.waitForPageLoad();
    
    // 切换到密码登录
    await loginPage.switchToPasswordLogin();
    await expect(loginPage.getUsernameInput()).toBeVisible();
    await expect(loginPage.getPasswordInput()).toBeVisible();
    
    // 切换到二维码登录
    await loginPage.switchToQrCodeLogin();
    await expect(loginPage.getQrCodeContainer()).toBeVisible();
    
    // 切换到手机登录
    await loginPage.switchToMobileLogin();
    // 这里可以添加手机登录的验证
    
    logger.info('测试通过：登录页面切换功能正常');
  });

  test('测试关闭登录窗口', async ({ page }) => {
    logger.info('执行测试：测试关闭登录窗口');
    
    // 导航到登录页面
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.clickLoginButton();
    
    // 关闭登录窗口
    const loginPage = pageFactory.getPage(page, 'login') as LoginPage;
    await loginPage.waitForPageLoad();
    await loginPage.closeLoginModal();
    
    // 验证登录窗口已关闭
    await expect(loginPage.getLoginForm()).not.toBeVisible();
    
    logger.info('测试通过：登录窗口关闭功能正常');
  });
});
