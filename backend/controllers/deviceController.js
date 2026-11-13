const Device = require('../models/Device');
const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');
const DeviceEvent = require('../models/DeviceEvent');
const { getDbState, isDbConnected } = require('../config/db');
const {
  STATES,
  EVENTS,
  TRANSITION_TABLE,
  evaluateTransition,
  processFSMTransition,
} = require('../fsm/deviceStateMachine');

/**
 * Health check endpoint
 * GET /api/health
 */
const getHealth = async (req, res) => {
  const dbState = getDbState();
  const isHealthy = isDbConnected();

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    project: 'IoT Device Status Monitoring System',
    studentRegNo: '24ITR018',
    institution: 'Velalar College of Engineering and Technology, Erode',
    department: 'Department of Information Technology',
    course: 'Full Stack Web Development, Computer Networks, FLAT',
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

/**
 * Get all registered devices
 * GET /api/devices
 */
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

/**
 * Get single device by ID
 * GET /api/devices/:id
 */
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

    // Retrieve last 10 readings and last 10 events
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

/**
 * Register a new IoT device
 * POST /api/devices/register
 */
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

    // Pattern check
    if (!/^IOT\d{3,}$/.test(formattedDeviceId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Device ID Format',
        message: `Device ID must follow pattern 'IOT' followed by at least 3 digits (e.g. IOT001, IOT004). Received: "${deviceId}"`,
      });
    }

    // Check duplicate
    const existing = await Device.findOne({ deviceId: formattedDeviceId });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate Device ID',
        message: `A device with ID "${formattedDeviceId}" is already registered in the system.`,
      });
    }

    // Create device with initial state q0 = Registered
    const newDevice = new Device({
      deviceId: formattedDeviceId,
      deviceName: formattedDeviceName,
      state: STATES.REGISTERED,
      lastSeen: new Date(),
    });
    await newDevice.save();

    // Log registration in state history
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

    // Log registration alert
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

/**
 * Ingest valid sensor telemetry message
 * POST /api/devices/message
 * Note: Middleware validateSensorMessage executes before this handler!
 */
const postSensorMessage = async (req, res, next) => {
  try {
    const device = req.targetDevice;
    const { deviceId, temperature, humidity, status } = req.sanitizedPayload;

    // 1. Persist validated sensor reading
    const reading = new SensorReading({
      deviceId: deviceId,
      temperature: temperature,
      humidity: humidity,
      status: status || 'online',
      receivedAt: new Date(),
    });
    await reading.save();

    // 2. Execute FSM Transition: currentState + ValidMessage -> nextState (Active)
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

/**
 * Simulate communication failure
 * POST /api/devices/failure
 */
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

    // Execute FSM transition: currentState + CommunicationFailure -> Disconnected
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

/**
 * Simulate device timeout
 * POST /api/devices/timeout
 */
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

    // Execute FSM transition: currentState + Timeout -> Disconnected
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

/**
 * Reconnect device
 * POST /api/devices/:id/reconnect
 */
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

    // Execute FSM transition: currentState + Reconnect -> Active
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

/**
 * Get device state transition history
 * GET /api/history/:id
 */
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

/**
 * Get aggregated dashboard statistics
 * GET /api/devices/stats
 */
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
