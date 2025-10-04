#!/usr/bin/env node

/**
 * 测试运行脚本
 * 用于运行项目的单元测试
 */

const { execSync } = require('child_process');

console.log('🧪 运行单元测试...\n');

try {
  // 运行测试
  execSync('npm test -- --watchAll=false --passWithNoTests', { 
    stdio: 'inherit' 
  });
  
  console.log('\n✅ 所有测试通过！');
} catch (error) {
  console.error('\n❌ 测试失败！');
  process.exit(1);
}