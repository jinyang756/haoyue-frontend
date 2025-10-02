import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = '皓月量化智能引擎 - 基于AI的股票分析平台',
  description = '皓月量化智能引擎 - 基于AI的股票分析平台，提供实时股票数据、技术指标分析、AI智能推荐等服务，帮助投资者做出更明智的投资决策。',
  keywords = '股票分析, AI量化, 技术指标, 股票推荐, 投资分析, 金融数据, 量化交易, 股市分析',
  url = 'https://haoyuequant.com',
  image = '/logo192.png'
}) => {
  const fullTitle = title === '皓月量化智能引擎 - 基于AI的股票分析平台' 
    ? title 
    : `${title} - 皓月量化智能引擎`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="皓月量化智能引擎" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;