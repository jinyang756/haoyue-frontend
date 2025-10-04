#!/usr/bin/env node

/**
 * 快速启动脚本
 * 用于快速设置开发环境和启动项目
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 皓月量化智能引擎 - 前端快速启动脚本\n');

// 检查Node.js版本
function checkNodeVersion() {
  console.log('🔍 检查Node.js版本...');
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    console.log(`  ❌ Node.js版本过低 (${version})，请升级到16.0.0或更高版本`);
    return false;
  } else {
    console.log(`  ✅ Node.js版本 ${version}`);
    return true;
  }
}

// 检查npm版本
function checkNpmVersion() {
  console.log('🔍 检查npm版本...');
  try {
    const version = execSync('npm --version', { encoding: 'utf-8' }).trim();
    const majorVersion = parseInt(version.split('.')[0]);
    
    if (majorVersion < 8) {
      console.log(`  ⚠️  npm版本较低 (${version})，建议升级到8.0.0或更高版本`);
    } else {
      console.log(`  ✅ npm版本 ${version}`);
    }
    return true;
  } catch (error) {
    console.log('  ❌ 无法检测npm版本');
    return false;
  }
}

// 安装依赖
function installDependencies() {
  console.log('📦 安装项目依赖...');
  try {
    execSync('npm ci', { stdio: 'inherit' });
    console.log('  ✅ 依赖安装完成');
    return true;
  } catch (error) {
    console.log('  ❌ 依赖安装失败');
    return false;
  }
}

// 启动开发服务器
function startDevServer() {
  console.log('🚀 启动开发服务器...');
  console.log('  请在浏览器中访问 http://localhost:3000');
  console.log('  按 Ctrl+C 停止服务器\n');
  
  try {
    execSync('npm start', { stdio: 'inherit' });
  } catch (error) {
    // 正常退出
  }
}

// 主函数
async function main() {
  console.log('📋 开始设置开发环境...\n');
  
  // 检查环境
  if (!checkNodeVersion()) {
    process.exit(1);
  }
  
  if (!checkNpmVersion()) {
    process.exit(1);
  }
  
  console.log('');
  
  // 安装依赖
  if (!installDependencies()) {
    process.exit(1);
  }
  
  console.log('\n✅ 开发环境设置完成！\n');
  
  // 询问是否启动开发服务器
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('是否立即启动开发服务器？(y/N): ', (answer) => {
    rl.close();
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      startDevServer();
    } else {
      console.log('💡 您可以随时运行以下命令启动开发服务器：');
      console.log('   npm start');
    }
  });
}

// 执行主函数
main();