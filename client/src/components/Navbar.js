import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Instagram,
  MessageCircle
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      name: t('nav.home'),
      path: '/',
      dropdown: null
    },
    {
      name: t('nav.about'),
      path: '/about',
      dropdown: null
    },
    {
      name: t('nav.products'),
      path: '/products',
      dropdown: [
        { name: '採購代理', path: '/products#procurement' },
        { name: '進出口服務', path: '/products#import-export' },
        { name: '供應商媒合', path: '/products#matching' },
        { name: '報價與樣品', path: '/products#quotation' },
        { name: '訂單協調', path: '/products#order' },
        { name: '產業分類', path: '/products#categories' }
      ]
    },
    {
      name: t('nav.process'),
      path: '/process',
      dropdown: null
    },
    {
      name: t('nav.news'),
      path: '/news',
      dropdown: [
        { name: '公司消息', path: '/news#company' },
        { name: '產業資訊', path: '/news#industry' },
        { name: '市場趨勢', path: '/news#trends' },
        { name: '案例分享', path: '/news#cases' }
      ]
    },
    {
      name: t('nav.faq'),
      path: '/faq',
      dropdown: null
    },
    {
      name: t('nav.contact'),
      path: '/contact',
      dropdown: null
    }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg backdrop-blur-sm bg-opacity-95' 
            : 'bg-white bg-opacity-90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">貝</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('common.companyName')}</h1>
                <p className="text-xs text-gray-500 hidden sm:block">International Trade</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  <AnimatePresence>
                    {activeDropdown === item.name && item.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100"
                      >
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <a
                href={`tel:${t('common.phone')}`}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{t('common.phone')}</span>
              </a>
              <Link
                to="/admin"
                className="btn-primary text-sm"
              >
                {t('nav.admin')}
              </Link>
            </div>

            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.path)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <a
                    href={`tel:${t('common.phone')}`}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('common.phone')}</span>
                  </a>
                  <Link
                    to="/admin"
                    className="block w-full btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.admin')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
