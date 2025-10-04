import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const Disclaimer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="disclaimer-page">
      <Card>
        <Title level={2}>{t('disclaimer.title')}</Title>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('disclaimer.generalInfo')}</strong>
        </Paragraph>
        <Paragraph>
          {t('disclaimer.generalInfoDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('disclaimer.investmentRisk')}</strong>
        </Paragraph>
        <Paragraph>
          {t('disclaimer.investmentRiskDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('disclaimer.dataAccuracy')}</strong>
        </Paragraph>
        <Paragraph>
          {t('disclaimer.dataAccuracyDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('disclaimer.thirdParty')}</strong>
        </Paragraph>
        <Paragraph>
          {t('disclaimer.thirdPartyDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('disclaimer.limitationOfLiability')}</strong>
        </Paragraph>
        <Paragraph>
          {t('disclaimer.limitationOfLiabilityDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('disclaimer.userResponsibility')}</strong>
        </Paragraph>
        <Paragraph>
          {t('disclaimer.userResponsibilityDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('disclaimer.modification')}</strong>
        </Paragraph>
        <Paragraph>
          {t('disclaimer.modificationDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <em>{t('disclaimer.lastUpdated')}: October 4, 2025</em>
        </Paragraph>
      </Card>
    </div>
  );
};

export default Disclaimer;