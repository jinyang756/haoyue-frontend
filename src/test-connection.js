// 简单的连接测试脚本
const testConnection = async () => {
  try {
    console.log('测试前端到后端的连接...');
    
    // 测试直接连接
    const directResponse = await fetch('http://localhost:5000/health');
    console.log('直接连接测试:', directResponse.ok ? '成功' : '失败');
    
    // 测试代理连接
    const proxyResponse = await fetch('/api/health');
    console.log('代理连接测试:', proxyResponse.ok ? '成功' : '失败');
    
    console.log('连接测试完成');
  } catch (error) {
    console.error('连接测试失败:', error);
  }
};

testConnection();