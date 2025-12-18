import { test, expect } from '@playwright/test';
import { PageFactory } from '../src/pages/base/PageFactory';
import { logger } from '../src/utils/logger';
import { TestDataManager } from '../src/utils/testDataManager';
import { HomePage } from '../src/pages/bilibili/HomePage';
import { SearchResultsPage } from '../src/pages/bilibili/SearchResultsPage';
import { VideoPage } from '../src/pages/bilibili/VideoPage';

test.describe('视频搜索与播放功能测试', () => {
  let pageFactory: PageFactory;
  
  test.beforeEach(async ({ page }) => {
    pageFactory = new PageFactory();
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.navigateToHomePage();
  });

  test.afterEach(() => {
    pageFactory.clear();
  });

  test('测试搜索功能', async ({ page }) => {
    logger.info('执行测试：测试搜索功能');
    
    // 获取测试数据
    const searchKeywords = await TestDataManager.getInstance().getCsvData('searchKeywords');
    const keyword = searchKeywords[0].keyword;
    
    // 执行搜索
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.search(keyword);
    
    // 验证搜索结果
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    
    // 检查搜索结果数量大于0
    const resultCount = await searchResultsPage.getResultCountOnPage();
    await expect(resultCount).toBeGreaterThan(0);
    
    // 检查搜索关键词是否正确
    const currentKeyword = await searchResultsPage.getCurrentSearchKeyword();
    await expect(currentKeyword).toContain(keyword);
    
    logger.info('测试通过：搜索功能正常');
  });

  test('测试视频播放功能', async ({ page }) => {
    logger.info('执行测试：测试视频播放功能');
    
    // 获取测试数据
    const searchKeywords = await TestDataManager.getInstance().getCsvData('searchKeywords');
    const keyword = searchKeywords[0].keyword;
    
    // 搜索视频
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.search(keyword);
    
    // 进入搜索结果页面
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    
    // 点击第一个视频
    await searchResultsPage.clickResultCard(0);
    
    // 验证视频播放页面
    const videoPage = pageFactory.getPage(page, 'videopage') as VideoPage;
    await videoPage.waitForPageLoad();
    
    // 检查视频播放器是否可见
    await expect(videoPage.getVideoPlayer()).toBeVisible();
    
    // 检查视频标题是否存在
    const videoTitle = await videoPage.getVideoTitle();
    await expect(videoTitle).not.toBeNull();
    
    logger.info('测试通过：视频播放功能正常');
  });

  test('测试视频播放控制功能', async ({ page }) => {
    logger.info('执行测试：测试视频播放控制功能');
    
    // 获取测试数据
    const searchKeywords = await TestDataManager.getInstance().getCsvData('searchKeywords');
    const keyword = searchKeywords[0].keyword;
    
    // 搜索并播放视频
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.search(keyword);
    
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    await searchResultsPage.clickResultCard(0);
    
    const videoPage = pageFactory.getPage(page, 'videopage') as VideoPage;
    await videoPage.waitForPageLoad();
    
    // 测试播放/暂停功能
    await videoPage.playVideo();
    await page.waitForTimeout(2000); // 等待视频播放2秒
    await videoPage.pauseVideo();
    
    // 测试进度条拖动
    await videoPage.seekVideo(30); // 跳转到30%位置
    
    // 测试音量控制
    await videoPage.toggleVolume();
    
    logger.info('测试通过：视频播放控制功能正常');
  });

  test('测试搜索结果分页功能', async ({ page }) => {
    logger.info('执行测试：测试搜索结果分页功能');
    
    // 搜索视频
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    await homePage.search('Python教程');
    
    // 进入搜索结果页面
    const searchResultsPage = pageFactory.getPage(page, 'searchresults') as SearchResultsPage;
    await searchResultsPage.waitForPageLoad();
    
    // 检查第一页
    const firstPage = await searchResultsPage.getCurrentPage();
    await expect(firstPage).toBe(1);
    
    // 跳转到第二页
    await searchResultsPage.goToPage(2);
    await page.waitForTimeout(2000); // 等待页面加载
    
    // 检查第二页
    const secondPage = await searchResultsPage.getCurrentPage();
    await expect(secondPage).toBe(2);
    
    // 使用下一页按钮
    await searchResultsPage.goToNextPage();
    await page.waitForTimeout(2000); // 等待页面加载
    
    // 检查第三页
    const thirdPage = await searchResultsPage.getCurrentPage();
    await expect(thirdPage).toBe(3);
    
    // 使用上一页按钮
    await searchResultsPage.goToPreviousPage();
    await page.waitForTimeout(2000); // 等待页面加载
    
    // 检查是否回到第二页
    const backToSecondPage = await searchResultsPage.getCurrentPage();
    await expect(backToSecondPage).toBe(2);
    
    logger.info('测试通过：搜索结果分页功能正常');
  });

  test('测试搜索建议功能', async ({ page }) => {
    logger.info('执行测试：测试搜索建议功能');
    
    // 进入首页
    const homePage = pageFactory.getPage(page, 'home') as HomePage;
    
    // 悬停在搜索框上显示搜索历史
    await homePage.showSearchHistory();
    
    // 检查搜索历史是否显示
    await expect(homePage.getSearchHistory()).toBeVisible();
    
    logger.info('测试通过：搜索建议功能正常');
  });
});
