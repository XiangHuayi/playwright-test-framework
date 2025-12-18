import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from '../bilibili/HomePage';
import { LoginPage } from '../bilibili/LoginPage';
import { VideoPage } from '../bilibili/VideoPage';
import { SearchResultsPage } from '../bilibili/SearchResultsPage';

/**
 * Page Factory interface
 */
export interface IPageFactory {
  /**
   * Get a page object by name
   * @param pageName - Name of the page to get
   * @returns Page object
   */
  getPage(page: Page, pageName: string): BasePage;
  
  /**
   * Clear all page instances
   */
  clear(): void;
}

/**
 * Page Factory implementation
 */
export class PageFactory implements IPageFactory {
  private pageInstances: Map<string, BasePage> = new Map();

  /**
   * Get a page object by name
   * @param page - Playwright page instance
   * @param pageName - Name of the page to get
   * @returns Page object
   */
  getPage(page: Page, pageName: string): BasePage {
    const normalizedPageName = pageName.toLowerCase();
    
    // Check if page instance already exists
    if (this.pageInstances.has(normalizedPageName)) {
      return this.pageInstances.get(normalizedPageName)!;
    }
    
    // Create new page instance based on page name
    let pageInstance: BasePage;
    
    switch (normalizedPageName) {
      case 'home':
      case 'homepage':
        pageInstance = new HomePage(page);
        break;
      case 'login':
      case 'loginpage':
        pageInstance = new LoginPage(page);
        break;
      case 'video':
      case 'videopage':
        pageInstance = new VideoPage(page);
        break;
      case 'search':
      case 'searchresults':
      case 'searchresultspage':
        pageInstance = new SearchResultsPage(page);
        break;
      default:
        // Default to BasePage if no matching page is found
        pageInstance = new BasePage(page);
    }
    
    // Store and return the page instance
    this.pageInstances.set(normalizedPageName, pageInstance);
    return pageInstance;
  }

  /**
   * Clear all page instances
   */
  clear(): void {
    this.pageInstances.clear();
  }
}
