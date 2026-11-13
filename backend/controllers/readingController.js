const SensorReading = require('../models/SensorReading');

/**
 * Get sensor history for a specific device
 * GET /api/readings/:id
 */
const getReadingsByDeviceId = async (req, res, next) => {
  try {
    const paramId = req.params.id.trim().toUpperCase();
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

    const readings = await SensorReading.find({ deviceId: paramId })
      .sort({ receivedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      deviceId: paramId,
      count: readings.length,
      data: readings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get recent sensor readings across all devices
 * GET /api/readings
 */
const getAllRecentReadings = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const readings = await SensorReading.find()
      .sort({ receivedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getReadingsByDeviceId,
  getAllRecentReadings,
};
