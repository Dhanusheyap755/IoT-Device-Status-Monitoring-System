# VELALAR COLLEGE OF ENGINEERING AND TECHNOLOGY, ERODE - 638012
### (An Autonomous Institution Affiliated to Anna University, Chennai)
### DEPARTMENT OF INFORMATION TECHNOLOGY

---

# ACTIVITY 2: LABORATORY RECORD REPORT

## PROJECT TITLE: IoT Device Status Monitoring System

| Student Details | Course & Submission Details |
| :--- | :--- |
| **Student Name:** DHANUSHEYA P | **Course:** Full Stack Web Development / FLAT |
| **Register Number:** 24ITR018 | **Activity Number:** ACTIVITY 2 |
| **Degree & Branch:** B.Tech. - Information Technology | **Submission Type:** Hardcopy Lab Record Submission |
| **Academic Year:** 2026 – 2027 | **Project Number:** 18 |

---

<div style="page-break-after: always;"></div>

# TABLE OF CONTENTS

1. **PROJECT DIRECTORY HIERARCHY & FILE PATHS**
2. **COMPLETE SOURCE CODE OF APPLICATION**
   - 2.1 Backend Modules
     - `backend/server.js`
     - `backend/config/db.js`
     - `backend/fsm/deviceStateMachine.js`
     - `backend/models/Device.js`
     - `backend/models/SensorReading.js`
     - `backend/models/Alert.js`
     - `backend/models/DeviceEvent.js`
     - `backend/middleware/validateMessage.js`
     - `backend/middleware/errorHandler.js`
     - `backend/controllers/deviceController.js`
     - `backend/controllers/alertController.js`
     - `backend/controllers/readingController.js`
     - `backend/routes/deviceRoutes.js`
     - `backend/routes/alertRoutes.js`
     - `backend/routes/readingRoutes.js`
     - `backend/seed/seedData.js`
     - `backend/package.json`
     - `backend/.env.example`
   - 2.2 Frontend Modules
     - `frontend/package.json`
     - `frontend/vite.config.js`
     - `frontend/index.html`
     - `frontend/src/main.jsx`
     - `frontend/src/App.jsx`
     - `frontend/src/index.css`
     - `frontend/src/App.css`
     - `frontend/src/services/api.js`
     - `frontend/src/components/Header.jsx`
     - `frontend/src/components/Sidebar.jsx`
     - `frontend/src/components/Footer.jsx`
     - `frontend/src/components/StatusPill.jsx`
     - `frontend/src/components/AlertBadge.jsx`
     - `frontend/src/components/MetricCard.jsx`
     - `frontend/src/components/Icons.jsx`
     - `frontend/src/pages/OverviewDashboard.jsx`
     - `frontend/src/pages/DeviceManagementPage.jsx`
     - `frontend/src/pages/SensorMonitoringPage.jsx`
     - `frontend/src/pages/AlertsPage.jsx`
     - `frontend/src/pages/FsmVisualizerPage.jsx`
     - `frontend/src/pages/SimulationControlsPage.jsx`
     - `frontend/src/pages/FsmExplanationPage.jsx`
   - 2.3 Deployment CI/CD Pipeline
     - `.github/workflows/deploy.yml`
3. **OUTPUT SCREENSHOTS & EXPERIMENTAL VERIFICATION**
   - 3.1 Live React Dashboard (Overview & Sensor Monitoring)
   - 3.2 Simulation Controls & HTTP Response Inspector
   - 3.3 Automata FSM Visualizer & State Transition History
   - 3.4 MongoDB Atlas Cloud Database Collections
4. **DEPLOYMENT & REPOSITORY URLS**
5. **GITHUB REPOSITORY SCREENSHOTS**

---

<div style="page-break-after: always;"></div>

# 1. PROJECT DIRECTORY HIERARCHY & FILE PATHS

The complete modular project structure conforms to production MERN best practices:

```
IoT-Device-Status-Monitoring-System/
│
├── .github/
│   └── workflows/
│       └── deploy.yml                                # GitHub Actions CI/CD to GitHub Pages
│
├── backend/
│   ├── config/
│   │   └── db.js                                     # MongoDB Atlas Mongoose connection logic
│   ├── controllers/
│   │   ├── alertController.js                        # Alert query & dismissal handlers
│   │   ├── deviceController.js                       # Device CRUD, health check & stats
│   │   └── readingController.js                      # Telemetry logs query controller
│   ├── fsm/
│   │   └── deviceStateMachine.js                     # FLAT Deterministic Finite Automaton Engine
│   ├── middleware/
│   │   ├── errorHandler.js                           # Centralized error & 503 DB guard
│   │   └── validateMessage.js                        # Server-side telemetry schema validator
│   ├── models/
│   │   ├── Alert.js                                  # Anomaly & validation error schema
│   │   ├── Device.js                                 # IoT Device model (states: Registered, Active, Disconnected)
│   │   ├── DeviceEvent.js                            # Non-repudiable state transition ledger
│   │   └── SensorReading.js                          # Time-series telemetry readings schema
│   ├── routes/
│   │   ├── alertRoutes.js                            # Express REST routes for alerts
│   │   ├── deviceRoutes.js                           # Express REST routes for devices & simulations
│   │   └── readingRoutes.js                          # Express REST routes for sensor telemetry
│   ├── seed/
│   │   └── seedData.js                               # Database initializer (IOT001, IOT002, IOT003)
│   ├── test/
│   │   ├── api.test.js                               # API integration test suite
│   │   ├── fsm.test.js                               # 12 Automated FSM unit tests
│   │   └── validation.test.js                        # 8 Telemetry boundary unit tests
│   ├── .env.example                                  # Template for environment variables
│   ├── package.json                                  # Backend dependencies and scripts
│   └── server.js                                     # Express HTTP server & CORS configuration
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg                               # IoT application logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertBadge.jsx                        # Severity badge component (Info, Warning, Error)
│   │   │   ├── Footer.jsx                            # Institutional attribution footer (Reg: 24ITR018)
│   │   │   ├── Header.jsx                            # Header bar with live MongoDB pulse dot
│   │   │   ├── Icons.jsx                             # Pure SVG iconography library
│   │   │   ├── MetricCard.jsx                        # Executive KPI summary cards
│   │   │   ├── Sidebar.jsx                           # Left navigation drawer
│   │   │   └── StatusPill.jsx                        # Color-coded state indicator pills
│   │   ├── pages/
│   │   │   ├── AlertsPage.jsx                        # Anomaly and failure audit log
│   │   │   ├── DeviceManagementPage.jsx              # Device registration & inspection
│   │   │   ├── FsmExplanationPage.jsx                # Theoretical FLAT specification page
│   │   │   ├── FsmVisualizerPage.jsx                 # Interactive automata node visualizer
│   │   │   ├── OverviewDashboard.jsx                 # Executive summary & distribution charts
│   │   │   ├── SensorMonitoringPage.jsx              # Telemetry table with units (°C, % RH)
│   │   │   └── SimulationControlsPage.jsx            # Live HTTP simulation deck & response inspector
│   │   ├── services/
│   │   │   └── api.js                                # Frontend REST API client service
│   │   ├── App.css                                   # Global layout adjustments
│   │   ├── App.jsx                                   # Root React component & hash navigation
│   │   ├── index.css                                 # Modern scrollbar & CSS utilities
│   │   └── main.jsx                                  # React DOM mounting entry point
│   ├── index.html                                    # Single Page Application HTML5 shell
│   ├── package.json                                  # Frontend dependencies (React 19, Vite)
│   └── vite.config.js                                # Vite base path configuration
│
├── sample-inputs/
│   ├── communication-failure.json                    # Simulated packet drop payload
│   ├── invalid-humidity.json                         # Out-of-range humidity (150%)
│   ├── invalid-temperature.json                      # Out-of-range temperature (200°C)
│   ├── missing-field.json                            # Payload missing mandatory deviceId
│   ├── timeout.json                                  # Heartbeat timeout (45s) payload
│   ├── unknown-device.json                           # Unregistered device ID payload
│   └── valid-message.json                            # Authentic sensor telemetry payload
│
├── .gitignore                                        # Excludes node_modules and .env files
└── README.md                                         # Project documentation and user manual
```

