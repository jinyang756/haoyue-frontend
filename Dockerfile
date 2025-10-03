# 使用Node.js官方镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制应用代码
COPY . .

# 构建生产版本
RUN npm run build

# 安装serve来运行生产版本
RUN npm install -g serve

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["serve", "-s", "build", "-l", "3000"]