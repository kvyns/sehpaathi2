const express = require('express');
const router = express.Router();
const os = require('os');

// Get system memory usage in GB
const getMemoryUsage = () => {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return {
    total: (total / (1024 * 1024 * 1024)).toFixed(2),
    free: (free / (1024 * 1024 * 1024)).toFixed(2),
    used: (used / (1024 * 1024 * 1024)).toFixed(2),
    usagePercentage: ((used / total) * 100).toFixed(2)
  };
};

// Get CPU information
const getCpuInfo = () => {
  const cpus = os.cpus();
  const avgLoad = os.loadavg();
  
  return {
    cores: cpus.length,
    model: cpus[0].model,
    speed: cpus[0].speed,
    loadAverages: {
      '1min': avgLoad[0].toFixed(2),
      '5min': avgLoad[1].toFixed(2),
      '15min': avgLoad[2].toFixed(2)
    }
  };
};

// Get service status
const getServiceStatus = () => {
  // You can add actual service checks here
  return {
    files: {
      status: 'operational',
      latency: '45ms'
    },
    chat: {
      status: 'operational',
      latency: '32ms'
    },
    database: {
      status: 'operational',
      latency: '28ms'
    }
  };
};

// Main health check route
router.get('/', async (req, res) => {
  try {
    const startTime = process.hrtime();
    
    // Collect system health information
    const healthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: getMemoryUsage(),
        cpu: getCpuInfo(),
        hostname: os.hostname(),
        osType: os.type(),
        osRelease: os.release()
      },
      services: getServiceStatus(),
      responseTime: null // Will be set before sending response
    };

    // Calculate response time
    const endTime = process.hrtime(startTime);
    healthInfo.responseTime = `${((endTime[0] * 1e9 + endTime[1]) / 1e6).toFixed(2)}ms`;

    res.json(healthInfo);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Detailed memory status
router.get('/memory', (req, res) => {
  try {
    const memoryInfo = getMemoryUsage();
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      memory: memoryInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// CPU status
router.get('/cpu', (req, res) => {
  try {
    const cpuInfo = getCpuInfo();
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      cpu: cpuInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Service status
router.get('/services', (req, res) => {
  try {
    const services = getServiceStatus();
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      services: services
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

module.exports = router;