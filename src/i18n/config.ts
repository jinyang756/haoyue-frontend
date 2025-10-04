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
      "learn_more": "了解更多",
      
      // 法律页面
      "disclaimer.title": "免责声明",
      "disclaimer.generalInfo": "一般信息",
      "disclaimer.generalInfoDesc": "本网站提供的信息仅供一般参考之用，不构成任何投资建议。在做出任何投资决策之前，请您咨询专业的财务顾问。",
      "disclaimer.investmentRisk": "投资风险",
      "disclaimer.investmentRiskDesc": "股票市场投资存在风险，可能导致本金损失。过往表现并不代表未来收益。所有投资都存在风险，您应根据自己的财务状况谨慎投资。",
      "disclaimer.dataAccuracy": "数据准确性",
      "disclaimer.dataAccuracyDesc": "我们努力确保网站信息的准确性，但不保证所有信息的完整性和及时性。我们不对因使用本网站信息而产生的任何损失承担责任。",
      "disclaimer.thirdParty": "第三方链接",
      "disclaimer.thirdPartyDesc": "本网站可能包含指向第三方网站的链接，这些链接仅为方便用户而提供。我们不对这些第三方网站的内容或隐私政策负责。",
      "disclaimer.limitationOfLiability": "责任限制",
      "disclaimer.limitationOfLiabilityDesc": "在任何情况下，我们均不对因使用或无法使用本网站而引起的任何直接、间接、特殊或后果性损害承担责任。",
      "disclaimer.userResponsibility": "用户责任",
      "disclaimer.userResponsibilityDesc": "您有责任确保您使用本网站符合您所在国家/地区的法律法规。",
      "disclaimer.modification": "条款修改",
      "disclaimer.modificationDesc": "我们保留随时修改本免责声明的权利，修改后的条款将在网站上公布。",
      "disclaimer.lastUpdated": "最后更新",
      
      "privacyPolicy.title": "隐私政策",
      "privacyPolicy.introduction": "介绍",
      "privacyPolicy.introductionDesc": "我们重视您的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。",
      "privacyPolicy.informationWeCollect": "我们收集的信息",
      "privacyPolicy.personalInfo": "个人身份信息（如姓名、电子邮件地址）",
      "privacyPolicy.usageData": "使用数据（如IP地址、浏览器类型、访问时间）",
      "privacyPolicy.cookies": "Cookie和跟踪技术",
      "privacyPolicy.howWeUseInfo": "我们如何使用信息",
      "privacyPolicy.provideServices": "提供和维护我们的服务",
      "privacyPolicy.improveServices": "改善用户体验和网站功能",
      "privacyPolicy.communicate": "与您沟通，包括发送服务更新",
      "privacyPolicy.complyLegal": "遵守法律法规要求",
      "privacyPolicy.dataProtection": "数据保护",
      "privacyPolicy.dataProtectionDesc": "我们实施适当的技术和组织措施来保护您的个人信息免受未经授权的访问、使用或披露。",
      "privacyPolicy.sharingInfo": "信息共享",
      "privacyPolicy.sharingInfoDesc": "我们不会将您的个人信息出售给第三方。仅在以下情况下可能共享信息：获得您的明确同意、法律要求或保护我们的合法权益。",
      "privacyPolicy.cookiesTech": "Cookie和跟踪技术",
      "privacyPolicy.cookiesTechDesc": "我们使用Cookie来改善网站功能和用户体验。您可以通过浏览器设置管理Cookie偏好。",
      "privacyPolicy.dataRetention": "数据保留",
      "privacyPolicy.dataRetentionDesc": "我们仅在实现本政策所述目的所需的时间内保留您的个人信息，除非法律要求更长的保留期。",
      "privacyPolicy.yourRights": "您的权利",
      "privacyPolicy.rightAccess": "访问您的个人信息",
      "privacyPolicy.rightRectification": "更正不准确的信息",
      "privacyPolicy.rightErasure": "删除您的个人信息",
      "privacyPolicy.rightRestrict": "限制处理您的个人信息",
      "privacyPolicy.rightDataPortability": "数据可移植性",
      "privacyPolicy.rightObjection": "反对处理您的个人信息",
      "privacyPolicy.childrenPrivacy": "儿童隐私",
      "privacyPolicy.childrenPrivacyDesc": "我们的服务不面向13岁以下的儿童。我们不会故意收集儿童的个人信息。",
      "privacyPolicy.changes": "政策变更",
      "privacyPolicy.changesDesc": "我们可能更新本隐私政策。重大变更将在网站上公布并标注更新日期。",
      "privacyPolicy.contactUs": "联系我们",
      "privacyPolicy.contactUsDesc": "如您对本隐私政策有任何疑问，请通过以下方式联系我们：support@haoyue.com",
      "privacyPolicy.lastUpdated": "最后更新",
      
      // 功能指南页面
      "featureGuide.title": "功能指南",
      
      // 设置页面
      "settings.title": "系统设置",
      "settings.brandAnimation": "品牌动画设置",
      "settings.showAnimation": "显示品牌动画",
      "settings.showAnimationDesc": "在首次访问时显示品牌介绍动画",
      "settings.loopAnimation": "循环播放动画",
      "settings.loopAnimationDesc": "让品牌动画循环播放直到用户操作",
      "settings.autoPlayAnimation": "自动播放动画",
      "settings.autoPlayAnimationDesc": "页面加载时自动播放品牌动画",
      "settings.performance": "性能设置",
      "settings.preloadContent": "启用内容预加载",
      "settings.preloadContentDesc": "在动画播放期间预加载页面内容",
      "settings.particleBackground": "启用粒子背景",
      "settings.particleBackgroundDesc": "显示动态粒子背景效果",
      "save_settings": "保存设置",
      "reset_settings": "恢复默认"
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
      "learn_more": "Learn More",
      
      // 法律页面
      "disclaimer.title": "Disclaimer",
      "disclaimer.generalInfo": "General Information",
      "disclaimer.generalInfoDesc": "The information provided on this website is for general reference only and does not constitute any investment advice. Please consult a professional financial advisor before making any investment decisions.",
      "disclaimer.investmentRisk": "Investment Risk",
      "disclaimer.investmentRiskDesc": "Investing in the stock market involves risks that may result in loss of principal. Past performance does not guarantee future returns. All investments carry risks, and you should invest cautiously according to your financial situation.",
      "disclaimer.dataAccuracy": "Data Accuracy",
      "disclaimer.dataAccuracyDesc": "We strive to ensure the accuracy of website information, but do not guarantee the completeness and timeliness of all information. We are not responsible for any losses arising from the use of information on this website.",
      "disclaimer.thirdParty": "Third Party Links",
      "disclaimer.thirdPartyDesc": "This website may contain links to third party websites provided for user convenience only. We are not responsible for the content or privacy policies of these third party websites.",
      "disclaimer.limitationOfLiability": "Limitation of Liability",
      "disclaimer.limitationOfLiabilityDesc": "Under no circumstances shall we be liable for any direct, indirect, special or consequential damages arising from the use or inability to use this website.",
      "disclaimer.userResponsibility": "User Responsibility",
      "disclaimer.userResponsibilityDesc": "You are responsible for ensuring that your use of this website complies with the laws and regulations of your country/region.",
      "disclaimer.modification": "Terms Modification",
      "disclaimer.modificationDesc": "We reserve the right to modify this disclaimer at any time. Modified terms will be published on the website.",
      "disclaimer.lastUpdated": "Last Updated",
      
      "privacyPolicy.title": "Privacy Policy",
      "privacyPolicy.introduction": "Introduction",
      "privacyPolicy.introductionDesc": "We value your privacy protection. This privacy policy explains how we collect, use, store and protect your personal information.",
      "privacyPolicy.informationWeCollect": "Information We Collect",
      "privacyPolicy.personalInfo": "Personal identification information (such as name, email address)",
      "privacyPolicy.usageData": "Usage data (such as IP address, browser type, access time)",
      "privacyPolicy.cookies": "Cookies and tracking technologies",
      "privacyPolicy.howWeUseInfo": "How We Use Information",
      "privacyPolicy.provideServices": "Provide and maintain our services",
      "privacyPolicy.improveServices": "Improve user experience and website functionality",
      "privacyPolicy.communicate": "Communicate with you, including sending service updates",
      "privacyPolicy.complyLegal": "Comply with legal requirements",
      "privacyPolicy.dataProtection": "Data Protection",
      "privacyPolicy.dataProtectionDesc": "We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use or disclosure.",
      "privacyPolicy.sharingInfo": "Information Sharing",
      "privacyPolicy.sharingInfoDesc": "We do not sell your personal information to third parties. Information may only be shared under the following circumstances: with your explicit consent, legal requirements, or to protect our legitimate interests.",
      "privacyPolicy.cookiesTech": "Cookies and Tracking Technologies",
      "privacyPolicy.cookiesTechDesc": "We use cookies to improve website functionality and user experience. You can manage cookie preferences through browser settings.",
      "privacyPolicy.dataRetention": "Data Retention",
      "privacyPolicy.dataRetentionDesc": "We retain your personal information only for as long as necessary to achieve the purposes described in this policy, unless a longer retention period is required by law.",
      "privacyPolicy.yourRights": "Your Rights",
      "privacyPolicy.rightAccess": "Access your personal information",
      "privacyPolicy.rightRectification": "Correct inaccurate information",
      "privacyPolicy.rightErasure": "Delete your personal information",
      "privacyPolicy.rightRestrict": "Restrict processing of your personal information",
      "privacyPolicy.rightDataPortability": "Data portability",
      "privacyPolicy.rightObjection": "Object to processing of your personal information",
      "privacyPolicy.childrenPrivacy": "Children's Privacy",
      "privacyPolicy.childrenPrivacyDesc": "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children.",
      "privacyPolicy.changes": "Policy Changes",
      "privacyPolicy.changesDesc": "We may update this privacy policy. Major changes will be announced on the website with an updated date.",
      "privacyPolicy.contactUs": "Contact Us",
      "privacyPolicy.contactUsDesc": "If you have any questions about this privacy policy, please contact us at: support@haoyue.com",
      "privacyPolicy.lastUpdated": "Last Updated",
      
      // 功能指南页面
      "featureGuide.title": "Feature Guide",
      
      // 设置页面
      "settings.title": "System Settings",
      "settings.brandAnimation": "Brand Animation Settings",
      "settings.showAnimation": "Show Brand Animation",
      "settings.showAnimationDesc": "Show brand introduction animation on first visit",
      "settings.loopAnimation": "Loop Animation",
      "settings.loopAnimationDesc": "Loop brand animation until user interaction",
      "settings.autoPlayAnimation": "Auto Play Animation",
      "settings.autoPlayAnimationDesc": "Automatically play brand animation on page load",
      "settings.performance": "Performance Settings",
      "settings.preloadContent": "Enable Content Preloading",
      "settings.preloadContentDesc": "Preload page content during animation playback",
      "settings.particleBackground": "Enable Particle Background",
      "settings.particleBackgroundDesc": "Display dynamic particle background effect",
      "save_settings": "Save Settings",
      "reset_settings": "Reset to Default"
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