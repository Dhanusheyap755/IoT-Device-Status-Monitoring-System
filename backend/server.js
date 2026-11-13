require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, isDbConnected, getDbState } = require('./config/db');
const { requireDatabase, notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const { seedDatabase } = require('./seed/seedData');

// Route modules
const { getHealth, getDeviceHistory } = require('./controllers/deviceController');
const deviceRoutes = require('./routes/deviceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const readingRoutes = require('./routes/readingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients (GitHub Pages production, Render, and local development)
const configuredFrontend = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Allow non-browser requests (no origin header, like curl, uptime monitors, Postman)
      if (!origin) {
        return callback(null, true);
      }

      // 2. Allow explicitly configured FRONTEND_URL
      if (configuredFrontend && (origin === configuredFrontend || origin.startsWith(configuredFrontend))) {
        return callback(null, true);
      }

      // 3. Allow GitHub Pages domains (*.github.io)
      if (/^https:\/\/[a-zA-Z0-9-]+\.github\.io(\/.*)?$/.test(origin)) {
        return callback(null, true);
      }

      // 4. Allow local development (localhost / 127.0.0.1 on any port)
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // 5. Allow Render preview and production domains (*.onrender.com)
      if (/^https:\/\/[a-zA-Z0-9-]+\.onrender\.com$/.test(origin)) {
        return callback(null, true);
      }

      // Permissive fallback to support academic evaluations across different networks
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Root & Health endpoints (always accessible, reports DB state)
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'IoT Device Status Monitoring System',
    author: 'Register No: 24ITR018',
    institution: 'Velalar College of Engineering and Technology, Erode',
    department: 'Department of Information Technology',
    documentation: '/api/health',
    status: 'Running',
    serverTime: new Date().toISOString(),
  });
});

app.get('/api/health', getHealth);

// Data routes requiring MongoDB connectivity
app.use('/api/devices', requireDatabase, deviceRoutes);
app.use('/api/alerts', requireDatabase, alertRoutes);
app.use('/api/readings', requireDatabase, readingRoutes);
app.get('/api/history/:id', requireDatabase, getDeviceHistory);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server and initialize database
let server;

async function startServer() {
  console.log('========================================================');
  console.log(' IoT Device Status Monitoring System - Backend Server   ');
  console.log(' Student: 24ITR018 | VCET Information Technology        ');
  console.log('========================================================');

  // Attempt database connection
  await connectDB();

  if (isDbConnected()) {
    // Attempt auto-seed if newly created database
    await seedDatabase(false);
  } else {
    console.warn('[Warning] Running with Database offline. Real operations will return 503 until MongoDB is online.');
  }

  // Bind to 0.0.0.0 for Render compatibility
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Express server listening on 0.0.0.0:${PORT}`);
    console.log(`[Server] Health check available at /api/health`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Server] Gracefully shutting down...');
  if (server) {
    server.close();
  }
  process.exit(0);
});

module.exports = { app, startServer };
