const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { language = 'zh-TW' } = req.query;

    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    const localizedServices = services.map(item => item.getLocalizedContent(language));

    res.json({
      success: true,
      data: localizedServices
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services'
    });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const { limit = 3, language = 'zh-TW' } = req.query;
    
    const featuredServices = await Service.find({ isActive: true, isFeatured: true })
      .sort({ order: 1 })
      .limit(parseInt(limit));

    const localizedServices = featuredServices.map(item => item.getLocalizedContent(language));
    
    res.json({
      success: true,
      data: localizedServices
    });
  } catch (error) {
    console.error('Error fetching featured services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured services'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'zh-TW' } = req.query;

    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Service not active'
      });
    }

    res.json({
      success: true,
      data: service.getLocalizedContent(language)
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service'
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const serviceData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      icon: req.body.icon,
      image: req.body.image,
      features: req.body.features || [],
      order: req.body.order || 0,
      isFeatured: req.body.isFeatured || false,
      isActive: req.body.isActive !== false
    };

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        service[key] = req.body[key];
      }
    });

    await service.save();

    res.json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service'
    });
  }
});

router.get('/admin/all', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const skip = (page - 1) * limit;
    let query = {};

    if (category) query.category = category;
    
    if (search) {
      query.$or = [
        { 'title.zh': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'description.zh': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: services,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all services'
    });
  }
});

router.get('/admin/stats', auth, async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const featuredServices = await Service.countDocuments({ isFeatured: true });
    
    const categoryStats = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          total: totalServices,
          active: activeServices,
          featured: featuredServices,
          inactive: totalServices - activeServices
        },
        categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching service stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service stats'
    });
  }
});

module.exports = router;
