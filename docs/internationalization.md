# 前端国际化 (i18n) 指南

## 概述

本文档介绍皓月量化平台前端的国际化实现方案，支持中英文切换。

## 技术栈

- [i18next](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)

## 目录结构

```bash
src/
  i18n/
    config.ts      # i18n 配置文件
```

## 配置说明

### 语言资源配置

在 [config.ts](file:///c:/Users/28163/Desktop/%E7%9A%93%E6%9C%88/haoyue-frontend/src/i18n/config.ts) 文件中定义了中英文语言资源：

```typescript
const resources = {
  zh: {
    translation: {
      // 中文翻译
    }
  },
  en: {
    translation: {
      // 英文翻译
    }
  }
};
```

### 默认语言

默认语言设置为中文：

```typescript
lng: "zh", // 默认语言为中文
fallbackLng: "zh",
```

## 使用方法

### 在组件中使用翻译

1. 导入 `useTranslation` 钩子：

```typescript
import { useTranslation } from 'react-i18next';
```

2. 在组件中使用：

```typescript
const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <p>{t('welcome_message')}</p>
    </div>
  );
};
```

### 添加新的翻译文本

1. 在 [config.ts](file:///c:/Users/28163/Desktop/%E7%9A%93%E6%9C%88/haoyue-frontend/src/i18n/config.ts) 的 `resources` 对象中添加新的键值对：

```json
// 中文
"new_key": "中文文本"

// 英文
"new_key": "English text"
```

2. 在组件中使用新添加的键：

```typescript
{t('new_key')}
```

## 支持的语言

- 简体中文 (zh)
- 英文 (en)

## 语言切换

目前默认语言为中文。未来可以扩展语言切换功能。

## 最佳实践

### 键名命名规范

1. 使用下划线分隔命名法：`user_profile`, `login_button`
2. 按功能模块分组：`profile_edit_title`, `profile_save_button`
3. 保持键名简洁且具有描述性

### 翻译文本维护

1. 保持中英文翻译内容一致
2. 定期检查和更新翻译文本
3. 避免在翻译文本中使用硬编码的变量

通过以上配置，皓月量化平台前端已支持国际化，可以根据需要扩展更多语言支持。