---

<div style="page-break-after: always;"></div>

# 2. COMPLETE SOURCE CODE OF APPLICATION

---

## 2.1 BACKEND MODULES

### File: `backend/server.js`
```javascript
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
```

---

### File: `backend/config/db.js`
```javascript
const mongoose = require('mongoose');

// Configure Mongoose event listeners
mongoose.connection.on('connected', () => {
  console.log(`[MongoDB Event] Connection established to: ${mongoose.connection.host}/${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB Event] Runtime error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB Event] Lost connection to database.');
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iot_monitoring';
  const isAtlas = uri.includes('mongodb+srv://') || uri.includes('cluster');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
    console.log(
      `[MongoDB] Connected successfully to ${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}: ${conn.connection.host}/${conn.connection.name}`
    );
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (isAtlas) {
      console.warn(
        `[MongoDB Warning] Failed connecting to MongoDB Atlas. Please ensure IP Access 0.0.0.0/0 is enabled in Atlas Network Access and credentials in MONGODB_URI are correct.`
      );
    } else {
      console.warn(
        `[MongoDB Warning] Please ensure MongoDB is running locally on port 27017 or provide MONGODB_URI in environment variables.`
      );
    }
    return null;
  }
};

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

const getDbState = () => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    code: stateCode,
    name: states[stateCode] || 'Unknown',
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
  };
};

module.exports = {
  connectDB,
  isDbConnected,
  getDbState,
};
```

---

### File: `backend/fsm/deviceStateMachine.js`
```javascript
/**
 * Finite State Machine (FSM) Module for IoT Device Status Monitoring System
 * Course: Formal Languages and Automata Theory (FLAT)
 * Student Register Number: 24ITR018
 * College: Velalar College of Engineering and Technology
 *
 * Formal Machine Definition:
 * M = (Q, Σ, δ, q0, F)
 * Q  = { 'Registered', 'Active', 'Disconnected' }
 * Σ  = { 'ValidMessage', 'InvalidMessage', 'CommunicationFailure', 'Timeout', 'Reconnect' }
 * q0 = 'Registered'
 * F  = { 'Active' } (Operational accepting state in reactive control system)
 */

const DeviceEvent = require('../models/DeviceEvent');
const Alert = require('../models/Alert');

const STATES = {
  REGISTERED: 'Registered',
  ACTIVE: 'Active',
  DISCONNECTED: 'Disconnected',
};

const EVENTS = {
  VALID_MESSAGE: 'ValidMessage',
  INVALID_MESSAGE: 'InvalidMessage',
  COMMUNICATION_FAILURE: 'CommunicationFailure',
  TIMEOUT: 'Timeout',
  RECONNECT: 'Reconnect',
};

/**
 * State Transition Table (δ: Q × Σ → Q)
 * Maps [currentState][event] to { nextState, action, createsAlert, alertType, severity }
 */
const TRANSITION_TABLE = {
  [STATES.REGISTERED]: {
    [EVENTS.VALID_MESSAGE]: {
      nextState: STATES.ACTIVE,
      action: 'Promote device from Registered to Active and record sensor telemetry',
      createsAlert: false,
    },
    [EVENTS.INVALID_MESSAGE]: {
      nextState: STATES.REGISTERED,
      action: 'Maintain Registered state, reject payload, generate validation alert',
      createsAlert: true,
      alertType: 'INVALID_MESSAGE',
      severity: 'Warning',
    },
    [EVENTS.COMMUNICATION_FAILURE]: {
      nextState: STATES.DISCONNECTED,
      action: 'Transition from Registered to Disconnected due to communication outage',
      createsAlert: true,
      alertType: 'COMMUNICATION_FAILURE',
      severity: 'Error',
    },
    [EVENTS.TIMEOUT]: {
      nextState: STATES.DISCONNECTED,
      action: 'Transition from Registered to Disconnected due to heartbeat timeout',
      createsAlert: true,
      alertType: 'TIMEOUT',
      severity: 'Warning',
    },
    [EVENTS.RECONNECT]: {
      nextState: STATES.ACTIVE,
      action: 'Activate device directly via explicit manual reconnection',
      createsAlert: true,
      alertType: 'RECONNECTION',
      severity: 'Info',
    },
  },
  [STATES.ACTIVE]: {
    [EVENTS.VALID_MESSAGE]: {
      nextState: STATES.ACTIVE,
      action: 'Maintain Active operational state, update telemetry and refresh last-seen',
      createsAlert: false,
    },
    [EVENTS.INVALID_MESSAGE]: {
      nextState: STATES.ACTIVE,
      action: 'Maintain Active state, reject corrupted message, generate alert',
      createsAlert: true,
      alertType: 'INVALID_MESSAGE',
      severity: 'Warning',
    },
    [EVENTS.COMMUNICATION_FAILURE]: {
      nextState: STATES.DISCONNECTED,
      action: 'Transition from Active to Disconnected due to simulated/actual network failure',
      createsAlert: true,
      alertType: 'COMMUNICATION_FAILURE',
      severity: 'Error',
    },
    [EVENTS.TIMEOUT]: {
      nextState: STATES.DISCONNECTED,
      action: 'Transition from Active to Disconnected due to expired keepalive timeout',
      createsAlert: true,
      alertType: 'TIMEOUT',
      severity: 'Warning',
    },
    [EVENTS.RECONNECT]: {
      nextState: STATES.ACTIVE,
      action: 'Already Active; reaffirm active operational state',
      createsAlert: true,
      alertType: 'RECONNECTION',
      severity: 'Info',
    },
  },
  [STATES.DISCONNECTED]: {
    [EVENTS.VALID_MESSAGE]: {
      nextState: STATES.ACTIVE,
      action: 'Auto-reconnect device back to Active upon receiving authentic valid message',
      createsAlert: true,
      alertType: 'RECONNECTION',
      severity: 'Info',
    },
    [EVENTS.INVALID_MESSAGE]: {
      nextState: STATES.DISCONNECTED,
      action: 'Maintain Disconnected state, reject corrupted message, generate alert',
      createsAlert: true,
      alertType: 'INVALID_MESSAGE',
      severity: 'Warning',
    },
    [EVENTS.COMMUNICATION_FAILURE]: {
      nextState: STATES.DISCONNECTED,
      action: 'Maintain Disconnected state; record recurrent communication failure alert',
      createsAlert: true,
      alertType: 'COMMUNICATION_FAILURE',
      severity: 'Error',
    },
    [EVENTS.TIMEOUT]: {
      nextState: STATES.DISCONNECTED,
      action: 'Maintain Disconnected state; record timeout alert',
      createsAlert: true,
      alertType: 'TIMEOUT',
      severity: 'Warning',
    },
    [EVENTS.RECONNECT]: {
      nextState: STATES.ACTIVE,
      action: 'Restore device to Active state via operator reconnection trigger',
      createsAlert: true,
      alertType: 'RECONNECTION',
      severity: 'Info',
    },
  },
};

