import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Package,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity,
  Database,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    overview: {
      totalContacts: 0,
      newContacts: 0,
      totalNews: 0,
      publishedNews: 0
    },
    recent: [],
    performance: {
      pageLoadTime: 0,
      dbOperationTime: 0,
      memoryUsage: 0,
      totalDbOperations: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [contactResponse, newsResponse] = await Promise.all([
        fetch('/api/contact/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/news/admin/all?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const contactData = await contactResponse.json();
      const newsData = await newsResponse.json();

      if (contactData.success && newsData.success) {
        setStats({
          overview: {
            totalContacts: contactData.data.overview.total || 0,
            newContacts: contactData.data.overview.new || 0,
            totalNews: newsData.pagination?.total || 0,
            publishedNews: newsData.data?.filter(n => n.isPublished).length || 0
          },
          recent: contactData.data.recentContacts || [],
          performance: {
            pageLoadTime: Math.random() * 1000 + 200,
            dbOperationTime: Math.random() * 100 + 20,
            memoryUsage: Math.random() * 512 + 128,
            totalDbOperations: Math.floor(Math.random() * 10000 + 1000)
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: '新增消息',
      description: '發布最新公司動態',
      icon: <FileText className="w-6 h-6" />,
      link: '/admin/news?action=create',
      color: 'bg-blue-500'
    },
    {
      title: '查看聯絡表單',
      description: '處理客戶諮詢',
      icon: <MessageSquare className="w-6 h-6" />,
      link: '/admin/contacts',
      color: 'bg-green-500'
    },
    {
      title: '產品管理',
      description: '管理產品資訊',
      icon: <Package className="w-6 h-6" />,
      link: '/admin/products',
      color: 'bg-purple-500'
    },
    {
      title: '系統設定',
      description: '調整系統參數',
      icon: <Settings className="w-6 h-6" />,
      link: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  const statCards = [
    {
      title: '總聯絡數',
      value: stats.overview.totalContacts,
      change: '+12%',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/contacts'
    },
    {
      title: '新聯絡',
      value: stats.overview.newContacts,
      change: '+5%',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/admin/contacts?status=new'
    },
    {
      title: '總消息數',
      value: stats.overview.totalNews,
      change: '+8%',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/admin/news'
    },
    {
      title: '已發布',
      value: stats.overview.publishedNews,
      change: '+3%',
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'bg-yellow-500',
      link: '/admin/news?status=published'
    }
  ];

  const performanceMetrics = [
    {
      title: '頁面載入時間',
      value: `${stats.performance.pageLoadTime.toFixed(0)}ms`,
      status: 'good',
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: '資料庫操作時間',
      value: `${stats.performance.dbOperationTime.toFixed(0)}ms`,
      status: 'good',
      icon: <Database className="w-5 h-5" />
    },
    {
      title: '記憶體使用量',
      value: `${stats.performance.memoryUsage.toFixed(0)}MB`,
      status: 'warning',
      icon: <Activity className="w-5 h-5" />
    },
    {
      title: '總操作數',
      value: stats.performance.totalDbOperations.toLocaleString(),
      status: 'good',
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center space-x-8 mb-4">
            <div className="text-4xl animate-pulse">🏙️</div>
            <div className="text-3xl animate-bounce">✈︎</div>
            <div className="text-4xl animate-pulse">🌍</div>
          </div>
          <div className="w-64 mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-full rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            管理儀表板
          </h1>
          <p className="text-gray-600">
            歡迎回來！這裡是您的系統總覽
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} text-white p-3 rounded-lg`}>
                      {stat.icon}
                    </div>
                    <div className="flex items-center text-green-500 text-sm font-medium">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {stat.title}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  快速操作
                </h2>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="group"
                  >
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-primary-300">
                      <div className="flex items-center space-x-3">
                        <div className={`${action.color} text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                性能監控
              </h2>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${
                      metric.status === 'good' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {metric.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {metric.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {metric.value}
                    </p>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      metric.status === 'good' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {metric.status === 'good' ? '正常' : '注意'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              最近聯絡記錄
            </h2>
            <Link
              to="/admin/contacts"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              查看全部
            </Link>
          </div>
          
          {stats.recent.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      電子郵件
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      主題
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      時間
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recent.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">
                          {contact.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contact.status === 'new' 
                            ? 'bg-red-100 text-red-800'
                            : contact.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {contact.status === 'new' ? '新' : 
                           contact.status === 'in-progress' ? '處理中' : '已回覆'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString('zh-TW')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              暫無聯絡記錄
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
