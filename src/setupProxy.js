const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // 只有在开发环境才使用代理
  if (process.env.NODE_ENV === 'development') {
    app.use(
      '/api',
      createProxyMiddleware({
        target: process.env.REACT_APP_API_URL || 'http://localhost:5000', // 修正为实际端口
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'  // 保持/api前缀，因为后端路由就是以/api开头的
        },
        logLevel: 'debug'
      })
    );
  }
};