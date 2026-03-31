import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: '關於我們',
      links: [
        { name: '公司簡介', path: '/about' },
        { name: '使命願景', path: '/about#mission' },
        { name: '核心價值', path: '/about#values' },
        { name: '市場覆蓋', path: '/about#markets' }
      ]
    },
    {
      title: '服務項目',
      links: [
        { name: '採購代理', path: '/products#procurement' },
        { name: '進出口服務', path: '/products#import-export' },
        { name: '供應商媒合', path: '/products#matching' },
        { name: '合作流程', path: '/process' }
      ]
    },
    {
      title: '資源中心',
      links: [
        { name: '最新消息', path: '/news' },
        { name: '常見問題', path: '/faq' },
        { name: '案例分享', path: '/news#cases' },
        { name: '聯絡我們', path: '/contact' }
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/bestas-trade',
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/bestas-trade',
      color: 'hover:bg-pink-600'
    },
    {
      name: 'LINE',
      icon: MessageCircle,
      url: 'https://line.me/ti/p/@bestas-trade',
      color: 'hover:bg-green-600'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:info@bestas-trade.com',
      color: 'hover:bg-red-600'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">貝</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">{t('common.companyName')}</h3>
                <p className="text-sm text-gray-400">International Trade Co., Ltd.</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              專業的國際貿易服務提供商，致力於為客戶提供全方位的採購代理、進出口服務解決方案。
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-primary-400">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{t('common.phone')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@bestas-trade.com</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{t('common.address')}</span>
            </div>

            <div className="flex justify-center md:justify-end">
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm">{t('common.backToTop')}</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 {t('common.companyName')}. All rights reserved.</p>
            <p className="mt-2">
              Designed with ❤️ for international trade excellence
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
