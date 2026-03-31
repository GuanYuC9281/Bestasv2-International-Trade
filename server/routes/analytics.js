const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/performance', auth, async (req, res) => {
  try {
    const performanceData = {
      pageLoadTime: Math.random() * 1000 + 200,
      dbOperationTime: Math.random() * 100 + 20,
      syncOperationTime: Math.random() * 200 + 50,
      memoryUsage: Math.random() * 512 + 128,
      totalDbOperations: Math.floor(Math.random() * 10000 + 1000),
      userActivityFrequency: Math.floor(Math.random() * 100 + 20),
      dbOperationTime: Math.random() * 100 + 20,
      memoryUsage: Math.random() * 512 + 128,
      syncOperationTime: Math.random() * 200 + 50
    };

    res.json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching performance data'
    });
  }
});

router.get('/user-stats', auth, async (req, res) => {
  try {
    const stats = {
      totalUsers: Math.floor(Math.random() * 1000 + 100),
      activeUsers: Math.floor(Math.random() * 500 + 50),
      newUsers: Math.floor(Math.random() * 50 + 5),
      userRetention: Math.random() * 100
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user stats'
    });
  }
});

router.get('/industry-stats', auth, async (req, res) => {
  try {
    const industryData = [
      { category: '工業五金', count: Math.floor(Math.random() * 200 + 50) },
      { category: '機械零件', count: Math.floor(Math.random() * 300 + 100) },
      { category: '建材工程', count: Math.floor(Math.random() * 150 + 30) },
      { category: '客製採購', count: Math.floor(Math.random() * 100 + 20) }
    ];

    res.json({
      success: true,
      data: industryData
    });
  } catch (error) {
    console.error('Error fetching industry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching industry stats'
    });
  }
});

router.get('/system-health', auth, async (req, res) => {
  try {
    const healthData = {
      serverStatus: 'healthy',
      databaseStatus: 'connected',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: Math.random() * 100,
      diskUsage: Math.random() * 100,
      lastRestart: new Date(Date.now() - process.uptime() * 1000)
    };

    res.json({
      success: true,
      data: healthData
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system health'
    });
  }
});

module.exports = router;
