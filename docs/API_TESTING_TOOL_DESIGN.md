# API测试和调试工具模块设计文档

## 1. 概述

本模块旨在为开发者提供一个直观的API测试和调试工具，集成到现有的API服务管理页面中。该工具将允许开发者直接在前端界面中测试API端点，查看响应结果，并进行调试。

## 2. 功能需求

### 2.1 核心功能

1. **API端点测试**
   - 支持常见的HTTP方法（GET, POST, PUT, DELETE, PATCH）
   - 可配置请求头（Headers）
   - 可编辑请求体（Body）
   - 支持查询参数（Query Parameters）
   - 实时发送请求并显示响应

2. **响应展示**
   - 格式化显示JSON响应
   - 显示响应状态码和响应时间
   - 显示响应头信息
   - 支持原始响应和格式化响应切换

3. **历史记录**
   - 保存测试历史记录
   - 支持历史记录的查看和重新执行
   - 可删除历史记录

4. **环境管理**
   - 支持多个环境配置（开发、测试、生产）
   - 可快速切换环境
   - 环境变量支持

### 2.2 扩展功能

1. **自动化测试**
   - 支持创建测试用例
   - 可配置断言验证
   - 支持批量执行测试

2. **性能测试**
   - 支持并发请求测试
   - 显示响应时间统计
   - 生成性能报告

## 3. 技术设计

### 3.1 前端组件结构

```
ApiTestingTool/
├── ApiTester.tsx              # 主测试组件
├── RequestConfigurator.tsx    # 请求配置组件
├── ResponseViewer.tsx         # 响应展示组件
├── HistoryPanel.tsx           # 历史记录面板
├── EnvironmentManager.tsx     # 环境管理组件
├── TestRunner.ts             # 测试执行器
└── TestHistoryService.ts     # 历史记录服务
```

### 3.2 数据模型

```typescript
// 测试请求配置
interface TestRequestConfig {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body: string;
  queryParams: Record<string, string>;
  environment: string;
}

// 测试响应结果
interface TestResponse {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
  timestamp: string;
}

// 测试历史记录
interface TestHistory {
  id: string;
  request: TestRequestConfig;
  response: TestResponse;
  success: boolean;
}

// 环境配置
interface Environment {
  id: string;
  name: string;
  baseUrl: string;
  variables: Record<string, string>;
}
```

### 3.3 状态管理

使用Redux Toolkit管理测试工具的状态：

```typescript
interface ApiTestingState {
  currentRequest: TestRequestConfig;
  lastResponse: TestResponse | null;
  history: TestHistory[];
  environments: Environment[];
  currentEnvironment: string;
  isTesting: boolean;
  error: string | null;
}
```

## 4. API接口设计

### 4.1 前端服务接口

```typescript
// 发送测试请求
sendTestRequest(config: TestRequestConfig): Promise<TestResponse>

// 获取历史记录
getTestHistory(): Promise<TestHistory[]>

// 保存测试历史
saveTestHistory(history: TestHistory): Promise<void>

// 删除历史记录
deleteTestHistory(id: string): Promise<void>

// 获取环境配置
getEnvironments(): Promise<Environment[]>

// 保存环境配置
saveEnvironment(env: Environment): Promise<void>
```

### 4.2 后端API接口（如需要）

如果需要持久化存储历史记录和环境配置，可能需要以下后端接口：

```
POST /api/testing/test      # 执行测试请求
GET /api/testing/history    # 获取测试历史
POST /api/testing/history   # 保存测试历史
DELETE /api/testing/history/:id  # 删除测试历史
GET /api/testing/environments    # 获取环境配置
POST /api/testing/environments   # 保存环境配置
```

## 5. UI设计

### 5.1 主界面布局

```
+---------------------------------------------------+
| 环境选择 | [环境管理按钮]                         |
+---------------------------------------------------+
| URL输入框 | 方法选择 | [发送按钮] | [保存按钮]     |
+---------------------------------------------------+
| 请求配置区域                                      |
| +------------------------------------------------+
| | Headers配置                                    |
| | Query Parameters配置                           |
| | Request Body编辑器                             |
| +------------------------------------------------+
+---------------------------------------------------+
| 响应展示区域                                      |
| +------------------------------------------------+
| | 状态码 | 响应时间 | [格式化切换]                |
| | Response Headers                               |
| | Response Body                                  |
| +------------------------------------------------+
+---------------------------------------------------+
| 历史记录面板                                      |
| +------------------------------------------------+
| | 历史记录列表                                   |
| +------------------------------------------------+
+---------------------------------------------------+
```

### 5.2 组件交互流程

1. 用户选择环境或配置URL和方法
2. 用户配置请求参数（Headers, Query Params, Body）
3. 用户点击发送按钮
4. 系统发送请求并显示Loading状态
5. 系统接收响应并展示结果
6. 系统保存测试记录到历史记录中

## 6. 安全考虑

1. **CORS限制**：测试工具需要处理跨域请求问题
2. **认证令牌**：支持自动添加认证头
3. **敏感信息保护**：避免在历史记录中保存敏感信息
4. **请求限制**：防止恶意大量请求

## 7. 性能优化

1. **响应缓存**：对相同请求进行缓存
2. **历史记录分页**：避免历史记录过多影响性能
3. **异步加载**：组件按需加载
4. **响应格式化**：大数据量响应的优化显示

## 8. 测试计划

### 8.1 单元测试

1. 测试请求配置组件的表单验证
2. 测试响应展示组件的数据格式化
3. 测试历史记录服务的增删改查
4. 测试环境管理组件的配置保存

### 8.2 集成测试

1. 测试完整的请求-响应流程
2. 测试历史记录的持久化
3. 测试环境切换功能
4. 测试错误处理流程

### 8.3 端到端测试

1. 测试用户完整的测试流程
2. 测试历史记录的查看和重新执行
3. 测试环境管理功能
4. 测试性能边界情况

## 9. 部署考虑

1. **前端集成**：作为API服务页面的一个标签页
2. **后端支持**：如需要持久化存储，需添加相应接口
3. **权限控制**：仅限管理员或开发者访问
4. **监控告警**：监控测试工具的使用情况和性能
