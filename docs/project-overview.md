# stock-api 项目概览

## 项目简介

`stock-api` 是一个零运行时依赖的 Node.js 股票行情工具，支持 A 股、港股、美股的实时行情查询。项目提供三种使用方式：

- **Node.js API** — 作为 npm 包引入，供 Node.js/后端服务调用
- **CLI** — 命令行工具 `npx stock-api`
- **Web 界面** — Vue 3 + Vite 前端 + Express 后端

## 技术栈

| 层级 | 技术 |
|------|------|
| 核心库 | TypeScript, Node.js >= 18, 零运行时依赖 |
| HTTP 请求 | 自封装 `src/utils/fetch.ts`（基于 node:http/https） |
| 编码转换 | 自封装 `src/utils/iconv.ts`（第三方接口返回 GBK 编码） |
| 测试 | Jest (unit + integration) |
| Lint | ESLint + typescript-eslint |
| 发布 | semantic-release + husky |
| Web 前端 | Vue 3 + Vite 6 + Element Plus + Pinia + Vue Router 4 |
| Web 后端 | Express 5 |

## 项目结构

```
stock-api/
├── src/                          # 核心库源码
│   ├── index.ts                  # 入口，导出 stocks 对象
│   ├── cli.ts                    # CLI 入口（npx stock-api）
│   ├── errors.ts                 # 错误体系
│   ├── types/                    # 类型定义
│   │   ├── stocks/index.ts       # StockApi 接口
│   │   └── utils/stock.ts        # Stock 类型
│   ├── stocks/                   # 数据源实现
│   │   ├── index.ts              # 统一导出
│   │   ├── auto/                 # 自动兜底逻辑
│   │   ├── base/                 # 基础通用常量和转换
│   │   ├── tencent/              # 腾讯数据源
│   │   ├── sina/                 # 新浪数据源
│   │   ├── eastmoney/            # 东方财富数据源
│   │   └── shared/               # 共享模块（provider 工厂、归一化、代码映射）
│   └── utils/                    # 工具函数
│       ├── fetch.ts              # HTTP 请求封装
│       ├── iconv.ts              # GBK 编码转换
│       ├── array.ts              # 数组去重
│       └── constant.ts           # 默认值常量
├── test/                         # 测试
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试（真实请求第三方接口）
│   └── fixtures/                 # 测试用例数据
├── web/                          # Web 应用
│   ├── server/                   # Express 后端
│   │   ├── index.ts              # 服务入口
│   │   ├── routes/               # API 路由
│   │   └── middleware/           # 错误处理中间件
│   ├── client/                   # Vue 3 前端
│   │   ├── index.html            # SPA 入口
│   │   ├── vite.config.ts        # Vite 配置
│   │   └── src/                  # 前端源码
│   └── shared/                   # 前后端共享类型
├── scripts/                      # 脚本
│   └── check-api-status.mjs      # 数据源可用性监控
├── docs/                         # 文档
├── .github/workflows/            # CI/CD
└── .husky/                       # Git hooks
```

## 核心架构

### 数据源 Provider 模式

每个数据源（腾讯、新浪、东方财富）通过 `createStockProvider()` 工厂函数创建，需要配置：

```typescript
type StockProviderConfig = {
  source: "tencent" | "sina" | "eastmoney";
  quote: {
    codeTransform: CodeTransform;    // 股票代码转换（内部代码 -> 第三方 API 代码）
    delimiter: string;               // 响应分隔符（腾讯 ~，新浪 ,）
    encoding: string;                // 响应编码（gbk / utf-8）
    getUrl(apiCodes: string[]): string;  // URL 拼装
    isMissing(row: string, apiCode: string): boolean;  // 判断是否缺失数据
    parseStock(code: string, params: string[]): Stock;  // 解析行情数据
  };
  search: {
    getUrl(key: string): string;     // 搜索 URL
    parseCodes(body: string): string[];  // 解析搜索结果中的股票代码
  };
};
```

### 自动兜底机制

`stocks.auto` 按 `tencent -> sina -> eastmoney` 顺序逐个尝试，取第一个成功返回的结果：

```
用户调用 stocks.auto.getStock("SH510500")
  → 尝试 tencent.getStock()
  → 失败则尝试 sina.getStock()
  → 失败则尝试 eastmoney.getStock()
  → 返回第一个成功的结果，标记 source 字段
```

### 股票代码格式

统一使用 `交易所前缀 + 代码`：

