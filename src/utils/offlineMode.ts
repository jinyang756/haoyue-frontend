// 离线模式支持工具

// 检查是否处于离线模式
export const isOfflineMode = (): boolean => {
  // 可以通过环境变量或本地存储来控制离线模式
  return process.env.REACT_APP_OFFLINE_MODE === 'true' || 
         localStorage.getItem('offlineMode') === 'true';
};

// 设置离线模式
export const setOfflineMode = (offline: boolean) => {
  if (offline) {
    localStorage.setItem('offlineMode', 'true');
  } else {
    localStorage.removeItem('offlineMode');
  }
};

// 模拟网络延迟
export const simulateNetworkDelay = (min: number = 300, max: number = 1000): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// 模拟API调用失败
export const simulateNetworkError = (rate: number = 0.3): boolean => {
  return Math.random() < rate;
};