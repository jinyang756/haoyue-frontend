import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 中文语言资源
const resources = {
  zh: {
    translation: {
      // 通用词汇
      "dashboard": "仪表盘",
      "about": "关于",
      "stock_analysis": "股票分析",
      "ai_stock_selection": "AI选股", // 新增翻译
      "ai_analysis": "AI分析",
      "content_management": "内容管理",
      "profile": "个人中心",
      "subscription": "订阅计划",
      "logout": "退出登录",
      "navigation_menu": "导航菜单",
      "vip_user": "VIP用户",
      "regular_user": "普通用户",
      
      // 页面标题
      "home_title": "皓月量化智能引擎",
      "login_title": "登录 - 皓月量化智能引擎",
      "register_title": "注册 - 皓月量化智能引擎",
      
      // 登录页面
      "login_welcome": "皓月量化智能引擎",
      "login_subtitle": "专业的AI股票分析平台",
      "username": "用户名",
      "password": "密码",
      "login_button": "登录",
      "forgot_password": "忘记密码？",
      "register_account": "注册账号",
      "login_success": "登录成功",
      "login_failed": "登录失败，请检查用户名和密码",
      "login_error": "登录失败，请稍后重试",
      
      // 首页
      "ai_intelligent_analysis": "AI智能分析",
      "real_time_data": "实时数据",
      "secure_reliable": "安全可靠",
      "cloud_deployment": "云端部署",
      "data_visualization": "数据可视化",
      "professional_team": "专业团队",
      
      // 表单验证
      "required_username": "请输入用户名",
      "required_password": "请输入密码",
      
      // 按钮文本
      "get_started": "立即开始",
      "experience_now": "立即体验",
      "learn_more": "了解更多"
    }
  },
  en: {
    translation: {
      // 通用词汇
      "dashboard": "Dashboard",
      "about": "About",
      "stock_analysis": "Stock Analysis",
      "ai_stock_selection": "AI Stock Selection", // 新增翻译
      "ai_analysis": "AI Analysis",
      "content_management": "Content Management",
      "profile": "Profile",
      "subscription": "Subscription",
      "logout": "Logout",
      "navigation_menu": "Navigation Menu",
      "vip_user": "VIP User",
      "regular_user": "Regular User",
      
      // 页面标题
      "home_title": "Haoyue Quantitative Engine",
      "login_title": "Login - Haoyue Quantitative Engine",
      "register_title": "Register - Haoyue Quantitative Engine",
      
      // 登录页面
      "login_welcome": "Haoyue Quantitative Engine",
      "login_subtitle": "Professional AI Stock Analysis Platform",
      "username": "Username",
      "password": "Password",
      "login_button": "Login",
      "forgot_password": "Forgot Password?",
      "register_account": "Register Account",
      "login_success": "Login successful",
      "login_failed": "Login failed, please check username and password",
      "login_error": "Login failed, please try again later",
      
      // 首页
      "ai_intelligent_analysis": "AI Intelligent Analysis",
      "real_time_data": "Real-time Data",
      "secure_reliable": "Secure & Reliable",
      "cloud_deployment": "Cloud Deployment",
      "data_visualization": "Data Visualization",
      "professional_team": "Professional Team",
      
      // 表单验证
      "required_username": "Please enter username",
      "required_password": "Please enter password",
      
      // 按钮文本
      "get_started": "Get Started",
      "experience_now": "Experience Now",
      "learn_more": "Learn More"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh", // 默认语言为中文
    fallbackLng: "zh",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;