/**
 * Pure transition evaluation function: δ(currentState, event)
 */
function evaluateTransition(currentState, event) {
  if (!TRANSITION_TABLE[currentState]) {
    throw new Error(`Invalid current state in FSM: "${currentState}"`);
  }
  const transition = TRANSITION_TABLE[currentState][event];
  if (!transition) {
    throw new Error(`Invalid event "${event}" for state "${currentState}" in FSM`);
  }

  const nextState = transition.nextState;
  const stateChanged = currentState !== nextState;

  return {
    previousState: currentState,
    event,
    nextState,
    stateChanged,
    action: transition.action,
    createsAlert: transition.createsAlert,
    alertType: transition.alertType || null,
    severity: transition.severity || 'Info',
  };
}

/**
 * Execute FSM transition with MongoDB persistence
 * @param {Object} device - Mongoose Device document
 * @param {String} event - One of EVENTS
 * @param {Object} options - { reason, metadata, alertMessage, session }
 */
async function processFSMTransition(device, event, options = {}) {
  const currentState = device.state;
  const evaluation = evaluateTransition(currentState, event);

  const transitionTimestamp = new Date();

  // 1. Update Device state in MongoDB if changed or if lastSeen should update
  const previousState = device.state;
  device.state = evaluation.nextState;
  device.lastSeen = transitionTimestamp;

  if (options.temperature !== undefined && options.temperature !== null) {
    device.temperature = options.temperature;
  }
  if (options.humidity !== undefined && options.humidity !== null) {
    device.humidity = options.humidity;
  }

  if (typeof device.save === 'function') {
    await device.save();
  }

  // 2. Persist State History record (DeviceEvent)
  const eventRecord = new DeviceEvent({
    deviceId: device.deviceId,
    previousState: previousState,
    event: event,
    currentState: evaluation.nextState,
    details: {
      action: evaluation.action,
      stateChanged: evaluation.stateChanged,
      reason: options.reason || null,
      ...options.metadata,
    },
    timestamp: transitionTimestamp,
  });
  await eventRecord.save();

  // 3. Persist Alert if this transition or event dictates an alert
  let alertRecord = null;
  if (evaluation.createsAlert || options.forceAlert) {
    const alertMessage =
      options.alertMessage ||
      `Device ${device.deviceId} triggered event '${event}'. State is now [${evaluation.nextState}].`;

    alertRecord = new Alert({
      deviceId: device.deviceId,
      alertType: options.alertType || evaluation.alertType || 'SYSTEM_INFO',
      message: alertMessage,
      severity: options.severity || evaluation.severity || 'Warning',
      details: {
        previousState: previousState,
        currentState: evaluation.nextState,
        event: event,
        reason: options.reason || null,
        ...options.metadata,
      },
      createdAt: transitionTimestamp,
    });
    await alertRecord.save();
  }

  return {
    success: true,
    deviceId: device.deviceId,
    previousState: previousState,
    event: event,
    currentState: evaluation.nextState,
    stateChanged: evaluation.stateChanged,
    action: evaluation.action,
    timestamp: transitionTimestamp,
    alert: alertRecord
      ? {
          id: alertRecord._id,
          type: alertRecord.alertType,
          message: alertRecord.message,
          severity: alertRecord.severity,
        }
      : null,
  };
}

module.exports = {
  STATES,
  EVENTS,
  TRANSITION_TABLE,
  evaluateTransition,
  processFSMTransition,
};
```

---

### File: `backend/models/Device.js`
```javascript
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is mandatory'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^IOT\d{3,}$/, 'Device ID must follow the pattern IOT followed by at least 3 digits (e.g. IOT001)'],
      index: true,
    },
    deviceName: {
      type: String,
      required: [true, 'Device Name is mandatory'],
      trim: true,
      minlength: [2, 'Device Name must be at least 2 characters'],
      maxlength: [50, 'Device Name cannot exceed 50 characters'],
    },
    state: {
      type: String,
      enum: {
        values: ['Registered', 'Active', 'Disconnected'],
        message: '{VALUE} is not a valid device state in the FSM',
      },
      default: 'Registered',
      required: true,
    },
    temperature: {
      type: Number,
      default: null,
      min: [-40, 'Temperature cannot be below -40°C'],
      max: [125, 'Temperature cannot exceed 125°C'],
    },
    humidity: {
      type: Number,
      default: null,
      min: [0, 'Humidity cannot be below 0%'],
      max: [100, 'Humidity cannot exceed 100%'],
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Device', deviceSchema);
```

---

### File: `backend/models/SensorReading.js`
```javascript
const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is mandatory for sensor reading'],
      trim: true,
      uppercase: true,
      index: true,
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature reading is required'],
      min: [-40, 'Temperature cannot be below -40°C'],
      max: [125, 'Temperature cannot exceed 125°C'],
    },
    humidity: {
      type: Number,
      required: [true, 'Humidity reading is required'],
      min: [0, 'Humidity cannot be below 0%'],
      max: [100, 'Humidity cannot exceed 100%'],
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'online',
    },
    receivedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
