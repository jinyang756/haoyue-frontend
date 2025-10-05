// API测试工具端到端测试
const { test, expect } = require('@playwright/test');

test.describe('API测试工具', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到API服务页面
    await page.goto('/api-service');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 点击API测试工具标签页
    await page.click('text=API测试工具');
    
    // 等待测试工具面板加载
    await page.waitForSelector('text=API测试工具');
  });

  test('应该能够发送GET请求并显示响应', async ({ page }) => {
    // 填入URL
    await page.fill('input[placeholder="请输入API端点URL，例如: https://api.example.com/users"]', 'https://httpbin.org/get');
    
    // 选择GET方法
    await page.selectOption('select', 'GET');
    
    // 点击发送请求按钮
    await page.click('button:has-text("发送请求")');
    
    // 等待响应
    await page.waitForSelector('text=200 OK', { timeout: 10000 });
    
    // 验证响应状态码
    await expect(page.locator('text=200 OK')).toBeVisible();
    
    // 验证响应时间显示
    await expect(page.locator('text=ms')).toBeVisible();
  });

  test('应该能够添加和删除请求头', async ({ page }) => {
    // 点击添加Header按钮
    await page.click('button:has-text("添加Header")');
    
    // 填入Header名称和值
    const headerInputs = await page.$$('input[placeholder="Header名称"]');
    const valueInputs = await page.$$('input[placeholder="Header值"]');
    
    await headerInputs[1].fill('Authorization');
    await valueInputs[1].fill('Bearer token123');
    
    // 验证Header已添加
    await expect(page.locator('input[value="Authorization"]')).toBeVisible();
    await expect(page.locator('input[value="Bearer token123"]')).toBeVisible();
    
    // 删除Header
    const deleteButtons = await page.$$('button[aria-label="delete"]');
    await deleteButtons[1].click();
    
    // 验证Header已删除
    await expect(page.locator('input[value="Authorization"]')).not.toBeVisible();
  });

  test('应该能够添加和删除查询参数', async ({ page }) => {
    // 点击添加参数按钮
    await page.click('button:has-text("添加参数")');
    
    // 填入参数名称和值
    const paramInputs = await page.$$('input[placeholder="参数名称"]');
    const valueInputs = await page.$$('input[placeholder="参数值"]');
    
    await paramInputs[0].fill('page');
    await valueInputs[0].fill('1');
    
    // 验证参数已添加
    await expect(page.locator('input[value="page"]')).toBeVisible();
    await expect(page.locator('input[value="1"]')).toBeVisible();
    
    // 删除参数
    const deleteButtons = await page.$$('button[aria-label="delete"]');
    await deleteButtons[0].click();
    
    // 验证参数已删除
    await expect(page.locator('input[value="page"]')).not.toBeVisible();
  });

  test('应该能够保存请求到历史记录', async ({ page }) => {
    // 填入URL
    await page.fill('input[placeholder="请输入API端点URL，例如: https://api.example.com/users"]', 'https://httpbin.org/get');
    
    // 点击保存按钮
    await page.click('button:has-text("保存")');
    
    // 验证保存成功消息（如果有）
    // 注意：由于是端到端测试，我们可能无法直接验证Ant Design的message组件
    // 但我们可以通过检查历史记录面板来验证
    
    // 点击历史记录面板
    await page.click('text=历史记录');
    
    // 验证历史记录中包含保存的请求
    await expect(page.locator('text=https://httpbin.org/get')).toBeVisible();
  });
});