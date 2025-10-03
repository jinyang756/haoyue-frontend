// 简单的首页测试脚本
console.log('测试首页加载...');

// 检查页面元素
setTimeout(() => {
  const title = document.querySelector('title');
  console.log('页面标题:', title ? title.textContent : '未找到标题');
  
  const root = document.getElementById('root');
  console.log('根元素存在:', !!root);
  
  if (root) {
    console.log('根元素内容长度:', root.innerHTML.length);
  }
  
  // 检查是否有品牌展示组件
  const brandShowcase = document.querySelector('[class*="BrandContainer"]');
  console.log('品牌展示组件存在:', !!brandShowcase);
  
  // 检查是否有粒子背景
  const particles = document.getElementById('enhanced-particles-js');
  console.log('粒子背景存在:', !!particles);
  
  console.log('首页测试完成');
}, 2000);