```

---

### File: `backend/models/Alert.js`
```javascript
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is mandatory for alert record'],
      trim: true,
      uppercase: true,
      index: true,
    },
    alertType: {
      type: String,
      required: [true, 'Alert Type is mandatory'],
      enum: [
        'INVALID_MESSAGE',
        'COMMUNICATION_FAILURE',
        'TIMEOUT',
        'RECONNECTION',
        'REGISTRATION',
        'SYSTEM_INFO',
      ],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Alert description message is required'],
      trim: true,
    },
    severity: {
      type: String,
      enum: ['Info', 'Warning', 'Error', 'Critical'],
      default: 'Warning',
      index: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('Alert', alertSchema);
```

---

### File: `backend/models/DeviceEvent.js`
```javascript
const mongoose = require('mongoose');

const deviceEventSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is mandatory for event history'],
      trim: true,
      uppercase: true,
      index: true,
    },
    previousState: {
      type: String,
      required: [true, 'Previous State is required in state transition'],
      enum: ['None', 'Registered', 'Active', 'Disconnected'],
    },
    event: {
      type: String,
      required: [true, 'FSM Event is required'],
      enum: [
        'Register',
        'ValidMessage',
        'InvalidMessage',
        'CommunicationFailure',
        'Timeout',
        'Reconnect',
      ],
      index: true,
    },
    currentState: {
      type: String,
      required: [true, 'Current State is required in state transition'],
      enum: ['Registered', 'Active', 'Disconnected'],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('DeviceEvent', deviceEventSchema);
```

---

### File: `backend/middleware/validateMessage.js`
```javascript
const Device = require('../models/Device');
const Alert = require('../models/Alert');
const { processFSMTransition, EVENTS } = require('../fsm/deviceStateMachine');

/**
 * Express Middleware to strictly validate incoming IoT sensor messages
 */
const validateSensorMessage = async (req, res, next) => {
  const { deviceId, temperature, humidity, status } = req.body || {};
  const validationErrors = [];

  // 1. Validate deviceId existence & format
  if (!deviceId || typeof deviceId !== 'string' || deviceId.trim() === '') {
    validationErrors.push('Device ID is mandatory and cannot be empty.');
  } else {
    const formattedId = deviceId.trim().toUpperCase();
    const idPattern = /^IOT\d{3,}$/;
    if (!idPattern.test(formattedId)) {
      validationErrors.push(`Device ID "${deviceId}" is invalid. Must follow pattern like IOT001.`);
    }
  }

  // 2. Validate temperature
  if (temperature === undefined || temperature === null || temperature === '') {
    validationErrors.push('Temperature reading is mandatory.');
  } else {
    const tempNum = Number(temperature);
    if (isNaN(tempNum) || typeof temperature === 'boolean') {
      validationErrors.push(`Temperature must be a valid number. Received: ${temperature}`);
    } else if (tempNum < -40 || tempNum > 125) {
      validationErrors.push(`Temperature (${tempNum}°C) is out of range. Allowed range is -40°C to 125°C.`);
    }
  }

  // 3. Validate humidity
  if (humidity === undefined || humidity === null || humidity === '') {
    validationErrors.push('Humidity reading is mandatory.');
  } else {
    const humNum = Number(humidity);
    if (isNaN(humNum) || typeof humidity === 'boolean') {
      validationErrors.push(`Humidity must be a valid number. Received: ${humidity}`);
    } else if (humNum < 0 || humNum > 100) {
      validationErrors.push(`Humidity (${humNum}%) is out of range. Allowed range is 0% to 100%.`);
    }
  }

  // 4. Validate status
  if (!status || typeof status !== 'string' || status.trim() === '') {
    validationErrors.push('Status field is mandatory (must be "online" or "offline").');
  } else {
    const normalizedStatus = status.trim().toLowerCase();
    if (normalizedStatus !== 'online' && normalizedStatus !== 'offline') {
      validationErrors.push(`Invalid status "${status}". Allowed values: "online", "offline".`);
    }
  }

  // If initial schema validation failed
  if (validationErrors.length > 0) {
    const targetDeviceId = typeof deviceId === 'string' && deviceId.trim() ? deviceId.trim().toUpperCase() : 'UNKNOWN';

    let existingDevice = null;
    if (targetDeviceId !== 'UNKNOWN') {
      try {
        existingDevice = await Device.findOne({ deviceId: targetDeviceId });
      } catch (err) {
        // Handled safely
      }
    }

    if (existingDevice) {
      // Trigger FSM InvalidMessage rule: state remains unchanged, alert generated
      try {
        await processFSMTransition(existingDevice, EVENTS.INVALID_MESSAGE, {
          reason: validationErrors.join(' | '),
          alertMessage: `Validation failed for message from ${targetDeviceId}: ${validationErrors.join('; ')}`,
          severity: 'Warning',
          alertType: 'INVALID_MESSAGE',
          metadata: { rejectedPayload: req.body, errors: validationErrors },
        });
      } catch (fsmErr) {
        console.error('[FSM Error during invalid message handling]:', fsmErr.message);
      }
    } else {
      try {
        await Alert.create({
          deviceId: targetDeviceId,
          alertType: 'INVALID_MESSAGE',
          message: `Malformed message rejected: ${validationErrors.join('; ')}`,
          severity: 'Error',
          details: { rejectedPayload: req.body, errors: validationErrors },
          createdAt: new Date(),
        });
      } catch (alertErr) {
        // Handled safely
      }
    }

    return res.status(400).json({
      success: false,
      error: 'Message Validation Failed',
      deviceId: targetDeviceId,
      validationErrors: validationErrors,
      message: 'The submitted IoT sensor message violates validation constraints. State remains unchanged and an alert was logged.',
    });
  }

  // 5. Verify device is already registered in DB
  const cleanDeviceId = deviceId.trim().toUpperCase();
  try {
    const registeredDevice = await Device.findOne({ deviceId: cleanDeviceId });
    if (!registeredDevice) {
      await Alert.create({
        deviceId: cleanDeviceId,
        alertType: 'INVALID_MESSAGE',
        message: `Message rejected: Device "${cleanDeviceId}" is not registered in the system.`,
        severity: 'Error',
        details: { rejectedPayload: req.body },
        createdAt: new Date(),
      });

      return res.status(404).json({
        success: false,
        error: 'Unknown Device ID',
        message: `Device ${cleanDeviceId} is not registered. Please register the device first.`,
      });
    }

    req.targetDevice = registeredDevice;
    req.sanitizedPayload = {
      deviceId: cleanDeviceId,
      temperature: Number(temperature),
      humidity: Number(humidity),
      status: status.trim().toLowerCase(),
    };

    next();
  } catch (dbError) {
    return res.status(503).json({
      success: false,
      error: 'Database Unavailable',
      message: 'Unable to verify device registration due to database connectivity issue.',
      details: dbError.message,
    });
  }
};

module.exports = {
  validateSensorMessage,
};
```

---

### File: `backend/middleware/errorHandler.js`
```javascript
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
        'MongoDB is not connected. All read and write operations require an active MongoDB connection.',
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

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Schema Validation Error',
      details: errors,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Malformed Identifier',
      message: `Invalid value '${err.value}' for field '${err.path}'.`,
    });
  }

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
```

---

### File: `backend/controllers/deviceController.js`
```javascript
const Device = require('../models/Device');
const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');
const DeviceEvent = require('../models/DeviceEvent');
const { getDbState, isDbConnected } = require('../config/db');
const {
  STATES,
  EVENTS,
  processFSMTransition,
} = require('../fsm/deviceStateMachine');

const getHealth = async (req, res) => {
  const dbState = getDbState();
  const isHealthy = isDbConnected();

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    project: 'IoT Device Status Monitoring System',
    studentRegNo: '24ITR018',
    institution: 'Velalar College of Engineering and Technology, Erode',
    department: 'Department of Information Technology',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      connected: isHealthy,
      state: dbState.name,
      host: dbState.host,
      databaseName: dbState.dbName,
    },
    fsmSpecification: {
      formalTuple: 'M = (Q, Σ, δ, q0, F)',
      states: Object.values(STATES),
      initialState: STATES.REGISTERED,
      activeState: STATES.ACTIVE,
      events: Object.values(EVENTS),
    },
  });
};

const getAllDevices = async (req, res, next) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (err) {
    next(err);
  }
};

const getDeviceById = async (req, res, next) => {
  try {
    const paramId = req.params.id.trim().toUpperCase();
    const device = await Device.findOne({
      $or: [{ deviceId: paramId }, { _id: paramId.match(/^[0-9a-fA-F]{24}$/) ? paramId : null }],
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device Not Found',
        message: `Device with identifier "${req.params.id}" does not exist.`,
      });
    }

    const recentReadings = await SensorReading.find({ deviceId: device.deviceId })
      .sort({ receivedAt: -1 })
      .limit(10);

    const recentEvents = await DeviceEvent.find({ deviceId: device.deviceId })
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        device,
        recentReadings,
        recentEvents,
      },
    });
  } catch (err) {
    next(err);
  }
};

