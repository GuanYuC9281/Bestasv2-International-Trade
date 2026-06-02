import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  TrendingUp,
  Globe,
  Users,
  Clock,
  Shield,
  Star
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        const response = await fetch('/api/news/featured?limit=3');
        const data = await response.json();
        if (data.success) {
          setFeaturedNews(data.data);
        }
      } catch (error) {
        console.error('Error fetching featured news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('home.services.procurement'),
      description: t('home.services.procurementDesc'),
      link: '/products#procurement'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('home.services.importExport'),
      description: t('home.services.importExportDesc'),
      link: '/products#import-export'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('home.services.matching'),
      description: t('home.services.matchingDesc'),
      link: '/products#matching'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: t('home.services.quotation'),
      description: t('home.services.quotationDesc'),
      link: '/products#quotation'
    }
  ];

  const advantages = [
    {
      icon: <Star className="w-6 h-6" />,
      title: t('home.advantages.experience.title'),
      description: t('home.advantages.experience.desc')
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t('home.advantages.network.title'),
      description: t('home.advantages.network.desc')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('home.advantages.quality.title'),
      description: t('home.advantages.quality.desc')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('home.advantages.service.title'),
      description: t('home.advantages.service.desc')
    }
  ];

  const categories = [
    { name: t('home.categories.hardware'), icon: '🔧', count: 150 },
    { name: t('home.categories.machinery'), icon: '⚙️', count: 200 },
    { name: t('home.categories.construction'), icon: '🏗️', count: 120 },
    { name: t('home.categories.custom'), icon: '🎯', count: 80 }
  ];

  const processSteps = t('home.process.steps', { returnObjects: true });

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              {t('home.hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/about" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold">
              {t('common.learnMore')}
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.services.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              專業的國際貿易服務，為您的業務提供全方位支援
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <Link 
                  to={service.link}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('common.learnMore')}
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.advantages.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              為什麼選擇貝達國際貿易作為您的合作夥伴
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">
                  {advantage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.categories.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              涵蓋多種產業類別，滿足不同採購需求
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    {category.count}+
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary">
              查看所有產品類別
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.process.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              清晰的合作流程，確保項目順利進行
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-6 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step}
                </h3>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-primary-300 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/process" className="btn-primary">
              了解詳細流程
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              最新消息
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              了解我們的最新動態和行業資訊
            </p>
          </motion.div>

          {!loading && featuredNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredNews.map((news, index) => (
                <motion.div
                  key={news._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card hover:shadow-xl transition-all duration-300"
                >
                  {news.image && (
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="mb-2">
                    <span className="text-sm text-primary-600 font-medium">
                      {news.category}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(news.publishedAt).toLocaleDateString('zh-TW')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <Link 
                    to={`/news/${news._id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('common.readMore')}
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center space-x-8">
                <div className="text-4xl animate-pulse">🏙️</div>
                <div className="text-3xl animate-bounce">✈︎</div>
                <div className="text-4xl animate-pulse">🌍</div>
              </div>
              <div className="mt-4 w-64 mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-full rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          )}

          {!loading && featuredNews.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暫無最新消息
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/news" className="btn-primary">
              查看所有消息
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              準備開始合作了嗎？
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              聯繫我們的專業團隊，為您的業務提供最佳的國際貿易解決方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-white bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                <Phone className="inline-block mr-2 w-5 h-5" />
                {t('common.contactUs')}
              </Link>
              <a
                href={`tel:${t('common.phone')}`}
                className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
              >
                <Phone className="inline-block mr-2 w-5 h-5" />
                {t('common.phone')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
