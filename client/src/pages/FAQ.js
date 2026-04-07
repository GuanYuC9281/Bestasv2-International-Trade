import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: '貝達國際貿易的主要服務範圍是什麼？',
      answer: '我們提供國際採購、進出口貿易、供應鏈管理等全方位的國際貿易服務。'
    },
    {
      question: '如何開始與貝達國際貿易合作？',
      answer: '您可以通過聯絡表單與我們聯繫，我們的專業團隊會在24小時內回覆您。'
    },
    {
      question: '貝達國際貿易的服務地區包括哪些？',
      answer: '我們的服務網絡遍及全球，主要市場包括亞洲、歐洲、北美等地區。'
    },
    {
      question: '如何確保產品品質？',
      answer: '我們有嚴格的供應商篩選機制和品質檢驗流程，確保每批產品都符合標準。'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-center mb-8">常見問題</h1>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <span className="text-gray-500">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FAQ;
