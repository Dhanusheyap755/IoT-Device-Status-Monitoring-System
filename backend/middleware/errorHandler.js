const { isDbConnected, getDbState } = require('../config/db');

/**
 * Middleware to check database readiness before handling stateful operations
 */
const requireDatabase = (req, res, next) => {
  if (!isDbConnected()) {
    const dbState = getDbState();
    return res.status(503).json({
      success: false,
      error: 'Database Connection Required',
      message:
        'MongoDB is not connected. All read and write operations require an active MongoDB connection. Please start MongoDB locally (mongod) or provide a valid MONGODB_URI in backend/.env',
      database: dbState,
    });
  }
  next();
};

/**
 * 404 Route Handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint Not Found',
    path: req.originalUrl,
    method: req.method,
  });
};

/**
 * Global Error Handler
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error('[Global Error Handler]:', err);

  // Mongoose duplicate key error (e.g. unique deviceId)
  if (err.code === 11000) {
    const duplicateKey = Object.keys(err.keyValue || {})[0] || 'field';
    const duplicateVal = err.keyValue ? err.keyValue[duplicateKey] : '';
    return res.status(409).json({
      success: false,
      error: 'Duplicate Record',
      message: `A device with ${duplicateKey} "${duplicateVal}" already exists in the system.`,
      field: duplicateKey,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Schema Validation Error',
      details: errors,
    });
  }

  // CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Malformed Identifier',
      message: `Invalid value '${err.value}' for field '${err.path}'.`,
    });
  }

  // General server error
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected server error occurred.',
  });
};

module.exports = {
  requireDatabase,
  notFoundHandler,
  globalErrorHandler,
};
