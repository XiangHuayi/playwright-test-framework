# Bilibili自动化测试框架

基于TypeScript和Playwright的自动化测试框架，专为Bilibili网站设计，具备良好的可扩展性、可维护性和可重用性。

## 项目概述

该框架提供了完整的自动化测试解决方案，包括：
- 配置管理
- 页面对象模型(POM)
- 测试数据管理
- 日志记录
- 测试报告生成
- CI/CD集成支持

## 项目结构

```
bilibili-test-framework/
├── .github/workflows/          # GitHub Actions配置
├── src/
│   ├── config/                 # 配置文件
│   │   ├── config.ts           # 配置管理模块
│   │   └── defaultConfig.ts    # 默认配置
│   ├── pages/                  # 页面对象模型
│   │   ├── BasePage.ts         # 基础页面类
│   │   ├── PageFactory.ts      # 页面工厂
│   │   └── bilibili/           # Bilibili页面类
│   │       ├── HomePage.ts     # 首页
│   │       ├── LoginPage.ts    # 登录页
│   │       ├── VideoPage.ts    # 视频播放页
│   │       └── SearchResultsPage.ts  # 搜索结果页
│   ├── testdata/               # 测试数据
│   │   ├── userData.json       # 用户数据
│   │   └── searchKeywords.csv  # 搜索关键词数据
│   └── utils/                  # 工具类
│       ├── logger.ts           # 日志记录模块
│       └── testDataManager.ts  # 测试数据管理模块
├── tests/                      # 测试用例
│   ├── login.test.ts           # 登录测试
│   ├── searchAndPlay.test.ts   # 搜索与播放测试
│   ├── comment.test.ts         # 评论测试
│   └── responsiveLayout.test.ts # 响应式布局测试
├── reports/                    # 测试报告
├── logs/                       # 日志文件
├── Jenkinsfile                 # Jenkins配置
├── package.json                # 项目依赖
├── playwright.config.ts        # Playwright配置
└── tsconfig.json               # TypeScript配置
```

## 环境搭建

### 前置条件

- Node.js 18+
- npm 8+

### 安装步骤

1. 克隆项目
```bash
git clone <项目地址>
cd bilibili-test-framework
```

2. 安装依赖
```bash
npm install
```

3. 安装Playwright浏览器
```bash
npx playwright install --with-deps
```

## 配置管理

配置文件位于`src/config`目录：

- `defaultConfig.ts`：默认配置
- `config.ts`：配置管理模块，支持环境变量覆盖

### 配置项说明

```typescript
interface FrameworkConfig {
  baseURL: string;           // 测试目标URL
  browser: BrowserType;      // 浏览器类型
  headless: boolean;         // 是否无头模式
  slowMo: number;            // 操作延迟(ms)
  timeout: number;           // 超时时间(ms)
  viewport: {
    width: number;           // 视口宽度
    height: number;          // 视口高度
  };
  testDataPath: string;      // 测试数据路径
  logPath: string;           // 日志路径
  reportPath: string;        // 报告路径
  retryOnFailures: number;   // 失败重试次数
}
```

### 环境变量覆盖

可以通过环境变量覆盖默认配置：

```bash
BASE_URL=https://www.bilibili.com HEADLESS=true npm run test
```

## 页面对象模型(POM)

### 基础页面类

`BasePage`类提供了页面操作的基础方法：
- 导航
- 元素查找
- 等待
- 截图

### 页面工厂

`PageFactory`类用于创建和管理页面实例：

```typescript
const pageFactory = new PageFactory();
const homePage = pageFactory.getPage('home');
```

### Bilibili页面类

- `HomePage`：首页操作
- `LoginPage`：登录页操作
- `VideoPage`：视频播放页操作
- `SearchResultsPage`：搜索结果页操作

## 测试数据管理

测试数据管理模块支持JSON和CSV格式的测试数据：

### JSON格式

```json
{
  "validUser": {
    "username": "test@example.com",
    "password": "password123"
  }
}
```

### CSV格式

```csv
keyword,expectedResults
Python教程,100
JavaScript入门,200
```

### 使用示例

```typescript
const testDataManager = new TestDataManager();
const userData = testDataManager.loadJSON('userData.json');
const searchKeywords = testDataManager.loadCSV('searchKeywords.csv');
```

