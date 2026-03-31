import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: { zh: '', en: '', ja: '', vi: '' },
    content: { zh: '', en: '', ja: '', vi: '' },
    category: 'company',
    excerpt: { zh: '', en: '', ja: '', vi: '' },
    image: '',
    author: '貝達國際貿易有限公司',
    tags: [],
    isPublished: false,
    isFeatured: false
  });

  const categories = [
    { value: 'company', label: '公司消息' },
    { value: 'industry', label: '產業資訊' },
    { value: 'trends', label: '市場趨勢' },
    { value: 'cases', label: '案例分享' }
  ];

  useEffect(() => {
    fetchNews();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/news/admin/all?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setNews(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('獲取新聞失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingNews ? `/api/news/${editingNews._id}` : '/api/news';
      const method = editingNews ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingNews ? '新聞更新成功' : '新聞創建成功');
        setShowCreateModal(false);
        setEditingNews(null);
        resetForm();
        fetchNews();
      } else {
        toast.error(data.message || '操作失敗');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('保存失敗');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('確定要刪除這篇新聞嗎？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('新聞刪除成功');
        fetchNews();
      } else {
        toast.error(data.message || '刪除失敗');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('刪除失敗');
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      category: newsItem.category,
      excerpt: newsItem.excerpt || { zh: '', en: '', ja: '', vi: '' },
      image: newsItem.image || '',
      author: newsItem.author,
      tags: newsItem.tags || [],
      isPublished: newsItem.isPublished,
      isFeatured: newsItem.isFeatured
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: { zh: '', en: '', ja: '', vi: '' },
      content: { zh: '', en: '', ja: '', vi: '' },
      category: 'company',
      excerpt: { zh: '', en: '', ja: '', vi: '' },
      image: '',
      author: '貝達國際貿易有限公司',
      tags: [],
      isPublished: false,
      isFeatured: false
    });
  };

  const getStatusIcon = (status) => {
    if (status) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  if (loading && news.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                最新消息管理
              </h1>
              <p className="text-gray-600">
                管理網站新聞和公告內容
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingNews(null);
                setShowCreateModal(true);
              }}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              新增消息
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜尋新聞標題或內容..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">全部狀態</option>
                <option value="published">已發布</option>
                <option value="draft">草稿</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    標題
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分類
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    精選
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    創建時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title.zh}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {item.excerpt?.zh}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(item.isPublished)}
                        <span className="ml-2 text-sm text-gray-900">
                          {item.isPublished ? '已發布' : '草稿'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isFeatured && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          精選
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString('zh-TW')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {news.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              暫無新聞數據
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  上一頁
                </button>
                <span className="px-3 py-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  下一頁
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingNews ? '編輯新聞' : '新增新聞'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      中文標題 *
                    </label>
                    <input
                      type="text"
                      value={formData.title.zh}
                      onChange={(e) => setFormData({
                        ...formData,
                        title: { ...formData.title, zh: e.target.value }
                      })}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      英文標題 *
                    </label>
                    <input
                      type="text"
                      value={formData.title.en}
                      onChange={(e) => setFormData({
                        ...formData,
                        title: { ...formData.title, en: e.target.value }
                      })}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分類
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({
                      ...formData,
                      category: e.target.value
                    })}
                    className="input-field"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    中文內容 *
                  </label>
                  <textarea
                    value={formData.content.zh}
                    onChange={(e) => setFormData({
                      ...formData,
                      content: { ...formData.content, zh: e.target.value }
                    })}
                    required
                    rows={6}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    英文內容 *
                  </label>
                  <textarea
                    value={formData.content.en}
                    onChange={(e) => setFormData({
                      ...formData,
                      content: { ...formData.content, en: e.target.value }
                    })}
                    required
                    rows={6}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    圖片網址
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({
                      ...formData,
                      image: e.target.value
                    })}
                    className="input-field"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({
                        ...formData,
                        isPublished: e.target.checked
                      })}
                      className="mr-2"
                    />
                    立即發布
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({
                        ...formData,
                        isFeatured: e.target.checked
                      })}
                      className="mr-2"
                    />
                    設為精選
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingNews(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingNews ? '更新' : '創建'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
