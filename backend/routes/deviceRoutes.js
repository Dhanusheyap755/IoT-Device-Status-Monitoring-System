const express = require('express');
const router = express.Router();

const {
  getAllDevices,
  getDeviceById,
  registerDevice,
  postSensorMessage,
  simulateFailure,
  simulateTimeout,
  reconnectDevice,
  getDeviceHistory,
  getSystemStats,
} = require('../controllers/deviceController');

const { validateSensorMessage } = require('../middleware/validateMessage');

// Specific resource routes first
router.get('/stats', getSystemStats);
router.post('/register', registerDevice);
router.post('/message', validateSensorMessage, postSensorMessage);
router.post('/failure', simulateFailure);
router.post('/timeout', simulateTimeout);
router.post('/:id/reconnect', reconnectDevice);

// Generic / collection routes
router.get('/', getAllDevices);
router.get('/:id', getDeviceById);

module.exports = router;