const registerDevice = async (req, res, next) => {
  try {
    const { deviceId, deviceName } = req.body;

    if (!deviceId || typeof deviceId !== 'string' || deviceId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Device ID is mandatory and cannot be empty.',
      });
    }

    if (!deviceName || typeof deviceName !== 'string' || deviceName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Device Name is mandatory and cannot be empty.',
      });
    }

    const formattedDeviceId = deviceId.trim().toUpperCase();
    const formattedDeviceName = deviceName.trim();

    if (!/^IOT\d{3,}$/.test(formattedDeviceId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Device ID Format',
        message: `Device ID must follow pattern 'IOT' followed by at least 3 digits (e.g. IOT001). Received: "${deviceId}"`,
      });
    }

    const existing = await Device.findOne({ deviceId: formattedDeviceId });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate Device ID',
        message: `A device with ID "${formattedDeviceId}" is already registered in the system.`,
      });
    }

    const newDevice = new Device({
      deviceId: formattedDeviceId,
      deviceName: formattedDeviceName,
      state: STATES.REGISTERED,
      lastSeen: new Date(),
    });
    await newDevice.save();

    await DeviceEvent.create({
      deviceId: formattedDeviceId,
      previousState: 'None',
      event: 'Register',
      currentState: STATES.REGISTERED,
      details: {
        deviceName: formattedDeviceName,
        action: 'Initial device provision into FSM q0 = Registered state',
      },
      timestamp: new Date(),
    });

    await Alert.create({
      deviceId: formattedDeviceId,
      alertType: 'REGISTRATION',
      message: `New IoT device ${formattedDeviceId} ("${formattedDeviceName}") successfully registered with initial FSM state [Registered].`,
      severity: 'Info',
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: `Device ${formattedDeviceId} registered successfully in state [Registered].`,
      data: newDevice,
    });
  } catch (err) {
    next(err);
  }
};

const postSensorMessage = async (req, res, next) => {
  try {
    const device = req.targetDevice;
    const { deviceId, temperature, humidity, status } = req.sanitizedPayload;

    const reading = new SensorReading({
      deviceId: deviceId,
      temperature: temperature,
      humidity: humidity,
      status: status || 'online',
      receivedAt: new Date(),
    });
    await reading.save();

    const transitionResult = await processFSMTransition(device, EVENTS.VALID_MESSAGE, {
      temperature: temperature,
      humidity: humidity,
      reason: 'Valid HTTP telemetry message received',
      metadata: {
        readingId: reading._id,
        temperature,
        humidity,
        status,
      },
    });

    res.status(200).json({
      success: true,
      message: `Sensor message processed successfully for device ${deviceId}. FSM transitioned to [${transitionResult.currentState}].`,
      data: {
        reading: reading,
        device: {
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          state: device.state,
          temperature: device.temperature,
          humidity: device.humidity,
          lastSeen: device.lastSeen,
        },
        fsmTransition: {
          previousState: transitionResult.previousState,
          event: transitionResult.event,
          currentState: transitionResult.currentState,
          stateChanged: transitionResult.stateChanged,
          action: transitionResult.action,
          timestamp: transitionResult.timestamp,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const simulateFailure = async (req, res, next) => {
  try {
    const { deviceId, reason } = req.body || {};
    if (!deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing deviceId',
        message: 'Please provide the deviceId to simulate communication failure.',
      });
    }

    const cleanId = deviceId.trim().toUpperCase();
    const device = await Device.findOne({ deviceId: cleanId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device Not Found',
        message: `Device "${cleanId}" is not registered in the system.`,
      });
    }

    const failureReason = reason || 'Simulated HTTP packet loss / network failure';

    const transitionResult = await processFSMTransition(device, EVENTS.COMMUNICATION_FAILURE, {
      reason: failureReason,
      alertMessage: `Communication failure detected on device ${cleanId}: ${failureReason}. Device state changed to [Disconnected].`,
      severity: 'Error',
      alertType: 'COMMUNICATION_FAILURE',
      forceAlert: true,
      metadata: {
        simulated: true,
        reason: failureReason,
      },
    });

    res.status(200).json({
      success: true,
      message: `Communication failure simulated for device ${cleanId}. State changed to [Disconnected].`,
      data: {
        deviceId: cleanId,
        previousState: transitionResult.previousState,
        currentState: transitionResult.currentState,
        event: EVENTS.COMMUNICATION_FAILURE,
        stateChanged: transitionResult.stateChanged,
        action: transitionResult.action,
        alert: transitionResult.alert,
        device: device,
      },
    });
  } catch (err) {
    next(err);
  }
};

const simulateTimeout = async (req, res, next) => {
  try {
    const { deviceId, durationSeconds } = req.body || {};
    if (!deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing deviceId',
        message: 'Please provide the deviceId to simulate timeout.',
      });
    }

    const cleanId = deviceId.trim().toUpperCase();
    const device = await Device.findOne({ deviceId: cleanId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device Not Found',
        message: `Device "${cleanId}" is not registered in the system.`,
      });
    }

    const timeoutDuration = durationSeconds || 30;
    const timeoutReason = `Heartbeat timeout: No ping received for > ${timeoutDuration}s`;

    const transitionResult = await processFSMTransition(device, EVENTS.TIMEOUT, {
      reason: timeoutReason,
      alertMessage: `Device ${cleanId} timed out (${timeoutDuration}s silence threshold exceeded). State changed to [Disconnected].`,
      severity: 'Warning',
      alertType: 'TIMEOUT',
      forceAlert: true,
      metadata: {
        simulated: true,
        timeoutDurationSeconds: timeoutDuration,
      },
    });

    res.status(200).json({
      success: true,
      message: `Device ${cleanId} timeout simulated. State changed to [Disconnected].`,
      data: {
        deviceId: cleanId,
        previousState: transitionResult.previousState,
        currentState: transitionResult.currentState,
        event: EVENTS.TIMEOUT,
        stateChanged: transitionResult.stateChanged,
        action: transitionResult.action,
        alert: transitionResult.alert,
        device: device,
      },
    });
  } catch (err) {
    next(err);
  }
};

