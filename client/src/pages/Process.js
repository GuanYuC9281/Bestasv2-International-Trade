import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Process = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-center mb-8">合作流程</h1>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">需求分析</h3>
              <p className="text-gray-600">深入了解您的需求與目標</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">方案設計</h3>
              <p className="text-gray-600">制定客製化的貿易解決方案</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">執行實施</h3>
              <p className="text-gray-600">專業團隊執行貿易操作</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">後續服務</h3>
              <p className="text-gray-600">持續的支援與優化服務</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Process;
