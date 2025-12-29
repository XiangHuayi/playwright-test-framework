import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { logger } from '../../utils/logger';
import { LocatorManager } from '../../utils/LocatorManager';

/**
 * Bilibili Search Results Page
 */
export class SearchResultsPage extends BasePage {
  // Page elements
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchKeywords: Locator;
  private readonly searchResultsCount: Locator;
  private readonly videoResults: Locator;
  private readonly filterTabs: Locator;
  private readonly sortDropdown: Locator;
  private readonly filterOptions: Locator;
  private readonly pagination: Locator;
  private readonly currentPage: Locator;
  private readonly totalPages: Locator;
  private readonly nextPageButton: Locator;
  private readonly previousPageButton: Locator;
  private readonly searchSuggestions: Locator;
  private readonly searchHistory: Locator;
  private readonly emptyResults: Locator;
  private readonly resultCards: Locator;
  private readonly resultTitles: Locator;
  private readonly resultAuthors: Locator;
  private readonly resultViews: Locator;
  private readonly resultDates: Locator;
  private readonly relatedSearches: Locator;

  constructor(page: Page) {
    super(page);
    
    // Load locators from YAML
    const searchResultsPageLocators = LocatorManager.getPageLocators('bilibili.searchResultsPage');
    
    if (!searchResultsPageLocators) {
      throw new Error('Failed to load locators for search results page');
    }
    
    // Initialize locators
    this.searchInput = page.locator(searchResultsPageLocators.searchInput);
    this.searchButton = page.locator(searchResultsPageLocators.searchButton);
    this.searchKeywords = page.locator(searchResultsPageLocators.searchKeywords);
    this.searchResultsCount = page.locator(searchResultsPageLocators.searchResultsCount);
    this.videoResults = page.locator(searchResultsPageLocators.videoResults);
    this.filterTabs = page.locator(searchResultsPageLocators.filterTabs);
    this.sortDropdown = page.locator(searchResultsPageLocators.sortDropdown);
    this.filterOptions = page.locator(searchResultsPageLocators.filterOptions);
    this.pagination = page.locator(searchResultsPageLocators.pagination);
    this.currentPage = page.locator(searchResultsPageLocators.currentPage);
    this.totalPages = page.locator(searchResultsPageLocators.totalPages);
    this.nextPageButton = page.locator(searchResultsPageLocators.nextPageButton);
    this.previousPageButton = page.locator(searchResultsPageLocators.previousPageButton);
    this.searchSuggestions = page.locator(searchResultsPageLocators.searchSuggestions);
    this.searchHistory = page.locator(searchResultsPageLocators.searchHistory);
    this.emptyResults = page.locator(searchResultsPageLocators.emptyResults);
    this.resultCards = page.locator(searchResultsPageLocators.resultCards);
    this.resultTitles = page.locator(searchResultsPageLocators.resultTitles);
    this.resultAuthors = page.locator(searchResultsPageLocators.resultAuthors);
    this.resultViews = page.locator(searchResultsPageLocators.resultViews);
    this.resultDates = page.locator(searchResultsPageLocators.resultDates);
    this.relatedSearches = page.locator(searchResultsPageLocators.relatedSearches);
  }

  /**
   * Get current search keyword
   * @returns Current search keyword
   */
  async getCurrentSearchKeyword(): Promise<string | null> {
    logger.info('Getting current search keyword');
    return this.searchKeywords.textContent();
  }

  /**
   * Get search results count
   * @returns Search results count
   */
  async getSearchResultsCount(): Promise<number> {
    logger.info('Getting search results count');
    const countText = await this.searchResultsCount.textContent();
    const count = countText?.match(/\d+/);
    return count ? parseInt(count[0], 10) : 0;
  }

  /**
   * Click on filter tab
   * @param tabName - Filter tab name
   */
  async clickFilterTab(tabName: string): Promise<void> {
    logger.info(`Clicking filter tab: ${tabName}`);
    const tab = this.filterTabs.locator(`text=${tabName}`);
    await this.click(tab);
  }

  /**
   * Select sort option
   * @param sortOption - Sort option
   */
  async selectSortOption(sortOption: string): Promise<void> {
    logger.info(`Selecting sort option: ${sortOption}`);
    await this.click(this.sortDropdown);
    const option = this.filterOptions.locator(`text=${sortOption}`);
    await this.click(option);
  }

  /**
   * Get number of result cards on current page
   * @returns Number of result cards
   */
  async getResultCountOnPage(): Promise<number> {
    logger.info('Getting number of result cards on current page');
    return this.resultCards.count();
  }

