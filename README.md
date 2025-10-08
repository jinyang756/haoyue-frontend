# 皓月量化智能引擎 - 前端

## 项目简介

皓月量化智能引擎是一个基于AI的股票分析平台，提供全面的股票数据分析、技术指标计算、AI智能推荐等功能。本项目是平台的前端实现，采用React 18 + TypeScript技术栈开发。

## 技术栈

- **框架**: React 18
- **语言**: TypeScript 4.9.5
- **UI组件库**: Ant Design 5
- **状态管理**: Redux Toolkit
- **路由**: React Router 6
- **数据可视化**: ECharts 5
- **HTTP请求**: Axios
- **样式**: Styled Components
- **构建工具**: Create React App + react-app-rewired

## 项目结构

```
haoyue-frontend/
├── public/                # 静态资源目录
│   ├── index.html         # HTML入口文件
│   ├── logo.svg           # 网站Logo
│   ├── manifest.json      # PWA配置
│   ├── particles.js       # 粒子效果库
│   ├── robots.txt         # 爬虫规则
│   ├── service-worker.js  # PWA服务工作线程
│   └── sitemap.xml        # 网站地图
├── src/
│   ├── App.tsx            # 应用入口组件
│   ├── components/        # 通用组件
│   ├── hooks/             # 自定义Hooks
│   ├── i18n/              # 国际化配置
│   ├── index.css          # 全局样式
│   ├── index.tsx          # 应用启动文件
│   ├── layouts/           # 布局组件
│   ├── models/            # 数据模型
│   ├── pages/             # 页面组件
│   ├── routes/            # 路由配置
│   ├── services/          # API服务
│   ├── setupProxy.js      # 代理配置
│   ├── store/             # Redux状态管理
│   ├── styles/            # 样式文件
│   ├── types/             # TypeScript类型定义
│   └── utils/             # 工具函数
├── scripts/               # 脚本文件
│   ├── deploy-check.js    # 部署检查脚本
│   └── quick-start.js     # 快速启动脚本
├── .babelrc               # Babel配置
├── .env.example           # 环境变量模板
├── .gitignore             # Git忽略文件
├── BRANCH_STRATEGY.md     # 分支策略
├── CHANGELOG.md           # 变更日志
├── config/                # 配置文件
│   └── jest/              # Jest配置
├── config-overrides.js    # react-app-rewired配置
├── package.json           # 项目依赖和脚本
├── README.md              # 项目说明
└── tsconfig.json          # TypeScript配置
```

## 核心功能

1. **首页展示**
   - 专业的项目介绍页面
   - 核心功能展示
   - 数据统计和CTA按钮

2. **用户认证**
   - 登录、注册、登出
   - Token管理和自动刷新
   - 三级权限控制（公开、登录用户、VIP用户）

3. **股票数据**
   - 股票列表展示和搜索
   - 股票详情查看
   - K线图和技术指标分析
   - 历史数据查询和对比

4. **AI分析**
   - AI智能分析任务创建和管理
   - 多维度评分系统
   - 风险评估
   - 投资建议生成

5. **用户中心**
   - 个人信息管理
   - 密码修改
   - 分析历史查看

6. **数据可视化**
   - 交互式K线图（支持日/周/月线切换）
   - 技术指标图表（RSI、MACD、布林带等）
   - 数据统计和趋势分析图表

## 安装和启动

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 快速启动

使用快速启动脚本自动设置开发环境：

```bash
npm run quick-start
```

### 手动安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

开发服务器将在 <http://localhost:3000> 启动

### 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `build/` 目录

## 环境变量配置

### 开发环境

创建或修改 `.env.development` 文件：

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_DEBUG=true
```

### 生产环境

创建或修改 `.env.production` 文件：

```env
REACT_APP_API_URL=https://后端API部署地址
REACT_APP_DEBUG=false
```

## API服务配置

前端通过Axios与后端API通信，主要接口包括：

- `/api/auth/*`: 认证相关接口
- `/api/stocks/*`: 股票数据相关接口
- `/api/analysis/*`: AI分析相关接口
- `/api/health`: 健康检查接口

在开发环境中，API请求通过 `setupProxy.js` 配置的代理转发到后端服务。

## 部署指南

### 本地测试部署

```bash
npm run build
# 安装静态服务器
npm install -g serve
# 启动静态服务器
serve -s build
```

### Netlify部署

本项目已配置 `netlify.toml` 文件，支持一键部署到Netlify：

1. 将代码推送到GitHub仓库
2. 在Netlify上导入GitHub仓库
3. 配置环境变量（在Netlify控制台的Settings > Environment Variables中）
   - REACT_APP_API_URL: 后端API的部署地址
4. 点击Deploy按钮开始部署

详细部署文件清单请参考 [DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)

### 部署注意事项

1. 确保后端API服务已正确部署并可访问
2. 生产环境中必须配置正确的 `REACT_APP_API_URL`
3. `public` 目录必须包含在Git版本控制中（已从 `.gitignore` 中移除排除）
4. Netlify会自动执行 `npm run build` 命令进行构建

## 运维指南

详细的运维指南请参考 [OPERATION_GUIDE.md](docs/OPERATION_GUIDE.md)，包含以下内容：

- 部署流程
- 监控和日志
- 常见问题处理
- 性能优化
- 安全配置
- 备份和恢复
- 版本管理

## 开发指南

### 代码规范

- 遵循React Hooks最佳实践
- 使用TypeScript进行类型定义
- 组件拆分遵循单一职责原则
- 状态管理使用Redux Toolkit

### 性能优化策略

- 使用代码分割和懒加载
- 实现虚拟滚动列表处理大量数据
- 采用数据缓存策略减少重复请求
- 响应式设计适配不同设备

## 常见问题排查

### API连接问题

- 使用 `BackendConnectionTest` 组件测试API连接
- 检查 `REACT_APP_API_URL` 环境变量配置
- 确认后端服务是否正常运行

### 构建失败

- 检查依赖安装是否完整
- 查看构建日志中的具体错误信息
- 确保 `public` 目录存在且包含 `index.html` 文件

## 开发工具
