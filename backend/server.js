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

// Enable CORS for frontend client
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local college evaluation environments
      }
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
    department: 'Information Technology',
    documentation: '/api/health',
    status: 'Running',
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

  server = app.listen(PORT, () => {
    console.log(`[Server] Express server listening on http://localhost:${PORT}`);
    console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
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
