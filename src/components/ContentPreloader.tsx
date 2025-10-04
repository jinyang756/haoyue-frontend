import React, { useEffect } from 'react';

interface ContentPreloaderProps {
  onComplete: () => void;
}

export const ContentPreloader: React.FC<ContentPreloaderProps> = ({ onComplete }) => {
  useEffect(() => {
    // 预加载关键资源
    const preloadResources = async () => {
      // 预加载首页图片资源
      const imageUrls: string[] = [
        // 在这里添加需要预加载的图片URL
      ];
      
      // 预加载字体
      const fontUrls: string[] = [
        // 在这里添加需要预加载的字体URL
      ];
      
      // 创建预加载任务
      const preloadPromises: Array<Promise<void>> = [
        ...imageUrls.map(url => {
          return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = url;
          });
        }),
        ...fontUrls.map(url => {
          return new Promise<void>((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.onload = () => resolve();
            link.onerror = () => reject();
            link.href = url;
            document.head.appendChild(link);
          });
        })
      ];
      
      try {
        await Promise.all(preloadPromises);
        console.log('预加载完成');
      } catch (error) {
        console.error('预加载失败:', error);
      } finally {
        onComplete();
      }
    };
    
    preloadResources();
  }, [onComplete]);
  
  return null;
};

export default ContentPreloader;