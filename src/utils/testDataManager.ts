import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { logger } from './logger';

/**
 * Test data interface for the test framework
 */
export interface TestData {
  [key: string]: any;
}

/**
 * Test data manager interface
 */
export interface ITestDataManager {
  getJsonData<T extends TestData>(fileName: string): T;
  getCsvData<T extends TestData>(fileName: string): Promise<T[]>;
  getData<T extends TestData>(fileName: string): T | Promise<T[]>;
}

/**
 * Test data manager class to handle test data loading
 */
export class TestDataManager implements ITestDataManager {
  private testDataDir: string;
  private static instance: TestDataManager;

  private constructor() {
    // Set test data directory
    this.testDataDir = path.resolve(__dirname, '../../src/testdata');
  }

  public static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  /**
   * Get JSON test data from a file
   * @param fileName - Name of the JSON file (without extension)
   * @returns Test data as JSON object
   */
  getJsonData<T extends TestData>(fileName: string): T {
    const filePath = path.join(this.testDataDir, `${fileName}.json`);
    
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`JSON test data file not found: ${filePath}`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent) as T;
      
      logger.info(`Loaded JSON test data from ${filePath}`);
      return data;
    } catch (error) {
      logger.error(`Error loading JSON test data from ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get CSV test data from a file
   * @param fileName - Name of the CSV file (without extension)
   * @returns Test data as array of objects
   */
  async getCsvData<T extends TestData>(fileName: string): Promise<T[]> {
    const filePath = path.join(this.testDataDir, `${fileName}.csv`);
    
    return new Promise((resolve, reject) => {
      const results: T[] = [];

      try {
        if (!fs.existsSync(filePath)) {
          throw new Error(`CSV test data file not found: ${filePath}`);
        }

        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data: T) => results.push(data))
          .on('end', () => {
            logger.info(`Loaded CSV test data from ${filePath}`);
            resolve(results);
          })
          .on('error', (error) => {
            logger.error(`Error loading CSV test data from ${filePath}:`, error);
            reject(error);
          });
      } catch (error) {
        logger.error(`Error loading CSV test data from ${filePath}:`, error);
        reject(error);
      }
    });
  }

  /**
   * Get test data from a file (automatically detects file type)
   * @param fileName - Name of the test data file (with extension)
   * @returns Test data as JSON object or array of objects
   */
  getData<T extends TestData>(fileName: string): T | Promise<T[]> {
    const ext = path.extname(fileName).toLowerCase();
    const baseName = path.basename(fileName, ext);

    switch (ext) {
      case '.json':
        return this.getJsonData<T>(baseName);
      case '.csv':
        return this.getCsvData<T>(baseName);
      default:
        throw new Error(`Unsupported test data file format: ${ext}`);
    }
  }

  /**
   * Save test data to a JSON file
   * @param fileName - Name of the JSON file (without extension)
   * @param data - Test data to save
   */
  saveJsonData<T extends TestData>(fileName: string, data: T): void {
    const filePath = path.join(this.testDataDir, `${fileName}.json`);
    
    try {
      // Ensure directory exists
      if (!fs.existsSync(this.testDataDir)) {
        fs.mkdirSync(this.testDataDir, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      logger.info(`Saved JSON test data to ${filePath}`);
    } catch (error) {
      logger.error(`Error saving JSON test data to ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get all test data files in the test data directory
   * @returns Array of test data file names
   */
  getAllTestDataFiles(): string[] {
    try {
      if (!fs.existsSync(this.testDataDir)) {
        return [];
      }

      const files = fs.readdirSync(this.testDataDir);
      return files.filter(file => 
        ['.json', '.csv'].includes(path.extname(file).toLowerCase())
      );
    } catch (error) {
      logger.error(`Error getting test data files from ${this.testDataDir}:`, error);
      return [];
    }
  }
}

// Export singleton instance
export const testDataManager = TestDataManager.getInstance();
