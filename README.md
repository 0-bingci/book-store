# 在线书店应用 (Book Store)

一个现代化的在线书店单页应用，提供书籍浏览、搜索、详情查看和阅读功能。使用React、TypeScript、Redux Toolkit和Tailwind CSS构建。

## 📦 安装和运行

### 安装步骤

#### 前端
1. 安装依赖：`npm install`
2. 运行：`npm run dev`

#### 后端
1. 安装依赖：`npm install -g json-server@0.17.4`
2. 运行：`json-server --watch books.json --cors`

## 🚀 项目特点

- **响应式设计**：适配各种设备屏幕尺寸
- **书籍列表**：支持分页、关键词搜索和分类筛选
- **书籍详情**：展示完整书籍信息，支持编辑功能
- **书籍阅读器**：在线阅读书籍内容
- **现代化UI**：采用Tailwind CSS构建的美观界面
- **API集成**：通过RTK Query处理数据请求

## 🛠️ 技术栈

### 核心技术
- **React 19**：用于构建用户界面
- **TypeScript**：提供类型安全
- **Redux Toolkit**：状态管理和RTK Query API请求
- **React Router v7**：客户端路由管理
- **Tailwind CSS v4**：实用优先的CSS框架

### 开发工具
- **Vite**：现代化前端构建工具
- **ESLint**：代码质量检查
- **TypeScript**：静态类型检查

## 📁 项目结构

```
src/
├── assets/           # 静态资源
├── components/       # 公共组件（Navbar、Footer）
├── pages/            # 页面组件
│   ├── Home/         # 首页（书籍列表）
│   ├── BookDetail/   # 书籍详情页
│   └── BookReader/   # 书籍阅读器页面
├── router/           # 路由配置
├── store/            # Redux store配置
├── types/            # TypeScript类型定义
├── utils/            # 工具函数和API接口
├── App.tsx           # 应用入口组件
└── main.tsx          # 应用渲染入口
```

## 📊 数据模型

### Book 类型
```typescript
export type Book = {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
  categories: string[]; // 如 ["Novel", "CS", "History"]
  price: number; // USD
  summary?: string;
  stock: number; // 库存
};
```

### BreadcrumbItem 类型
```typescript
export interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrent: boolean;
}
```

## 📋 API接口

### 1. 获取书籍列表
- **端点**：`GET /books`
- **参数**：
  - `_page`: 页码
  - `_limit`: 每页数量
  - `_sort`: 排序字段（默认id）
  - `_order`: 排序方向（默认asc）
  - `q`: 搜索关键词
  - `categories`: 分类筛选
- **返回**：书籍列表和总数

### 2. 获取书籍详情
- **端点**：`GET /books/:id`
- **参数**：书籍ID
- **返回**：单本书籍详情

### 3. 更新书籍信息
- **端点**：`PUT /books/:id`
- **参数**：书籍ID和更新数据
- **返回**：更新后的书籍信息

### 4. 获取所有分类
- **端点**：自定义API，从书籍数据中提取不重复分类

## 🚦 路由结构

- **首页**：`/` - 展示书籍列表，支持分页和筛选
- **书籍详情**：`/book-detail/:id` - 展示书籍详细信息，支持编辑
- **书籍阅读器**：`/book-reader/:id` - 在线阅读书籍内容

## 🔧 开发指南

### 添加新页面
1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/router/router.tsx` 中添加新的路由配置
3. 确保组件正确导出并实现所需功能

### 添加新API端点
1. 在 `src/utils/apiSlice.ts` 中使用 `builder` 添加新的查询或变更
2. 导出新的hook供组件使用
3. 在组件中通过 `useQuery` 或 `useMutation` hook调用API

## ✨ 项目亮点

1. **类型安全**：全面使用TypeScript确保代码质量和开发体验
2. **性能优化**：RTK Query的缓存机制减少不必要的网络请求
3. **用户体验**：响应式设计和流畅的交互体验
4. **代码组织**：清晰的文件结构和组件划分
5. **状态管理**：Redux Toolkit提供高效的状态管理解决方案

## 📝 注意事项

- 本项目使用的API基础URL为 `http://localhost:3000`，请确保后端服务在此地址运行
- 开发环境下推荐使用 npm run dev 启动Vite开发服务器
- 生产环境请先运行 build 命令，然后使用 preview 命令或部署到静态文件服务器

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request

## 📄 许可证

本项目仅供学习和演示使用。