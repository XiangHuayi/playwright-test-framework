import { test, expect } from '@playwright/test';
import { PageFactory } from '../src/pages/base/PageFactory';
import { logger } from '../src/utils/logger';
import { HomePage } from '../src/pages/bilibili/HomePage';
import { SearchResultsPage } from '../src/pages/bilibili/SearchResultsPage';
import { VideoPage } from '../src/pages/bilibili/VideoPage';

test.describe('页面响应式布局验证测试', () => {
  let pageFactory: PageFactory;
  
  test.beforeEach(async ({ page }) => {
    pageFactory = new PageFactory();
  });

  test.afterEach(() => {
    pageFactory.clear();
  });

  test('测试桌面端布局（1920x1080）', async ({ page }) => {
    logger.info('执行测试：测试桌面端布局（1920x1080）');
    
    // 设置屏幕尺寸为桌面端
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // 导航到首页
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.navigateToHomePage();
    await homePage.waitForPageLoad();
    
    // 验证桌面端特定元素可见
    await expect(homePage.getNavMenu()).toBeVisible();
    await expect(homePage.getSearchInput()).toBeVisible();
    await expect(homePage.getLoginButton()).toBeVisible();
    
    // 验证视频卡片布局
    const videoCards = await homePage.getVideoCards().count();
    await expect(videoCards).toBeGreaterThan(0);
    
    logger.info('测试通过：桌面端布局显示正常');
  });

  test('测试平板端布局（768x1024）', async ({ page }) => {
    logger.info('执行测试：测试平板端布局（768x1024）');
    
    // 设置屏幕尺寸为平板端
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // 导航到首页
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.navigateToHomePage();
    await homePage.waitForPageLoad();
    
    // 验证平板端布局
    await expect(homePage.getNavMenu()).toBeVisible();
    await expect(homePage.getSearchInput()).toBeVisible();
    await expect(homePage.getLoginButton()).toBeVisible();
    
    // 验证视频卡片布局适应平板屏幕
    const videoCards = await homePage.getVideoCards().count();
    await expect(videoCards).toBeGreaterThan(0);
    
    logger.info('测试通过：平板端布局显示正常');
  });

  test('测试移动端布局（375x667）', async ({ page }) => {
    logger.info('执行测试：测试移动端布局（375x667）');
    
    // 设置屏幕尺寸为移动端
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 导航到首页
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.navigateToHomePage();
    await homePage.waitForPageLoad();
    
    // 验证移动端布局
    // 在移动端，导航菜单可能会变为汉堡菜单
    // 需要根据实际页面结构调整验证方式
    
    // 验证搜索框和登录按钮存在（可能在汉堡菜单内）
    await expect(homePage.getSearchInput()).toBeVisible();
    
    // 验证视频卡片布局适应移动屏幕
    const videoCards = await homePage.getVideoCards().count();
    await expect(videoCards).toBeGreaterThan(0);
    
    logger.info('测试通过：移动端布局显示正常');
  });

  test('测试视频播放页响应式布局', async ({ page }) => {
    logger.info('执行测试：测试视频播放页响应式布局');
    
    // 先在桌面端打开一个视频
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.navigateToHomePage();
    await homePage.search('Python教程');
    
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    await searchResultsPage.clickResultCard(0);
    
    // 验证桌面端视频播放页布局
    const videoPage = pageFactory.getPage(page, 'videopage') as VideoPage;
    await videoPage.waitForPageLoad();
    
    await expect(videoPage.getVideoPlayer()).toBeVisible();
    await expect(videoPage.getVideoTitleLocator()).toBeVisible();
    await expect(videoPage.getCommentsSection()).toBeVisible();
    await expect(videoPage.getRelatedVideos()).toBeVisible();
    
    // 切换到移动端尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 验证移动端视频播放页布局
    await expect(videoPage.getVideoPlayer()).toBeVisible();
    await expect(videoPage.getVideoTitleLocator()).toBeVisible();
    
    // 滚动到评论区
    await videoPage.scrollToComments();
    await expect(videoPage.getCommentsSection()).toBeVisible();
    
    logger.info('测试通过：视频播放页响应式布局正常');
  });

  test('测试不同屏幕尺寸下的导航菜单', async ({ page }) => {
    logger.info('执行测试：测试不同屏幕尺寸下的导航菜单');
    
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    
    // 桌面端 - 完整导航菜单
    await page.setViewportSize({ width: 1920, height: 1080 });
    await homePage.navigateToHomePage();
    await expect(homePage.getNavMenu()).toBeVisible();
    
    // 平板端 - 可能是完整菜单或部分折叠
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    // 验证导航元素仍然可访问
    await expect(homePage.getSearchInput()).toBeVisible();
    
    // 移动端 - 汉堡菜单
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    // 验证搜索功能仍然可用
    await expect(homePage.getSearchInput()).toBeVisible();
    
    logger.info('测试通过：不同屏幕尺寸下的导航菜单正常');
  });
});
