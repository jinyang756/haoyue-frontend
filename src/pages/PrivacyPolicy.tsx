import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="privacy-policy-page">
      <Card>
        <Title level={2}>{t('privacyPolicy.title')}</Title>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.introduction')}</strong>
        </Paragraph>
        <Paragraph>
          {t('privacyPolicy.introductionDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.informationWeCollect')}</strong>
        </Paragraph>
        <Paragraph>
          <ul>
            <li>{t('privacyPolicy.personalInfo')}</li>
            <li>{t('privacyPolicy.usageData')}</li>
            <li>{t('privacyPolicy.cookies')}</li>
          </ul>
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.howWeUseInfo')}</strong>
        </Paragraph>
        <Paragraph>
          <ul>
            <li>{t('privacyPolicy.provideServices')}</li>
            <li>{t('privacyPolicy.improveServices')}</li>
            <li>{t('privacyPolicy.communicate')}</li>
            <li>{t('privacyPolicy.complyLegal')}</li>
          </ul>
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.dataProtection')}</strong>
        </Paragraph>
        <Paragraph>
          {t('privacyPolicy.dataProtectionDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.sharingInfo')}</strong>
        </Paragraph>
        <Paragraph>
          {t('privacyPolicy.sharingInfoDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.cookiesTech')}</strong>
        </Paragraph>
        <Paragraph>
          {t('privacyPolicy.cookiesTechDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.dataRetention')}</strong>
        </Paragraph>
        <Paragraph>
          {t('privacyPolicy.dataRetentionDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.yourRights')}</strong>
        </Paragraph>
        <Paragraph>
          <ul>
            <li>{t('privacyPolicy.rightAccess')}</li>
            <li>{t('privacyPolicy.rightRectification')}</li>
            <li>{t('privacyPolicy.rightErasure')}</li>
            <li>{t('privacyPolicy.rightRestrict')}</li>
            <li>{t('privacyPolicy.rightDataPortability')}</li>
            <li>{t('privacyPolicy.rightObjection')}</li>
          </ul>
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.childrenPrivacy')}</strong>
        </Paragraph>
        <Paragraph>
          {t('privacyPolicy.childrenPrivacyDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.changes')}</strong>
        </Paragraph>
        <Paragraph>
          {t('privacyPolicy.changesDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <strong>{t('privacyPolicy.contactUs')}</strong>
        </Paragraph>
        <Paragraph>
          {t('privacyPolicy.contactUsDesc')}
        </Paragraph>
        
        <Divider />
        
        <Paragraph>
          <em>{t('privacyPolicy.lastUpdated')}: October 4, 2025</em>
        </Paragraph>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;