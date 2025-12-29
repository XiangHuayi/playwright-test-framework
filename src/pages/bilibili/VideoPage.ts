import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { logger } from '../../utils/logger';
import { LocatorManager } from '../../utils/LocatorManager';

/**
 * Bilibili Video Page
 */
export class VideoPage extends BasePage {
  // Page elements
  private readonly videoPlayer: Locator;
  private readonly playButton: Locator;
  private readonly pauseButton: Locator;
  private readonly progressBar: Locator;
  private readonly currentTime: Locator;
  private readonly totalTime: Locator;
  private readonly volumeControl: Locator;
  private readonly fullscreenButton: Locator;
  private readonly danmakuInput: Locator;
  private readonly danmakuSendButton: Locator;
  private readonly danmakuSettings: Locator;
  private readonly commentsSection: Locator;
  private readonly commentInput: Locator;
  private readonly commentSendButton: Locator;
  private readonly commentsList: Locator;
  private readonly likeButton: Locator;
  private readonly coinButton: Locator;
  private readonly favoriteButton: Locator;
  private readonly shareButton: Locator;
  private readonly videoTitle: Locator;
  private readonly upName: Locator;
  private readonly viewCount: Locator;
  private readonly likeCount: Locator;
  private readonly commentCount: Locator;
  private readonly favoriteCount: Locator;
  private readonly relatedVideos: Locator;
  private readonly subscribeButton: Locator;
  private readonly videoTags: Locator;
  private readonly videoDescription: Locator;

  constructor(page: Page) {
    super(page);
    
    // Load locators from YAML
    const videoPageLocators = LocatorManager.getPageLocators('bilibili.videoPage');
    
    if (!videoPageLocators) {
      throw new Error('Failed to load locators for video page');
    }
    
    // Initialize locators
    this.videoPlayer = page.locator(videoPageLocators.videoPlayer);
    this.playButton = page.locator(videoPageLocators.playButton);
    this.pauseButton = page.locator(videoPageLocators.pauseButton);
    this.progressBar = page.locator(videoPageLocators.progressBar);
    this.currentTime = page.locator(videoPageLocators.currentTime);
    this.totalTime = page.locator(videoPageLocators.totalTime);
    this.volumeControl = page.locator(videoPageLocators.volumeControl);
    this.fullscreenButton = page.locator(videoPageLocators.fullscreenButton);
    this.danmakuInput = page.locator(videoPageLocators.danmakuInput);
    this.danmakuSendButton = page.locator(videoPageLocators.danmakuSendButton);
    this.danmakuSettings = page.locator(videoPageLocators.danmakuSettings);
    this.commentsSection = page.locator(videoPageLocators.commentsSection);
    this.commentInput = page.locator(videoPageLocators.commentInput);
    this.commentSendButton = page.locator(videoPageLocators.commentSendButton);
    this.commentsList = page.locator(videoPageLocators.commentsList);
    this.likeButton = page.locator(videoPageLocators.likeButton);
    this.coinButton = page.locator(videoPageLocators.coinButton);
    this.favoriteButton = page.locator(videoPageLocators.favoriteButton);
    this.shareButton = page.locator(videoPageLocators.shareButton);
    this.videoTitle = page.locator(videoPageLocators.videoTitle);
    this.upName = page.locator(videoPageLocators.upName);
    this.viewCount = page.locator(videoPageLocators.viewCount);
    this.likeCount = page.locator(videoPageLocators.likeCount);
    this.commentCount = page.locator(videoPageLocators.commentCount);
    this.favoriteCount = page.locator(videoPageLocators.favoriteCount);
    this.relatedVideos = page.locator(videoPageLocators.relatedVideos);
    this.subscribeButton = page.locator(videoPageLocators.subscribeButton);
    this.videoTags = page.locator(videoPageLocators.videoTags);
    this.videoDescription = page.locator(videoPageLocators.videoDescription);
  }

  /**
   * Play the video
   */
  async playVideo(): Promise<void> {
    logger.info('Playing video');
    await this.click(this.playButton);
  }

  /**
   * Pause the video
   */
  async pauseVideo(): Promise<void> {
    logger.info('Pausing video');
    await this.click(this.pauseButton);
  }

  /**
   * Seek to a specific time in the video
   * @param position - Position percentage (0-100)
   */
  async seekVideo(position: number): Promise<void> {
    logger.info(`Seeking video to position: ${position}%`);
    const boundingBox = await this.progressBar.boundingBox();
    if (boundingBox) {
      const x = boundingBox.x + (boundingBox.width * position) / 100;
      const y = boundingBox.y + boundingBox.height / 2;
      await this.page.mouse.click(x, y);
    }
  }

  /**
   * Get current playback time
   * @returns Current time as string
   */
  async getCurrentTime(): Promise<string> {
    logger.info('Getting current video time');
    return this.currentTime.textContent() as Promise<string>;
  }

  /**
   * Get total video duration
   * @returns Total duration as string
   */
  async getTotalTime(): Promise<string> {
    logger.info('Getting total video duration');
    return this.totalTime.textContent() as Promise<string>;
  }

