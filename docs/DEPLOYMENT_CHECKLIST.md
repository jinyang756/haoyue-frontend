# 前端部署清单

本文档详细说明了部署皓月量化智能引擎前端应用到Netlify平台时需要推送的文件和配置。

## 需要推送的文件和目录

以下文件和目录**必须**包含在Git仓库中，以便Netlify能够正确构建和部署应用：

```
haoyue-frontend/
├── public/                 # 静态资源目录（包含index.html）
├── src/                    # 源代码目录
├── scripts/                # 脚本目录
├── docs/                   # 文档目录
├── .github/                # GitHub配置目录
├── package.json            # 项目依赖和脚本配置
├── package-lock.json       # 依赖锁定文件
├── tsconfig.json           # TypeScript配置
├── .gitignore              # Git忽略文件
├── .babelrc                # Babel配置
├── netlify.toml            # Netlify部署配置
├── config-overrides.js     # react-app-rewired配置
├── README.md               # 项目说明文档
├── CHANGELOG.md            # 版本变更记录
└── .env.example            # 环境变量模板
```

### 配置文件详情

1. **netlify.toml** - Netlify部署配置文件，包含：
   - 构建命令：`npm run build`
   - 发布目录：`build`
   - 重定向规则（SPA应用必需）

2. **package.json** - 包含所有必要的依赖和构建脚本

3. **config-overrides.js** - 自定义webpack配置，用于优化构建

4. **public/** - 静态资源目录，包含：
   - index.html - 应用入口HTML文件
   - favicon.ico - 网站图标
   - manifest.json - PWA配置文件
   - logo.svg - 网站Logo
   - robots.txt - 搜索引擎爬虫配置
   - sitemap.xml - 网站地图

### 不需要推送的文件和目录

以下文件和目录**不应该**包含在Git仓库中（已在.gitignore中配置）：

```
/node_modules/              # 依赖包目录（由npm install重新安装）
/build/                     # 构建输出目录（由Netlify构建生成）
.env                        # 本地环境变量文件（包含敏感信息）
.env.local                  # 本地环境变量文件
.env.development            # 开发环境变量文件
.env.production             # 生产环境变量文件
.env.development.local      # 本地开发环境变量文件
.env.production.local       # 本地生产环境变量文件
.DS_Store                   # macOS系统文件
Thumbs.db                   # Windows系统文件
```

## 环境变量配置

在Netlify部署时，需要在Netlify控制台配置以下环境变量：

1. `REACT_APP_API_URL` - 后端API的部署地址
2. `REACT_APP_ENV` - 环境标识（production）

## 部署步骤

1. 确保所有必需文件都已提交到Git仓库
2. 将代码推送到GitHub仓库
3. 在Netlify上导入GitHub仓库
4. 在Netlify控制台配置环境变量
5. 点击Deploy按钮开始部署

## 验证部署

部署完成后，应验证以下内容：

1. 应用能够正常访问
2. 所有页面能够正确加载
3. API调用能够正常工作
4. 静态资源（图片、CSS、JS）能够正确加载
5. PWA功能正常（如果启用）

## 常见问题

1. **白屏问题**：检查index.html是否正确引用了打包后的JS文件
2. **API连接失败**：检查REACT_APP_API_URL环境变量是否正确配置
3. **静态资源加载失败**：检查public目录中的文件是否正确包含在Git仓库中
4. **路由问题**：确保netlify.toml中的重定向规则正确配置

## 注意事项

1. 不要将包含敏感信息的文件（如.env）提交到Git仓库
2. 确保public目录中的所有静态资源都包含在Git仓库中
3. 部署前应测试构建过程，确保没有错误
4. 定期更新依赖包以确保安全性
5. **前端项目仅允许使用Netlify部署，禁止包含任何Vercel相关配置**
6. 确保GitHub Actions工作流文件只配置Netlify部署，不包含Vercel部署配置

## Vercel相关配置清理检查清单

为确保前端项目不包含任何Vercel相关配置，请检查并确保以下文件和配置已移除：

- [x] `.vercel/` 目录已删除
- [x] `.vercelignore` 文件已删除
- [x] `vercel.json` 文件不存在于前端项目中
- [x] package.json中不包含`@vercel`相关的依赖
- [x] `.gitignore`中已移除`.vercel`忽略规则
- [x] GitHub Actions工作流文件中只配置了Netlify部署