| 市场 | 前缀 | 示例 |
|------|------|------|
| 上海交易所 | `SH` | `SH510500` |
| 深圳交易所 | `SZ` | `SZ000651` |
| 香港市场 | `HK` | `HK02020` |
| 美国市场 | `US` | `USDJI` |

### 返回数据结构

```typescript
interface Stock {
  name: string;       // 股票名称
  code: string;       // 股票代码，如 SH510500
  now: number;        // 当前价格
  low: number;        // 最低
  high: number;       // 最高
  percent: number;    // 涨跌幅，0.01 表示 1%
  yesterday: number;  // 昨收价
  source?: "base" | "tencent" | "sina" | "eastmoney";  // 数据来源
}
```

### 错误体系

```
StockApiError (基类)
├── StockCodeError     → 股票代码错误
├── StockRequestError  → 网络请求失败
└── StockParseError    → 数据解析失败
```

## Web 应用架构

### 后端 API

Express 服务提供 3 个接口，全部位于 `/api` 前缀下：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/stocks/search?q=关键词&source=auto` | 搜索股票 |
| GET | `/api/stocks/:code?source=auto` | 查询单只股票 |
| POST | `/api/stocks/batch` | 批量查询（最多 20 只） |
| GET | `/api/sources` | 获取可用数据源列表 |

### 前端架构

```
client/src/
├── main.ts                    # 应用入口，注册插件
├── App.vue                    # 根组件（主题 + 路由）
├── styles/                    # 全局样式 + CSS 变量主题
├── router/index.ts            # 路由配置（/、/stock/:code、404）
├── stores/                    # Pinia 状态管理
│   ├── stocks.ts              # 搜索结果、选中股票、loading/error
│   ├── source.ts              # 当前数据源（持久化到 localStorage）
│   └── theme.ts               # 暗色/亮色主题（持久化到 localStorage）
├── composables/               # 组合式 API
│   ├── useDebounce.ts         # 防抖
│   ├── usePriceFormat.ts      # 价格格式化 + 涨跌颜色
│   └── useStockSearch.ts      # 搜索逻辑封装
├── api/stocks.ts              # API 调用层（fetch）
├── components/
│   ├── layout/AppHeader.vue   # 顶栏（标题 + 数据源 + 主题切换）
│   ├── search/SearchBar.vue   # 搜索输入框
│   ├── stock/                 # 股票相关组件
│   └── common/                # 通用组件
└── views/                     # 页面视图
    ├── HomePage.vue           # 首页（搜索 + 结果网格）
    ├── StockDetailPage.vue    # 详情页
    └── NotFoundPage.vue       # 404
```

### 主题系统

通过 CSS 变量实现，由 `data-theme="light|dark"` 属性驱动：

- 亮色：白底、深色文字
- 暗色：深蓝底、浅色文字
- 涨跌配色：红涨绿跌（中国惯例）
- Element Plus 通过 `dark` class 同步切换

### 请求流程

```
浏览器 → Vite Dev Server (5173) → /api 代理 → Express (3000) → stock-api → 第三方接口
```

生产环境 Express 同时提供静态文件服务和 API 服务。

## 重要约束

### 不内置缓存和限流

项目保持零运行时依赖，不内置缓存和限流。生产环境建议在服务层自行实现：
- 按股票代码 + 数据源做短 TTL 缓存
- 对外部请求做限流，避免频繁请求第三方接口被封 IP

### 第三方接口特点

| 数据源 | 响应编码 | 行情分隔符 | 搜索接口 |
|--------|---------|-----------|---------|
| 腾讯 | GBK | `~` | smartbox.gtimg.cn |
| 新浪 | GBK | `,` | suggest3.sinajs.cn |
| 东方财富 | UTF-8 | JSON | push2.eastmoney.com |

### 无 K 线数据

当前接口只提供实时行情快照，不包含 K 线数据。K 线需要对接独立的第三方接口。

## 开发常用命令

```bash
# 根目录（核心库）
npm run build          # 构建
npm run test           # 运行测试
npm run lint           # ESLint 检查
npm run validate       # lint + build + typecheck + test

# web 目录
npm run dev            # 同时启动前端 + 后端
npm run web:dev        # 从根目录启动 web 开发
npm run web:build      # 构建 web 应用
npm run web:start      # 生产模式启动
```

## 已知限制

1. **实时行情仅支持快照数据**，无历史 K 线
2. **第三方接口无 SLA 保证**，可能随时变更或限制访问
3. **不支持 WebSocket 实时推送**，需要轮询刷新
4. **批量查询限制 20 只**（后端 API 限制）
