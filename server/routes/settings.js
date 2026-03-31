const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const defaultSettings = {
  site: {
    name: '貝達國際貿易有限公司',
    description: '專業的國際貿易服務提供商',
    keywords: '國際貿易,採購代理,進出口服務',
    logo: '/images/logo.png',
    favicon: '/favicon.ico'
  },
  contact: {
    phone: '+886-985-328-164',
    email: 'info@bestas-trade.com',
    address: '台北市文山區木柵路二段',
    hours: '週一至週五 9:00-18:00'
  },
  social: {
    facebook: 'https://facebook.com/bestas-trade',
    instagram: 'https://instagram.com/bestas-trade',
    line: 'https://line.me/ti/p/@bestas-trade',
    youtube: ''
  },
  seo: {
    metaTitle: '貝達國際貿易有限公司 - 專業國際貿易服務',
    metaDescription: '貝達國際貿易有限公司提供專業的採購代理、進出口服務，為您連接全球商機',
    ogImage: '/images/og-image.png'
  },
  system: {
    maintenance: false,
    maintenanceMessage: '系統維護中，請稍後再試',
    allowRegistration: true,
    defaultLanguage: 'zh-TW'
  }
};

router.get('/', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: defaultSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings'
    });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const updatedSettings = req.body;
    
    res.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings'
    });
  }
});

router.get('/public', async (req, res) => {
  try {
    const publicSettings = {
      site: defaultSettings.site,
      contact: defaultSettings.contact,
      social: defaultSettings.social,
      seo: defaultSettings.seo
    };

    res.json({
      success: true,
      data: publicSettings
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public settings'
    });
  }
});

module.exports = router;