  /**
   * Click on result card by index
   * @param index - Result card index (0-based)
   */
  async clickResultCard(index: number): Promise<void> {
    logger.info(`Clicking result card at index: ${index}`);
    const card = this.resultCards.nth(index);
    await this.click(card);
  }

  /**
   * Click on result card by title
   * @param title - Result card title
   */
  async clickResultCardByTitle(title: string): Promise<void> {
    logger.info(`Clicking result card with title: ${title}`);
    const card = this.resultTitles.locator(`text=${title}`).first();
    await this.click(card);
  }

  /**
   * Get all result titles on current page
   * @returns Array of result titles
   */
  async getResultTitles(): Promise<string[]> {
    logger.info('Getting all result titles on current page');
    const titles = await this.resultTitles.all();
    const titleTexts: string[] = [];
    
    for (const title of titles) {
      const text = await title.textContent();
      if (text) {
        titleTexts.push(text.trim());
      }
    }
    
    return titleTexts;
  }

  /**
   * Get all result authors on current page
   * @returns Array of result authors
   */
  async getResultAuthors(): Promise<string[]> {
    logger.info('Getting all result authors on current page');
    const authors = await this.resultAuthors.all();
    const authorTexts: string[] = [];
    
    for (const author of authors) {
      const text = await author.textContent();
      if (text) {
        authorTexts.push(text.trim());
      }
    }
    
    return authorTexts;
  }

  /**
   * Check if result title contains keyword
   * @param keyword - Keyword to check
   * @returns True if any result title contains keyword, false otherwise
   */
  async hasResultWithKeyword(keyword: string): Promise<boolean> {
    logger.info(`Checking if any result title contains keyword: ${keyword}`);
    const titles = await this.getResultTitles();
    return titles.some(title => title.toLowerCase().includes(keyword.toLowerCase()));
  }

  /**
   * Go to next page
   */
  async goToNextPage(): Promise<void> {
    logger.info('Going to next page');
    await this.click(this.nextPageButton);
  }

  /**
   * Go to previous page
   */
  async goToPreviousPage(): Promise<void> {
    logger.info('Going to previous page');
    await this.click(this.previousPageButton);
  }

  /**
   * Go to specific page
   * @param pageNumber - Page number to go to
   */
  async goToPage(pageNumber: number): Promise<void> {
    logger.info(`Going to page: ${pageNumber}`);
    const pageButton = this.pagination.locator(`text=${pageNumber}`);
    await this.click(pageButton);
  }

  /**
   * Get current page number
   * @returns Current page number
   */
  async getCurrentPage(): Promise<number> {
    logger.info('Getting current page number');
    const pageText = await this.currentPage.textContent();
    return parseInt(pageText || '1', 10);
  }

  /**
   * Get total number of pages
   * @returns Total number of pages
   */
  async getTotalPages(): Promise<number> {
    logger.info('Getting total number of pages');
    const totalText = await this.totalPages.textContent();
    return parseInt(totalText || '1', 10);
  }

  /**
   * Check if there are no results
   * @returns True if no results, false otherwise
   */
  async isEmptyResults(): Promise<boolean> {
    logger.info('Checking if there are no results');
    return this.isVisible(this.emptyResults);
  }

  /**
   * Click on related search term
   * @param term - Related search term
   */
  async clickRelatedSearch(term: string): Promise<void> {
    logger.info(`Clicking related search term: ${term}`);
    const relatedTerm = this.relatedSearches.locator(`text=${term}`);
    await this.click(relatedTerm);
  }

  /**
   * Get related search terms
   * @returns Array of related search terms
   */
  async getRelatedSearches(): Promise<string[]> {
    logger.info('Getting related search terms');
    const terms = await this.relatedSearches.all();
    const termTexts: string[] = [];
    
    for (const term of terms) {
      const text = await term.textContent();
      if (text) {
        termTexts.push(text.trim());
      }
    }
    
    return termTexts;
  }

  /**
   * Refine search with new keyword
   * @param keyword - New search keyword
   */
  async refineSearch(keyword: string): Promise<void> {
    logger.info(`Refining search with keyword: ${keyword}`);
    await this.fill(this.searchInput, keyword);
    await this.click(this.searchButton);
  }

  /**
   * Wait for search results to load completely
   */
  async waitForPageLoad(): Promise<void> {
    logger.info('Waiting for search results page to load completely');
    await this.waitForVisible(this.videoResults);
    await this.waitForNetworkIdle();
  }
}
