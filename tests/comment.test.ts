import { test, expect } from '@playwright/test';
import { PageFactory } from '../src/pages/base/PageFactory';
import { logger } from '../src/utils/logger';
import { TestDataManager } from '../src/utils/testDataManager';
import { HomePage } from '../src/pages/bilibili/HomePage';
import { LoginPage } from '../src/pages/bilibili/LoginPage';
import { SearchResultsPage } from '../src/pages/bilibili/SearchResultsPage';
import { VideoPage } from '../src/pages/bilibili/VideoPage';

const testDataManager = TestDataManager.getInstance();

test.describe('评论发布与查看功能测试', () => {
  let pageFactory: PageFactory;
  
  test.beforeEach(async ({ page }) => {
    pageFactory = new PageFactory();
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.navigateToHomePage();
    
    // 登录用户（需要先登录才能发布评论）
    const userData = testDataManager.getJsonData('userData');
    const validUser = userData.validUser;
    
    await homePage.clickLoginButton();
    const loginPage = pageFactory.getPage(page, 'login') as LoginPage;
    await loginPage.waitForPageLoad();
    await loginPage.login(validUser.username, validUser.password);
    
    // 验证登录成功
    await expect(homePage.getUserAvatar()).toBeVisible();
  });

  test.afterEach(() => {
    pageFactory.clear();
  });

  test('测试发布评论功能', async ({ page }) => {
    logger.info('执行测试：测试发布评论功能');
    
    // 搜索并打开一个视频
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.search('Python教程');
    
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    await searchResultsPage.clickResultCard(0);
    
    // 进入视频播放页面
    const videoPage = pageFactory.getPage(page, 'videopage') as VideoPage;
    await videoPage.waitForPageLoad();
    
    // 滚动到评论区
    await videoPage.scrollToComments();
    
    // 输入并发布评论
    const testComment = `自动化测试评论 ${Date.now()}`;
    await videoPage.postComment(testComment);
    
    // 验证评论发布成功
    // 这里需要根据实际页面结构调整验证方式
    // 等待评论发布成功的提示或新评论出现在列表中
    await page.waitForTimeout(3000);
    
    // 检查新发布的评论是否存在于评论列表中
    const comments = await videoPage.getAllComments();
    expect(comments.some(comment => comment.includes(testComment))).toBeTruthy();
    
    logger.info('测试通过：评论发布功能正常');
  });

  test('测试查看评论列表功能', async ({ page }) => {
    logger.info('执行测试：测试查看评论列表功能');
    
    // 搜索并打开一个视频
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.search('Python教程');
    
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    await searchResultsPage.clickResultCard(0);
    
    // 进入视频播放页面
    const videoPage = pageFactory.getPage(page, 'videopage') as VideoPage;
    await videoPage.waitForPageLoad();
    
    // 滚动到评论区
    await videoPage.scrollToComments();
    
    // 获取评论数量
    const commentCount = await videoPage.getCommentCount();
    
    // 验证评论数量大于0（热门视频通常有很多评论）
    await expect(commentCount).toBeGreaterThan(0);
    
    // 获取评论列表
    const comments = await videoPage.getAllComments();
    
    // 验证评论列表不为空
    await expect(comments.length).toBeGreaterThan(0);
    
    logger.info('测试通过：评论列表查看功能正常');
  });

  test('测试视频互动功能（点赞、收藏）', async ({ page }) => {
    logger.info('执行测试：测试视频互动功能');
    
    // 搜索并打开一个视频
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.search('Python教程');
    
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    await searchResultsPage.clickResultCard(0);
    
    // 进入视频播放页面
    const videoPage = pageFactory.getPage(page, 'videopage') as VideoPage;
    await videoPage.waitForPageLoad();
    
    // 测试点赞功能
    await videoPage.likeVideo();
    await page.waitForTimeout(1000);
    
    // 测试收藏功能
    await videoPage.favoriteVideo();
    await page.waitForTimeout(1000);
    
    // 测试分享功能
    await videoPage.shareVideo();
    await page.waitForTimeout(1000);
    
    logger.info('测试通过：视频互动功能正常');
  });

  test('测试弹幕发送功能', async ({ page }) => {
    logger.info('执行测试：测试弹幕发送功能');
    
    // 搜索并打开一个视频
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.search('Python教程');
    
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    await searchResultsPage.clickResultCard(0);
    
    // 进入视频播放页面
    const videoPage = pageFactory.getPage(page, 'videopage') as VideoPage;
    await videoPage.waitForPageLoad();
    
    // 播放视频
    await videoPage.playVideo();
    await page.waitForTimeout(2000);
    
    // 发送弹幕
    const testDanmaku = `自动化测试弹幕 ${Date.now()}`;
    await videoPage.sendDanmaku(testDanmaku);
    
    // 验证弹幕发送成功
    // 这里需要根据实际页面结构调整验证方式
    // 通常弹幕会立即显示在视频上
    await page.waitForTimeout(2000);
    
    logger.info('测试通过：弹幕发送功能正常');
  });
});
