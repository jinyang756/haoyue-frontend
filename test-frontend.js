const http = require('http');

// 测试前端服务是否正常运行
const frontendOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

const frontendReq = http.request(frontendOptions, (res) => {
  console.log(`前端服务状态码: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('前端服务正常运行');
  } else {
    console.log('前端服务可能存在问题');
  }
});

frontendReq.on('error', (error) => {
  console.error('前端服务连接错误:', error.message);
});

frontendReq.end();

// 测试后端API是否正常运行
const backendOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET'
};

const backendReq = http.request(backendOptions, (res) => {
  console.log(`后端服务状态码: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('后端服务正常运行');
  } else {
    console.log('后端服务可能存在问题');
  }
});

backendReq.on('error', (error) => {
  console.error('后端服务连接错误:', error.message);
});

backendReq.end();