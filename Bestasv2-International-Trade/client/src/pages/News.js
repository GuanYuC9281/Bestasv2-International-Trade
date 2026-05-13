import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const News = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-center mb-8">最新消息</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-2">2024-03-15</div>
            <h3 className="text-xl font-semibold mb-3">拓展東南亞市場</h3>
            <p className="text-gray-600 mb-4">我們成功開拓了越南市場，與當地優質供應商建立合作關係...</p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">閱讀更多 →</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-2">2024-02-28</div>
            <h3 className="text-xl font-semibold mb-3">新品供應商合作</h3>
            <p className="text-gray-600 mb-4">與日本知名電子元件供應商簽訂獨家代理協議...</p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">閱讀更多 →</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-2">2024-02-10</div>
            <h3 className="text-xl font-semibold mb-3">年終報告發布</h3>
            <p className="text-gray-600 mb-4">2023年營運成果豐碩，業績成長30%...</p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">閱讀更多 →</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default News;
