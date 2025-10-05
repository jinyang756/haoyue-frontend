// 离线模式管理服务

let offlineMode = false;

/**
 * 检查当前是否处于离线模式
 */
export const isOfflineMode = (): boolean => {
  return offlineMode;
};

/**
 * 设置离线模式状态
 */
export const setOfflineMode = (enabled: boolean): void => {
  offlineMode = enabled;
};

/**
 * 模拟网络延迟
 */
export const simulateNetworkDelay = (minDelay: number = 300, maxDelay: number = 1200): Promise<void> => {
  const delay = minDelay + Math.random() * (maxDelay - minDelay);
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * 检查网络连接状态
 */
export const checkNetworkStatus = (): Promise<boolean> => {
  return new Promise(resolve => {
    if (typeof navigator !== 'undefined' && navigator.onLine !== undefined) {
      resolve(navigator.onLine);
    } else {
      // 无法确定网络状态时默认返回在线
      resolve(true);
    }
  });
};

/**
 * 监听网络状态变化
 */
export const listenNetworkStatusChange = (callback: (isOnline: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  // 返回清理函数
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    }
  };
};

// 导出默认对象
export default {
  isOfflineMode,
  setOfflineMode,
  simulateNetworkDelay,
  checkNetworkStatus,
  listenNetworkStatusChange
};