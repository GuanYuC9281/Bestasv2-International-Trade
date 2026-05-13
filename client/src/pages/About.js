import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Target, 
  Eye, 
  Heart, 
  Globe,
  Users,
  Award,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { number: '10+', label: '年行業經驗' },
    { number: '500+', label: '合作夥伴' },
    { number: '50+', label: '服務國家' },
    { number: '1000+', label: '成功案例' }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: '專業',
      description: '擁有深厚的行業知識和專業技能，為客戶提供最優質的服務'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: '誠信',
      description: '以誠信為本，建立長期穩定的合作關係'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '創新',
      description: '不斷創新和改進，適應市場變化，滿足客戶需求'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '服務',
      description: '以客戶為中心，提供貼心周到的全方位服務'
    }
  ];

  const markets = [
    { region: '亞洲', countries: ['台灣', '中國', '日本', '韓國', '東南亞'] },
    { region: '歐洲', countries: ['德國', '法國', '英國', '義大利', '荷蘭'] },
    { region: '美洲', countries: ['美國', '加拿大', '墨西哥', '巴西', '阿根廷'] },
    { region: '其他', countries: ['澳洲', '紐西蘭', '中東', '非洲'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-20 bg-gradient-to-br from-primary-600 to-secondary-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
              {t('about.intro')}
            </p>
          </motion.div>
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
              公司概況
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              數字說明我們的實力與成就
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
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
              願景與使命
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我們的理念和目標
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center mb-6">
                <Eye className="w-10 h-10 text-primary-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('about.vision')}
                </h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('about.visionDesc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center mb-6">
                <Target className="w-10 h-10 text-primary-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('about.mission')}
                </h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('about.missionDesc')}
              </p>
            </motion.div>
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
              {t('about.values')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.valuesDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
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
              {t('about.markets')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.marketsDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {markets.map((market, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <Globe className="w-8 h-8 text-primary-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {market.region}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {market.countries.map((country, countryIndex) => (
                    <span
                      key={countryIndex}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
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
            <Award className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              為什麼選擇貝達國際貿易？
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-white">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">專業團隊</h3>
                <p className="opacity-90">經驗豐富的專業團隊，深谙國際貿易規則</p>
              </div>
              <div className="text-white">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">全球網絡</h3>
                <p className="opacity-90">遍布全球的合作夥伴網絡，提供多元化選擇</p>
              </div>
              <div className="text-white">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">品質保證</h3>
                <p className="opacity-90">嚴格的品質管控，確保產品和服務品質</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