## 测试用例编写

### 基本结构

```typescript
import { test, expect } from '@playwright/test';
import { PageFactory } from '../src/pages/PageFactory';
import { logger } from '../src/utils/logger';

let pageFactory: PageFactory;

// 测试前的准备工作
test.beforeAll(async ({ browser }) => {
  pageFactory = new PageFactory();
});

// 测试用例
test('测试用例名称', async ({ page }) => {
  logger.info('开始执行测试用例');
  // 测试逻辑
});

// 测试后的清理工作
test.afterAll(async () => {
  pageFactory.clearPages();
});
```

### 测试用例分类

- `login.test.ts`：用户登录功能测试
- `searchAndPlay.test.ts`：视频搜索与播放测试
- `comment.test.ts`：评论发布与查看测试
- `responsiveLayout.test.ts`：页面响应式布局测试

## 报告生成

### HTML报告

```bash
npm run test:report
```

### Allure报告

```bash
# 生成Allure报告
npm run test:allure

# 查看Allure报告
npm run allure:open
```

## 日志记录

日志文件位于`logs`目录，支持不同级别的日志记录：

```typescript
import { logger } from '../src/utils/logger';

logger.info('信息日志');
logger.debug('调试日志');
logger.warn('警告日志');
logger.error('错误日志');
```

## CI/CD集成

### GitHub Actions

配置文件位于`.github/workflows/test.yml`，支持：
- 代码推送触发测试
- Pull Request触发测试
- 自动生成测试报告

### Jenkins

配置文件`Jenkinsfile`，支持：
- 多环境测试
- 测试报告发布
- 部署集成

## 命令行工具

```bash
# 运行所有测试
npm run test

# 运行指定测试文件
npm run test -- tests/login.test.ts

# 生成HTML报告
npm run test:report

# 生成Allure报告并查看
npm run test:allure:full

# 清理报告和日志
npm run clean:all
```

## 使用示例

### 登录测试示例

```typescript
import { test, expect } from '@playwright/test';
import { PageFactory } from '../src/pages/PageFactory';
import { logger } from '../src/utils/logger';
import { TestDataManager } from '../src/utils/testDataManager';

let pageFactory: PageFactory;
let testDataManager: TestDataManager;

test.beforeAll(async ({ browser }) => {
  pageFactory = new PageFactory();
  testDataManager = new TestDataManager();
});

test('成功登录测试', async ({ page }) => {
  logger.info('开始执行成功登录测试');
  
  const homePage = pageFactory.getPage('home', page);
  const loginPage = pageFactory.getPage('login', page);
  
  const userData = testDataManager.loadJSON('userData.json');
  
  await homePage.navigate();
  await homePage.clickLoginButton();
  await loginPage.login(userData.validUser.username, userData.validUser.password);
  
  // 验证登录成功
  await expect(await homePage.isLoggedIn()).toBe(true);
  logger.info('成功登录测试执行完成');
});

test.afterAll(async () => {
  pageFactory.clearPages();
});
```

## 最佳实践

1. **页面元素定位**：使用data-testid或其他稳定的属性
2. **等待策略**：优先使用Playwright的自动等待
3. **测试隔离**：确保每个测试用例独立运行
4. **测试数据**：使用测试数据管理模块加载外部数据
5. **错误处理**：使用try-catch处理异常并记录日志
6. **代码复用**：将公共操作封装到基础页面类
7. **测试报告**：定期查看测试报告并分析失败原因

## 扩展框架

### 添加新页面

1. 创建新的页面类，继承BasePage
2. 实现页面元素定位和操作方法
3. 在PageFactory中注册新页面

### 添加新测试用例

1. 在tests目录下创建新的测试文件
2. 导入需要的模块
3. 编写测试用例逻辑
4. 运行测试验证

## 常见问题

### 测试失败

- 检查页面元素是否变化
- 检查网络连接是否正常
- 检查测试数据是否正确
- 查看日志文件获取详细错误信息

### 浏览器兼容性

- 框架支持Chrome、Firefox和Safari
- 可以通过配置文件切换浏览器

### 性能问题

- 避免不必要的页面刷新
- 合理使用等待策略
- 考虑使用并行测试

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request

## 联系方式

如有问题，请联系项目维护者