  /**
   * Toggle volume
   */
  async toggleVolume(): Promise<void> {
    logger.info('Toggling volume');
    await this.click(this.volumeControl);
  }

  /**
   * Toggle fullscreen
   */
  async toggleFullscreen(): Promise<void> {
    logger.info('Toggling fullscreen');
    await this.click(this.fullscreenButton);
  }

  /**
   * Send a danmaku (bullet comment)
   * @param message - Danmaku message
   */
  async sendDanmaku(message: string): Promise<void> {
    logger.info(`Sending danmaku: ${message}`);
    await this.fill(this.danmakuInput, message);
    await this.click(this.danmakuSendButton);
  }

  /**
   * Open danmaku settings
   */
  async openDanmakuSettings(): Promise<void> {
    logger.info('Opening danmaku settings');
    await this.click(this.danmakuSettings);
  }

  /**
   * Scroll to comments section
   */
  async scrollToComments(): Promise<void> {
    logger.info('Scrolling to comments section');
    await this.scrollToElement(this.commentsSection);
  }

  /**
   * Post a comment
   * @param comment - Comment content
   */
  async postComment(comment: string): Promise<void> {
    logger.info(`Posting comment: ${comment}`);
    await this.scrollToComments();
    await this.fill(this.commentInput, comment);
    await this.click(this.commentSendButton);
  }

  /**
   * Get comment count
   * @returns Number of comments
   */
  async getCommentCount(): Promise<number> {
    logger.info('Getting comment count');
    await this.scrollToComments();
    const countText = await this.commentCount.textContent();
    return parseInt(countText?.replace(/[^0-9]/g, '') || '0', 10);
  }

  /**
   * Get all comments
   * @returns Array of comment texts
   */
  async getAllComments(): Promise<string[]> {
    logger.info('Getting all comments');
    await this.scrollToComments();
    const comments = await this.commentsList.all();
    const commentTexts: string[] = [];
    
    for (const comment of comments) {
      const text = await comment.textContent();
      if (text) {
        commentTexts.push(text);
      }
    }
    
    return commentTexts;
  }

  /**
   * Like the video
   */
  async likeVideo(): Promise<void> {
    logger.info('Liking video');
    await this.click(this.likeButton);
  }

  /**
   * Coin the video
   * @param amount - Number of coins (1-2)
   */
  async coinVideo(amount: number = 1): Promise<void> {
    logger.info(`Coining video with ${amount} coins`);
    await this.click(this.coinButton);
    // Handle coin selection (implementation depends on actual UI)
  }

  /**
   * Favorite the video
   */
  async favoriteVideo(): Promise<void> {
    logger.info('Favoriting video');
    await this.click(this.favoriteButton);
    // Handle favorite selection (implementation depends on actual UI)
  }

  /**
   * Share the video
   */
  async shareVideo(): Promise<void> {
    logger.info('Sharing video');
    await this.click(this.shareButton);
  }

  /**
   * Get video title
   * @returns Video title
   */
  async getVideoTitle(): Promise<string> {
    logger.info('Getting video title');
    return this.videoTitle.textContent() as Promise<string>;
  }

  /**
   * Get UP name
   * @returns UP name
   */
  async getUpName(): Promise<string> {
    logger.info('Getting UP name');
    return this.upName.textContent() as Promise<string>;
  }

  /**
   * Subscribe to UP main
   */
  async subscribeToUp(): Promise<void> {
    logger.info('Subscribing to UP main');
    await this.click(this.subscribeButton);
  }

  /**
   * Get video view count
   * @returns View count
   */
  async getViewCount(): Promise<number> {
    logger.info('Getting video view count');
    const countText = await this.viewCount.textContent();
    return parseInt(countText?.replace(/[^0-9]/g, '') || '0', 10);
  }

  /**
   * Click on related video by index
   * @param index - Related video index (0-based)
   */
  async clickRelatedVideo(index: number): Promise<void> {
    logger.info(`Clicking related video at index: ${index}`);
    const relatedVideo = this.relatedVideos.nth(index);
    await this.click(relatedVideo);
  }

  /**
   * Get video tags
   * @returns Array of video tags
   */
  async getVideoTags(): Promise<string[]> {
    logger.info('Getting video tags');
    const tags = await this.videoTags.all();
    const tagTexts: string[] = [];
    
    for (const tag of tags) {
      const text = await tag.textContent();
      if (text) {
        tagTexts.push(text);
      }
    }
    
    return tagTexts;
  }
  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    logger.info('Waiting for video page to load');
    await this.waitForVisible(this.videoPlayer);
  }

  /**
   * Get video player locator
   * @returns Video player locator
   */
  getVideoPlayer(): Locator {
    return this.videoPlayer;
  }

  /**
   * Get video title locator
   * @returns Video title locator
   */
  getVideoTitleLocator(): Locator {
    return this.videoTitle;
  }

  /**
   * Get comments section locator
   * @returns Comments section locator
   */
  getCommentsSection(): Locator {
    return this.commentsSection;
  }

  /**
   * Get related videos locator
   * @returns Related videos locator
   */
  getRelatedVideos(): Locator {
    return this.relatedVideos;
  }
}