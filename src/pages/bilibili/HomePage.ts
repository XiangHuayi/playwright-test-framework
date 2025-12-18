import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { logger } from '../../utils/logger';

/**
 * Bilibili Home Page
 */
export class HomePage extends BasePage {
  // Page elements
  private readonly loginButton: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchHistory: Locator;
  private readonly userAvatar: Locator;
  private readonly navMenu: Locator;
  private readonly videoCards: Locator;
  private readonly featuredSection: Locator;
  private readonly liveSection: Locator;
  private readonly animeSection: Locator;
  private readonly gameSection: Locator;
  private readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.loginButton = page.locator('.header-login-entry');
    this.searchInput = page.locator('#nav-searchform > input');
    this.searchButton = page.locator('#nav-searchform > div > button');
    this.searchHistory = page.locator('.search-history');
    this.userAvatar = page.locator('.header-avatar-wrap');
    this.navMenu = page.locator('.nav-menu');
    this.videoCards = page.locator('.bili-video-card');
    this.featuredSection = page.locator('#i_cecream > div:nth-child(2) > div > div');
    this.liveSection = page.locator('.live-entry');
    this.animeSection = page.locator('.anime-entry');
    this.gameSection = page.locator('.game-entry');
    this.footer = page.locator('.footer');
  }

  /**
   * Navigate to Bilibili home page
   */
  async navigateToHomePage(): Promise<void> {
    logger.info('Navigating to Bilibili home page');
    await this.navigate('/');
  }

  /**
   * Click on login button
   */
  async clickLoginButton(): Promise<void> {
    logger.info('Clicking login button');
    await this.click(this.loginButton);
  }

  /**
   * Perform search with keyword
   * @param keyword - Search keyword
   */
  async search(keyword: string): Promise<void> {
    logger.info(`Searching for keyword: ${keyword}`);
    await this.fill(this.searchInput, keyword);
    await this.click(this.searchButton);
  }

  /**
   * Hover over search input to show search history
   */
  async showSearchHistory(): Promise<void> {
    logger.info('Showing search history');
    await this.hover(this.searchInput);
    await this.waitForVisible(this.searchHistory);
  }

  /**
   * Check if user is logged in
   * @returns True if user is logged in, false otherwise
   */
  async isUserLoggedIn(): Promise<boolean> {
    logger.info('Checking if user is logged in');
    return this.isVisible(this.userAvatar);
  }

  /**
   * Click on user avatar
   */
  async clickUserAvatar(): Promise<void> {
    logger.info('Clicking user avatar');
    await this.click(this.userAvatar);
  }

  /**
   * Click on navigation menu item
   * @param menuItem - Menu item text
   */
  async clickNavMenuItem(menuItem: string): Promise<void> {
    logger.info(`Clicking navigation menu item: ${menuItem}`);
    const menuItemLocator = this.navMenu.locator(`text=${menuItem}`);
    await this.click(menuItemLocator);
  }

  /**
   * Get number of video cards visible on page
   * @returns Number of video cards
   */
  async getVideoCardCount(): Promise<number> {
    logger.info('Getting video card count');
    await this.waitForVisible(this.videoCards);
    return this.videoCards.count();
  }

  /**
   * Click on a video card by index
   * @param index - Video card index (0-based)
   */
  async clickVideoCardByIndex(index: number): Promise<void> {
    logger.info(`Clicking video card at index: ${index}`);
    const videoCard = this.videoCards.nth(index);
    await this.click(videoCard);
  }

  /**
   * Click on a video card by title
   * @param title - Video title
   */
  async clickVideoCardByTitle(title: string): Promise<void> {
    logger.info(`Clicking video card with title: ${title}`);
    const videoCard = this.videoCards.locator(`text=${title}`).first();
    await this.click(videoCard);
  }

  /**
   * Check if featured section is visible
   * @returns True if featured section is visible, false otherwise
   */
  async isFeaturedSectionVisible(): Promise<boolean> {
    logger.info('Checking if featured section is visible');
    return this.isVisible(this.featuredSection);
  }

  /**
   * Check if live section is visible
   * @returns True if live section is visible, false otherwise
   */
  async isLiveSectionVisible(): Promise<boolean> {
    logger.info('Checking if live section is visible');
    return this.isVisible(this.liveSection);
  }

  /**
   * Check if anime section is visible
   * @returns True if anime section is visible, false otherwise
   */
  async isAnimeSectionVisible(): Promise<boolean> {
    logger.info('Checking if anime section is visible');
    return this.isVisible(this.animeSection);
  }

  /**
   * Check if game section is visible
   * @returns True if game section is visible, false otherwise
   */
  async isGameSectionVisible(): Promise<boolean> {
    logger.info('Checking if game section is visible');
    return this.isVisible(this.gameSection);
  }

  /**
   * Check if footer is visible
   * @returns True if footer is visible, false otherwise
   */
  async isFooterVisible(): Promise<boolean> {
    logger.info('Checking if footer is visible');
    return this.isVisible(this.footer);
  }

  /**
   * Get page title
   * @returns Page title
   */
  async getPageTitle(): Promise<string> {
    logger.info('Getting page title');
    return this.page.title();
  }

  /**
   * Get search input locator
   * @returns Search input locator
   */
  getSearchInput(): Locator {
    return this.searchInput;
  }

  /**
   * Get search history locator
   * @returns Search history locator
   */
  getSearchHistory(): Locator {
    return this.searchHistory;
  }

  /**
   * Get navigation menu locator
   * @returns Navigation menu locator
   */
  getNavMenu(): Locator {
    return this.navMenu;
  }

  /**
   * Get video cards locator
   * @returns Video cards locator
   */
  getVideoCards(): Locator {
    return this.videoCards;
  }

  /**
   * Get featured section locator
   * @returns Featured section locator
   */
  getFeaturedSection(): Locator {
    return this.featuredSection;
  }

  /**
   * Get user avatar locator
   * @returns User avatar locator
   */
  getUserAvatar(): Locator {
    return this.userAvatar;
  }

  /**
   * Get login button locator
   * @returns Login button locator
   */
  getLoginButton(): Locator {
    return this.loginButton;
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    logger.info('Waiting for home page to load completely');
    await this.waitForVisible(this.featuredSection);
    await this.waitForVisible(this.videoCards);
    await this.waitForNetworkIdle();
  }
}
