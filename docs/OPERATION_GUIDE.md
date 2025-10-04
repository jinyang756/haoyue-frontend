# 前端运维指南

本文档为皓月量化智能引擎前端应用的运维人员提供详细的部署、监控和维护指南。

## 部署流程

### 1. 准备工作

1. 确认所有代码变更已提交到Git仓库
2. 检查[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)中的文件清单
3. 确保本地环境可以正常构建项目
4. **确保不包含任何Vercel相关配置**：
   - 检查并删除`.vercel/`目录
   - 检查并删除`.vercelignore`文件
   - 确保不包含`vercel.json`配置文件
   - 确保GitHub Actions工作流只配置Netlify部署

### 2. 本地构建测试

```bash
# 克隆最新代码
git clone <repository-url>
cd haoyue-frontend

# 安装依赖
npm ci

# 构建项目
npm run build

# 测试构建结果
npx serve build
```

### 3. Netlify部署

1. 登录Netlify控制台
2. 选择"New site from Git"
3. 连接GitHub账户并选择对应的仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `build`
5. 配置环境变量：
   - `REACT_APP_API_URL`: 后端API地址
   - `REACT_APP_ENV`: production
6. 点击"Deploy site"

### 4. 部署后验证

1. 访问部署后的网站URL
2. 验证以下功能：
   - 首页正常加载
   - 页面导航正常
   - API调用正常（如股票列表、分析任务等）
   - 用户认证流程正常
   - 静态资源加载正常

## 监控和日志

### 前端错误监控

1. 使用浏览器开发者工具检查：
   - Console中的错误信息
   - Network标签页中的请求失败
   - Performance标签页中的性能问题

2. 关键监控指标：
   - 页面加载时间
   - API响应时间
   - JavaScript错误率
   - 用户交互响应时间

### Netlify监控

1. 在Netlify控制台查看：
   - 构建状态和日志
   - 部署历史
   - 网站性能报告
   - 访问统计

## 常见问题处理

### 1. 白屏问题

**现象**: 页面加载后显示空白

**排查步骤**:

1. 检查浏览器控制台是否有JavaScript错误
2. 确认index.html是否正确加载
3. 检查打包后的JS文件是否正确引用
4. 验证环境变量配置是否正确

**解决方案**:

1. 重新构建项目
2. 检查Netlify环境变量配置
3. 确认public目录中的文件完整性

### 2. API连接失败

**现象**: 页面显示网络错误或数据无法加载

**排查步骤**:

1. 检查REACT_APP_API_URL环境变量
2. 确认后端服务是否正常运行
3. 验证CORS配置
4. 检查网络连接

**解决方案**:

1. 更新Netlify环境变量中的API URL
2. 联系后端运维确认服务状态
3. 检查代理配置（开发环境）

### 3. 构建失败

**现象**: Netlify构建过程中出现错误

**排查步骤**:

1. 查看Netlify构建日志
2. 检查package.json中的依赖版本
3. 确认Node.js版本兼容性
4. 验证代码是否有语法错误

**解决方案**:

1. 本地重现构建过程
2. 更新依赖包版本
3. 修复代码中的错误
4. 清理构建缓存后重新部署

### 4. Vercel相关配置冲突

**现象**: 部署失败或出现意外行为

**排查步骤**:

1. 检查项目中是否包含Vercel相关文件（`.vercel/`, `.vercelignore`, `vercel.json`）
2. 确认GitHub Actions工作流是否只配置了Netlify部署
3. 检查依赖中是否包含Vercel相关包

**解决方案**:

1. 删除所有Vercel相关文件和配置
2. 确保只使用Netlify进行部署
3. 更新GitHub Actions工作流文件

## 性能优化

### 1. 代码分割

项目已使用React.lazy进行路由级别的代码分割，减少初始加载时间。

### 2. 资源压缩

构建过程中会自动压缩JavaScript、CSS和图片资源。

### 3. 缓存策略

Netlify会自动为静态资源设置合适的缓存头。

### 4. PWA支持

项目支持PWA，可以离线访问核心功能。

## 安全配置

### 1. 环境变量

敏感信息（如API密钥）不应包含在前端代码中，应通过后端API提供。

### 2. HTTPS

Netlify默认启用HTTPS，确保数据传输安全。

### 3. 内容安全策略

在Netlify控制台配置合适的内容安全策略头。

## 备份和恢复

### 1. 代码备份

代码通过Git版本控制进行备份，定期推送到远程仓库。

### 2. 配置备份

定期导出Netlify环境变量和配置设置。

### 3. 灾难恢复

1. 从Git仓库克隆最新代码
2. 重新配置环境变量
3. 执行部署流程

## 版本管理

### 1. 版本发布流程

1. 更新CHANGELOG.md
2. 提交代码变更
3. 创建Git标签
4. 部署到生产环境

### 2. 回滚操作

1. 在Netlify控制台选择之前的部署版本
2. 点击"Rollback to this deploy"

## 联系信息

### 开发团队

- 前端负责人: [姓名]
- 后端负责人: [姓名]

### 运维支持

- 运维负责人: [姓名]
- 紧急联系电话: [电话号码]

### 第三方服务

- Netlify支持: <https://www.netlify.com/support/>
- GitHub支持: <https://support.github.com/>
