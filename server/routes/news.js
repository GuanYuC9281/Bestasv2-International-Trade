const express = require('express');
const router = express.Router();
const News = require('../models/News');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      featured, 
      language = 'zh-TW' 
    } = req.query;

    const skip = (page - 1) * limit;
    let query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const news = await News.find(query)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const localizedNews = news.map(item => item.getLocalizedContent(language));

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      data: localizedNews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news'
    });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const { limit = 3, language = 'zh-TW' } = req.query;
    
    const featuredNews = await News.getFeaturedNews(language, parseInt(limit));
    
    res.json({
      success: true,
      data: featuredNews
    });
  } catch (error) {
    console.error('Error fetching featured news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured news'
    });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, language = 'zh-TW' } = req.query;
    
    const news = await News.getNewsByCategory(category, language, parseInt(limit));
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news by category'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'zh-TW' } = req.query;

    const news = await News.findById(id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    if (!news.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'News not published'
      });
    }

    res.json({
      success: true,
      data: news.getLocalizedContent(language)
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news'
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newsData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      excerpt: req.body.excerpt,
      image: req.body.image,
      author: req.body.author,
      tags: req.body.tags || [],
      isPublished: req.body.isPublished || false,
      isFeatured: req.body.isFeatured || false
    };

    const news = new News(newsData);
    await news.save();

    res.status(201).json({
      success: true,
      data: news,
      message: 'News created successfully'
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating news',
      error: error.message
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const news = await News.findById(id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        news[key] = req.body[key];
      }
    });

    await news.save();

    res.json({
      success: true,
      data: news,
      message: 'News updated successfully'
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating news',
      error: error.message
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const news = await News.findByIdAndDelete(id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    res.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting news'
    });
  }
});

router.get('/admin/all', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const news = await News.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await News.countDocuments();

    res.json({
      success: true,
      data: news,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching all news:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all news'
    });
  }
});

module.exports = router;
