import React, { useState, useEffect } from 'react';
import { Card, Typography, Switch, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [showAnimation, setShowAnimation] = useState<boolean>(true);
  const [loopAnimation, setLoopAnimation] = useState<boolean>(false);
  const [autoPlayAnimation, setAutoPlayAnimation] = useState<boolean>(true);

  // 从localStorage加载设置
  useEffect(() => {
    const savedShowAnimation = localStorage.getItem('showBrandAnimation');
    const savedLoopAnimation = localStorage.getItem('loopBrandAnimation');
    const savedAutoPlayAnimation = localStorage.getItem('autoPlayBrandAnimation');
    
    if (savedShowAnimation !== null) {
      setShowAnimation(savedShowAnimation === 'true');
    }
    
    if (savedLoopAnimation !== null) {
      setLoopAnimation(savedLoopAnimation === 'true');
    }
    
    if (savedAutoPlayAnimation !== null) {
      setAutoPlayAnimation(savedAutoPlayAnimation === 'true');
    }
  }, []);

  // 保存设置到localStorage
  const saveSettings = () => {
    localStorage.setItem('showBrandAnimation', showAnimation.toString());
    localStorage.setItem('loopBrandAnimation', loopAnimation.toString());
    localStorage.setItem('autoPlayBrandAnimation', autoPlayAnimation.toString());
    message.success('设置已保存');
  };

  // 重置为默认设置
  const resetSettings = () => {
    setShowAnimation(true);
    setLoopAnimation(false);
    setAutoPlayAnimation(true);
    message.info('已重置为默认设置');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          {t('settings.title')}
        </Title>
        
        <Card title={t('settings.brandAnimation')} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <Paragraph strong>{t('settings.showAnimation')}</Paragraph>
              <Paragraph type="secondary">{t('settings.showAnimationDesc')}</Paragraph>
            </div>
            <Switch 
              checked={showAnimation} 
              onChange={setShowAnimation} 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <Paragraph strong>{t('settings.loopAnimation')}</Paragraph>
              <Paragraph type="secondary">{t('settings.loopAnimationDesc')}</Paragraph>
            </div>
            <Switch 
              checked={loopAnimation} 
              onChange={setLoopAnimation} 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Paragraph strong>{t('settings.autoPlayAnimation')}</Paragraph>
              <Paragraph type="secondary">{t('settings.autoPlayAnimationDesc')}</Paragraph>
            </div>
            <Switch 
              checked={autoPlayAnimation} 
              onChange={setAutoPlayAnimation} 
            />
          </div>
        </Card>
        
        <Card title={t('settings.performance')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <Paragraph strong>{t('settings.preloadContent')}</Paragraph>
              <Paragraph type="secondary">{t('settings.preloadContentDesc')}</Paragraph>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Paragraph strong>{t('settings.particleBackground')}</Paragraph>
              <Paragraph type="secondary">{t('settings.particleBackgroundDesc')}</Paragraph>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={saveSettings}
            style={{ marginRight: '15px' }}
          >
            {t('save_settings')}
          </Button>
          <Button 
            size="large" 
            onClick={resetSettings}
          >
            {t('reset_settings')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;