const reconnectDevice = async (req, res, next) => {
  try {
    const paramId = req.params.id.trim().toUpperCase();
    const device = await Device.findOne({
      $or: [{ deviceId: paramId }, { _id: paramId.match(/^[0-9a-fA-F]{24}$/) ? paramId : null }],
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device Not Found',
        message: `Device "${req.params.id}" is not registered in the system.`,
      });
    }

    const transitionResult = await processFSMTransition(device, EVENTS.RECONNECT, {
      reason: 'Manual operator reconnect initiated from dashboard controls',
      alertMessage: `Device ${device.deviceId} reconnected successfully. FSM state restored to [Active].`,
      severity: 'Info',
      alertType: 'RECONNECTION',
      forceAlert: true,
      metadata: {
        reconnectedBy: 'Operator Dashboard Simulation',
      },
    });

    res.status(200).json({
      success: true,
      message: `Device ${device.deviceId} reconnected successfully. Current state is [Active].`,
      data: {
        deviceId: device.deviceId,
        previousState: transitionResult.previousState,
        currentState: transitionResult.currentState,
        event: EVENTS.RECONNECT,
        stateChanged: transitionResult.stateChanged,
        action: transitionResult.action,
        device: device,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getDeviceHistory = async (req, res, next) => {
  try {
    const paramId = req.params.id.trim().toUpperCase();
    const history = await DeviceEvent.find({ deviceId: paramId }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      deviceId: paramId,
      count: history.length,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

const getSystemStats = async (req, res, next) => {
  try {
    const [
      totalDevices,
      activeDevices,
      disconnectedDevices,
      registeredDevices,
      totalReadings,
      totalAlerts,
      invalidMessagesAlerts,
      failureAlerts,
      timeoutAlerts,
      recentAlerts,
      recentReadings,
    ] = await Promise.all([
      Device.countDocuments(),
      Device.countDocuments({ state: STATES.ACTIVE }),
      Device.countDocuments({ state: STATES.DISCONNECTED }),
      Device.countDocuments({ state: STATES.REGISTERED }),
      SensorReading.countDocuments(),
      Alert.countDocuments(),
      Alert.countDocuments({ alertType: 'INVALID_MESSAGE' }),
      Alert.countDocuments({ alertType: 'COMMUNICATION_FAILURE' }),
      Alert.countDocuments({ alertType: 'TIMEOUT' }),
      Alert.find().sort({ createdAt: -1 }).limit(5),
      SensorReading.find().sort({ receivedAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalDevices,
          activeDevices,
          disconnectedDevices,
          registeredDevices,
          totalReadings,
          totalAlerts,
          invalidMessagesAlerts,
          failureAlerts,
          timeoutAlerts,
        },
        distribution: {
          Active: activeDevices,
          Disconnected: disconnectedDevices,
          Registered: registeredDevices,
        },
        recentAlerts,
        recentReadings,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHealth,
  getAllDevices,
  getDeviceById,
  registerDevice,
  postSensorMessage,
  simulateFailure,
  simulateTimeout,
  reconnectDevice,
  getDeviceHistory,
  getSystemStats,
};
```

---

### File: `backend/controllers/alertController.js`
```javascript
const Alert = require('../models/Alert');

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
```

---

### File: `backend/controllers/readingController.js`
```javascript
const SensorReading = require('../models/SensorReading');

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
```

---

### File: `backend/routes/deviceRoutes.js`
```javascript
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
  getSystemStats,
} = require('../controllers/deviceController');

const { validateSensorMessage } = require('../middleware/validateMessage');

router.get('/stats', getSystemStats);
router.post('/register', registerDevice);
router.post('/message', validateSensorMessage, postSensorMessage);
router.post('/failure', simulateFailure);
router.post('/timeout', simulateTimeout);
router.post('/:id/reconnect', reconnectDevice);
router.get('/', getAllDevices);
router.get('/:id', getDeviceById);

module.exports = router;
```

---

### File: `backend/routes/alertRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { getAllAlerts, deleteAlert } = require('../controllers/alertController');

router.get('/', getAllAlerts);
router.delete('/:id', deleteAlert);

module.exports = router;
```

---

### File: `backend/routes/readingRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const {
  getReadingsByDeviceId,
  getAllRecentReadings,
} = require('../controllers/readingController');

router.get('/', getAllRecentReadings);
router.get('/:id', getReadingsByDeviceId);

module.exports = router;
```

---

### File: `backend/seed/seedData.js`
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const Device = require('../models/Device');
const Alert = require('../models/Alert');
const DeviceEvent = require('../models/DeviceEvent');
const { connectDB } = require('../config/db');

const initialDevices = [
  {
    deviceId: 'IOT001',
    deviceName: 'Temperature Sensor',
    state: 'Registered',
    temperature: null,
    humidity: null,
    lastSeen: new Date(),
  },
  {
    deviceId: 'IOT002',
    deviceName: 'Humidity Sensor',
    state: 'Registered',
    temperature: null,
    humidity: null,
    lastSeen: new Date(),
  },
  {
    deviceId: 'IOT003',
    deviceName: 'Environmental Sensor',
    state: 'Registered',
    temperature: null,
    humidity: null,
    lastSeen: new Date(),
  },
];

async function seedDatabase(standalone = false) {
  try {
    if (standalone) {
      await connectDB();
    }

    const count = await Device.countDocuments();
    if (count === 0) {
      console.log('[Seed] Seeding initial standard IoT demonstration devices...');
      for (const dev of initialDevices) {
        const createdDevice = await Device.create(dev);
        await DeviceEvent.create({
          deviceId: createdDevice.deviceId,
          previousState: 'None',
          event: 'Register',
          currentState: 'Registered',
          details: {
            action: `Default provision of ${createdDevice.deviceName}`,
            seeded: true,
          },
          timestamp: new Date(),
        });
      }

      await Alert.create({
        deviceId: 'IOT001',
        alertType: 'REGISTRATION',
        message: 'Demonstration devices (IOT001, IOT002, IOT003) initialized in Registered state.',
        severity: 'Info',
        createdAt: new Date(),
      });

      console.log('[Seed] Successfully seeded 3 baseline IoT devices into MongoDB.');
    } else {
      console.log(`[Seed] Database already contains ${count} devices. Skipping initial seed.`);
    }

    if (standalone) {
      await mongoose.disconnect();
      console.log('[Seed] Disconnected from MongoDB.');
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    if (standalone) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedDatabase(true);
}

module.exports = {
  seedDatabase,
  initialDevices,
};
```

---

### File: `backend/package.json`
```json
{
  "name": "iot-device-status-monitoring-backend",
  "version": "1.0.0",
  "description": "Backend API and FSM Engine for IoT Device Status Monitoring System - 24ITR018",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed/seedData.js",
    "test": "node --test test/*.test.js"
  },
  "keywords": [
    "iot",
    "fsm",
    "express",
    "mongodb",
    "monitoring",
    "automata"
  ],
  "author": "24ITR018 - Velalar College of Engineering and Technology",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2",
    "mongoose": "^8.8.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

---

<div style="page-break-after: always;"></div>

## 2.2 FRONTEND MODULES

### File: `frontend/vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/IoT-Device-Status-Monitoring-System/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

---

### File: `frontend/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IoT Device Status Monitoring System | 24ITR018</title>
    <!-- Modern Typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
              primary: {
                50: '#eff6ff',
                100: '#dbeafe',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8',
                800: '#1e40af',
                900: '#1e3a8a',
              }
            }
          }
        }
      }
    </script>
  </head>
  <body class="bg-slate-100 text-slate-900 font-sans antialiased min-h-screen selection:bg-blue-600 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### File: `frontend/src/main.jsx`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### File: `frontend/src/services/api.js`
```javascript
/**
 * Frontend REST API Service for IoT Device Status Monitoring System
 * Handles communication between React UI and Express Backend
 */

const rawApiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

// Normalize URL: Strip trailing slash and ensure /api endpoint prefix
const cleanUrl = rawApiUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

async function request(endpoint, options = {}) {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${formattedEndpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const connErr = new Error(
        `Unable to reach backend API at ${API_BASE_URL}. If deployed on Render, please allow up to 60 seconds for the free instance to spin up.`
      );
      connErr.status = 0;
      throw connErr;
    }
    throw err;
  }
}

export const api = {
  getBaseUrl: () => API_BASE_URL,
  getHealth: () => request('/health'),
  getStats: () => request('/devices/stats'),
  getDevices: () => request('/devices'),
  getDeviceById: (id) => request(`/devices/${id}`),
  registerDevice: (payload) =>
    request('/devices/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  sendMessage: (payload) =>
    request('/devices/message', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  simulateFailure: (payload) =>
    request('/devices/failure', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  simulateTimeout: (payload) =>
    request('/devices/timeout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  reconnectDevice: (deviceId) =>
    request(`/devices/${deviceId}/reconnect`, {
      method: 'POST',
    }),
  getAlerts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.deviceId) query.append('deviceId', params.deviceId);
    if (params.severity) query.append('severity', params.severity);
    if (params.alertType) query.append('alertType', params.alertType);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/alerts${queryString}`);
  },
  deleteAlert: (id) =>
    request(`/alerts/${id}`, {
      method: 'DELETE',
    }),
  getReadings: (deviceId, limit = 50) =>
    request(`/readings/${deviceId}?limit=${limit}`),
  getAllRecentReadings: (limit = 50) =>
    request(`/readings?limit=${limit}`),
  getDeviceHistory: (deviceId) =>
    request(`/history/${deviceId}`),
};
```

---

### File: `frontend/src/App.jsx`
```javascript
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import OverviewDashboard from './pages/OverviewDashboard';
import DeviceManagementPage from './pages/DeviceManagementPage';
import SensorMonitoringPage from './pages/SensorMonitoringPage';
import AlertsPage from './pages/AlertsPage';
import FsmVisualizerPage from './pages/FsmVisualizerPage';
import SimulationControlsPage from './pages/SimulationControlsPage';
import FsmExplanationPage from './pages/FsmExplanationPage';
import { api, API_BASE_URL } from './services/api';

const VALID_TABS = [
  'overview',
  'devices',
  'sensors',
  'alerts',
  'fsm-visualizer',
  'simulation',
  'fsm-explanation',
];

const getInitialTab = () => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (VALID_TABS.includes(hash)) {
      return hash;
    }
  }
  return 'overview';
};

export default function App() {
  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [readings, setReadings] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('IOT001');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serverError, setServerError] = useState(null);

  const setActiveTab = (tab) => {
    if (VALID_TABS.includes(tab)) {
      setActiveTabState(tab);
      if (typeof window !== 'undefined') {
        window.location.hash = `#${tab}`;
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const healthRes = await api.getHealth().catch((err) => {
        setServerError(err.message);
        return null;
      });

      if (healthRes) {
        setHealth(healthRes);
        setServerError(null);

        if (healthRes.database?.connected) {
          const [devicesRes, statsRes, alertsRes, readingsRes] = await Promise.all([
            api.getDevices().catch(() => ({ data: [] })),
            api.getStats().catch(() => ({ data: null })),
            api.getAlerts({ limit: 50 }).catch(() => ({ data: [] })),
            api.getAllRecentReadings(50).catch(() => ({ data: [] })),
          ]);

          const loadedDevices = devicesRes.data || [];
          setDevices(loadedDevices);
          setStats(statsRes.data || null);
          setAlerts(alertsRes.data || []);
          setReadings(readingsRes.data || []);

          if (loadedDevices.length > 0 && !loadedDevices.some((d) => d.deviceId === selectedDeviceId)) {
            setSelectedDeviceId(loadedDevices[0].deviceId);
          }
        } else {
          setDevices([]);
          setStats(null);
          setAlerts([]);
          setReadings([]);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setServerError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => {
      loadDashboardData();
    }, 6000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const handleSelectDevice = (devId) => {
    setSelectedDeviceId(devId);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.length}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          health={health}
          isRefreshing={isRefreshing}
          onRefresh={loadDashboardData}
        />

        {(!health || !health.database?.connected) && (
          <div className="bg-amber-500 text-amber-950 px-6 py-2.5 text-xs flex items-center justify-between border-b border-amber-600 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold">⚠️ Connection Notice:</span>
              <span>
                {serverError
                  ? `${serverError} (Target API: ${API_BASE_URL})`
                  : 'Backend is connected, but MongoDB is offline. Verify MONGODB_URI in Render environment variables or start local mongod.'}
              </span>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-2.5 py-1 bg-amber-900 text-amber-100 rounded text-[11px] font-semibold hover:bg-amber-950 transition-colors shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto pb-8">
            {activeTab === 'overview' && (
              <OverviewDashboard
                stats={stats}
                devices={devices}
                alerts={alerts}
                readings={readings}
                onNavigate={setActiveTab}
                onSelectDeviceForSimulation={handleSelectDevice}
              />
            )}

            {activeTab === 'devices' && (
              <DeviceManagementPage
                devices={devices}
                onRefresh={loadDashboardData}
                onSelectDeviceForSimulation={handleSelectDevice}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'sensors' && (
              <SensorMonitoringPage
                devices={devices}
                selectedDeviceFilter={selectedDeviceId}
                onRefresh={loadDashboardData}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                devices={devices}
                onRefresh={loadDashboardData}
              />
            )}

            {activeTab === 'fsm-visualizer' && (
              <FsmVisualizerPage
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={handleSelectDevice}
                onRefresh={loadDashboardData}
              />
            )}

            {activeTab === 'simulation' && (
              <SimulationControlsPage
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={handleSelectDevice}
                onRefresh={loadDashboardData}
              />
            )}

            {activeTab === 'fsm-explanation' && <FsmExplanationPage />}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
```

---

### File: `frontend/src/components/Header.jsx`
```javascript
import React from 'react';
import { RefreshCwIcon } from './Icons';

export default function Header({
  health,
  isRefreshing,
  onRefresh,
}) {
  const isConnected = health && health.database && health.database.connected;

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              IoT Device Status Monitoring System
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 rounded-md">
              Project #18
            </span>
          </div>
          <p className="text-xs text-gray-500 hidden sm:block">
            Velalar College of Engineering & Technology | Department of Information Technology | Reg: <strong className="text-blue-700">24ITR018</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
          title={
            isConnected
              ? `Connected to MongoDB (${health.database.databaseName || 'iot_monitoring'}) on ${health.database.host || 'localhost'}`
              : 'Backend online but MongoDB is disconnected or degraded'
          }
        >
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden md:inline font-semibold">MongoDB Connected</span>
              <span className="md:hidden">Connected</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="hidden md:inline font-semibold">DB Offline</span>
              <span className="md:hidden">Offline</span>
            </>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
          title="Refresh dashboard data"
        >
          <RefreshCwIcon
            size={16}
            className={isRefreshing ? 'animate-spin text-blue-600' : ''}
          />
        </button>
      </div>
    </header>
  );
}
```

---

### File: `frontend/src/components/Footer.jsx`
```javascript
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-xs text-gray-500 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">
            IoT Device Status Monitoring System
          </span>
          <span className="text-gray-300">|</span>
          <span>Register No: <strong className="text-blue-600 font-semibold">24ITR018</strong></span>
        </div>
        <div className="text-center sm:text-right text-gray-500 text-[11px]">
          Department of Information Technology • Velalar College of Engineering and Technology, Erode
        </div>
      </div>
    </footer>
  );
}
```

---

### File: `frontend/src/components/Sidebar.jsx`
```javascript
import React from 'react';
import {
  DashboardIcon,
  DevicesIcon,
  SensorIcon,
  AlertIcon,
  FsmIcon,
  SimulationIcon,
  BookOpenIcon,
} from './Icons';

export default function Sidebar({ activeTab, setActiveTab, alertCount = 0 }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview Dashboard',
      icon: <DashboardIcon size={18} />,
    },
    {
      id: 'devices',
      label: 'Device Management',
      icon: <DevicesIcon size={18} />,
    },
    {
      id: 'sensors',
      label: 'Sensor Monitoring',
      icon: <SensorIcon size={18} />,
    },
    {
      id: 'alerts',
      label: 'System Alerts',
      icon: <AlertIcon size={18} />,
      badge: alertCount > 0 ? alertCount : null,
    },
    {
      id: 'fsm-visualizer',
      label: 'FSM Visualizer',
      icon: <FsmIcon size={18} />,
    },
    {
      id: 'simulation',
      label: 'Simulation Controls',
      icon: <SimulationIcon size={18} />,
    },
    {
      id: 'fsm-explanation',
      label: 'FLAT Documentation',
      icon: <BookOpenIcon size={18} />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800">
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
          IoT
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-white block">
            IoT Monitor
          </span>
          <span className="text-[11px] text-blue-400 font-mono tracking-wider">
            FLAT FSM ENGINE
          </span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/60 m-3 rounded-xl">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Student Information
        </div>
        <div className="mt-2 text-xs">
          <p className="font-bold text-white">Reg No: 24ITR018</p>
          <p className="text-slate-400 text-[11px] mt-0.5">Project #18 (FLAT / Full Stack)</p>
          <p className="text-slate-500 text-[10px] mt-1">Velalar College of Engg & Tech</p>
        </div>
      </div>
    </aside>
  );
}
```

---

<div style="page-break-after: always;"></div>

## 2.3 GITHUB ACTIONS CI/CD PIPELINE

### File: `.github/workflows/deploy.yml`
```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package.json

      - name: Validate Production API URL
        run: |
          API_URL="${{ vars.VITE_API_BASE_URL || secrets.VITE_API_BASE_URL }}"
          if [ -z "$API_URL" ]; then
            echo "::error title=Missing VITE_API_BASE_URL::Repository variable VITE_API_BASE_URL is not configured. Please add your deployed Render backend URL."
            exit 1
          fi
          echo "Production API Base URL configured: $API_URL"

      - name: Install Frontend Dependencies
        run: npm ci || npm install

      - name: Build React Application
        env:
          VITE_API_BASE_URL: ${{ vars.VITE_API_BASE_URL || secrets.VITE_API_BASE_URL }}
        run: npm run build

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './frontend/dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

<div style="page-break-after: always;"></div>

# 3. OUTPUT SCREENSHOTS & EXPERIMENTAL VERIFICATION
*(Note for Printout: Paste the designated screenshots into each of the framed boxes below on separate new pages for color printing).*

---

## 3.1 Website Dashboard (Overview & Sensor Telemetry Monitoring)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│               [ PASTE COLOR SCREENSHOT OF OVERVIEW DASHBOARD HERE ]                    │
│                                                                                        │
│   Shows: Total Devices, Active Devices, Disconnected Devices, Total Alerts,            │
│   FSM State Distribution Progress Bars, and "MongoDB Connected" Indicator in Header.   │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
**Figure 3.1:** Production React Web Dashboard running live on GitHub Pages with real-time cloud MongoDB Atlas status.

---

<div style="page-break-after: always;"></div>

## 3.2 Simulation Controls & Live HTTP API Response Console

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│           [ PASTE COLOR SCREENSHOT OF SIMULATION CONTROLS DECK HERE ]                  │
│                                                                                        │
│   Shows: Left Simulation buttons (Send Valid, Invalid Temp 200°C, Failure, Timeout)    │
│   and Right Dark Terminal Inspector showing HTTP 200 OK / HTTP 400 Bad Request JSON.   │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
**Figure 3.2:** Execution of Valid and Invalid telemetry injections demonstrating state preservation and alert logging.

---

<div style="page-break-after: always;"></div>

## 3.3 Automata FSM Visualizer & State Transition History

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│              [ PASTE COLOR SCREENSHOT OF FSM VISUALIZER TAB HERE ]                     │
│                                                                                        │
│   Shows: Three Automata Nodes (Registered q0, Active F, Disconnected) with active node │
│   highlighted, and chronological transition history table at the bottom.               │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
**Figure 3.3:** Interactive Deterministic Finite Automaton visualization reflecting transitions $\delta(q, \sigma)$.

---

<div style="page-break-after: always;"></div>

## 3.4 MongoDB Atlas Cloud Database Collections

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│          [ PASTE COLOR SCREENSHOT OF MONGODB ATLAS DATA EXPLORER HERE ]                │
│                                                                                        │
│   Shows: Database `iot_monitoring` (or `test`) with all 4 collections:                 │
│   `devices`, `sensorreadings`, `alerts`, and `deviceevents` containing live documents.  │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
**Figure 3.4:** Cloud MongoDB Atlas Data Explorer verifying non-volatile database persistence across 4 schemas.

---

<div style="page-break-after: always;"></div>

# 4. DEPLOYMENT & REPOSITORY URLS

The system has been completely deployed across modern cloud infrastructure and is accessible globally:

| Resource Description | Cloud Hosting Platform | URL |
| :--- | :--- | :--- |
| **GitHub Repository** | GitHub | `https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System` |
| **Live Web Application** | GitHub Pages (Static React App) | `https://dhanusheyap755.github.io/IoT-Device-Status-Monitoring-System/` |
| **Backend API Service** | Render (Express Web Service) | `https://iot-monitoring-backend-p9h0.onrender.com` |
| **Backend Health Check** | Render API Health Endpoint | `https://iot-monitoring-backend-p9h0.onrender.com/api/health` |
| **Database Cluster** | MongoDB Atlas Cloud | `mongodb+srv://cluster0.pimkevk.mongodb.net/iot_monitoring` |

---

<div style="page-break-after: always;"></div>

# 5. GITHUB REPOSITORY SCREENSHOTS

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│             [ PASTE SCREENSHOT OF GITHUB REPOSITORY MAIN PAGE HERE ]                   │
│                                                                                        │
│   URL: https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System           │
│   Shows: Branches (main), commit messages, file structure (backend, frontend, etc.)    │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
**Figure 5.1:** GitHub Repository showing complete commit history and file structure.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│             [ PASTE SCREENSHOT OF GITHUB ACTIONS WORKFLOW RUN HERE ]                   │
│                                                                                        │
│   URL: https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System/actions   │
│   Shows: Green Checkmark (✔) for "Deploy Frontend to GitHub Pages"                     │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
**Figure 5.2:** GitHub Actions Workflow verifying successful build and automated deployment to GitHub Pages.

---

**Signature of the Student:** ____________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Signature of the Faculty In-Charge:** ____________________
