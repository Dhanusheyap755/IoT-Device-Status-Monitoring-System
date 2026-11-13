const Device = require('../models/Device');
const Alert = require('../models/Alert');
const { processFSMTransition, EVENTS } = require('../fsm/deviceStateMachine');

/**
 * Express Middleware to strictly validate incoming IoT sensor messages
 * Adheres to Course Validation Specifications:
 * - deviceId: Mandatory, matches /^IOT\d{3,}$/, must be an existing registered device
 * - temperature: Mandatory, numeric, -40 <= temp <= 125 °C
 * - humidity: Mandatory, numeric, 0 <= humidity <= 100 %
 * - status: Mandatory, enum ['online', 'offline']
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
      validationErrors.push(`Device ID "${deviceId}" is invalid. Must follow pattern like IOT001 (IOT followed by at least 3 digits).`);
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

    // If deviceId looks valid, verify if device exists in DB to record FSM InvalidMessage event
    let existingDevice = null;
    if (targetDeviceId !== 'UNKNOWN') {
      try {
        existingDevice = await Device.findOne({ deviceId: targetDeviceId });
      } catch (err) {
        // DB error handled safely
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
      // Record a standalone alert for the unknown or missing device validation failure
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
      // Device does not exist in DB
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

    // Attach device and sanitized payload to req for controller use
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
