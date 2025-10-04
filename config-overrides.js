const { override, addWebpackAlias, fixBabelImports } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  // 禁用babel-plugin-import插件的样式按需加载配置，因为Ant Design 5.x采用CSS-in-JS方案
  // fixBabelImports('import', {
  //   libraryName: 'antd',
  //   libraryDirectory: 'es',
  //   style: true // 对于Ant Design 5.x应禁用此配置
  // }),
  // 优化构建配置
  (config) => {
    // 生产环境优化
    if (process.env.NODE_ENV === 'production') {
      // 移除源码映射以减小包大小
      config.devtool = false;
      
      // 优化打包分割
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
          },
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            name: 'antd',
            chunks: 'all',
            priority: 10,
          },
          echarts: {
            test: /[\\/]node_modules[\\/](echarts|echarts-for-react)[\\/]/,
            name: 'echarts',
            chunks: 'all',
            priority: 15,
          },
        },
      };
      
      // 运行时代码单独打包
      config.optimization.runtimeChunk = 'single';
    }
    
    return config;
  }
);