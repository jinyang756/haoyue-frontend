import React, { useEffect } from 'react';

declare global {
  interface Window {
    _MICHAT: any;
  }
}

export const ChatWidget: React.FC = () => {
  useEffect(() => {
    // 确保只加载一次
    if (window._MICHAT) {
      return;
    }

    // 初始化米多客客服系统
    window._MICHAT = window._MICHAT || function () { 
      (window._MICHAT.a = window._MICHAT.a || []).push(arguments);
    };

    // 配置米多客参数
    window._MICHAT("cptid", "386983e498c6b51476");
    window._MICHAT("domain", "emdd.xianshangzixun.net");
    window._MICHAT("lng", "cn");

    // 动态加载米多客脚本
    const loadScript = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.charset = 'UTF-8';
      script.async = true;
      script.src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + 
                   'emdd.xianshangzixun.net/Web/js/mivisit.js?_=t' + new Date().getTime();
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    };

    // 延迟加载以避免影响页面性能
    const loadTimer = setTimeout(() => {
      loadScript();
    }, 3000);

    // 清理函数
    return () => {
      clearTimeout(loadTimer);
    };
  }, []);

  return null; // 此组件不渲染任何UI元素
};

export default ChatWidget;