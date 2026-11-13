const Alert = require('../models/Alert');

/**
 * Get all alerts with optional query filters
 * GET /api/alerts
 */
const getAllAlerts = async (req, res, next) => {
  try {
    const { deviceId, severity, alertType, limit = 50 } = req.query;
    const filter = {};

    if (deviceId) {
      filter.deviceId = deviceId.trim().toUpperCase();
    }
    if (severity) {
      filter.severity = severity;
    }
    if (alertType) {
      filter.alertType = alertType;
    }

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limit, 10) || 50, 200));

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a specific alert by ID
 * DELETE /api/alerts/:id
 */
const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert Not Found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllAlerts,
  deleteAlert,
};
