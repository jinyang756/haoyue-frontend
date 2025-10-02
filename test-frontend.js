const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS配置
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'build')));

// API测试端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: '前端测试服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: '这是来自前端测试服务器的响应',
    data: {
      id: 1,
      name: '测试数据',
      value: 123.45
    }
  });
});

// 所有其他路由都返回前端应用
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`前端测试服务器运行在端口 ${PORT}`);
  console.log(`访问 http://localhost:${PORT} 查看前端应用`);
});