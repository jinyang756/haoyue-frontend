const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // 只有在开发环境才使用代理
  if (process.env.NODE_ENV === 'development') {
    // 确保使用与.env文件中一致的端口
    const target = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    
    app.use(
      '/api',
      createProxyMiddleware({
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'  // 保持/api前缀，因为后端路由就是以/api开头的
        },
        logLevel: 'debug'
      })
    );
  }
};