import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-center mb-8">產品與服務</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">國際採購</h3>
          <p className="text-gray-600">專業的全球採購服務，為您尋找最優質的供應商</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">進出口貿易</h3>
          <p className="text-gray-600">完整的進出口解決方案，涵蓋物流與海關作業</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">供應鏈管理</h3>
          <p className="text-gray-600">優化您的供應鏈，提升營運效率</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Products;
