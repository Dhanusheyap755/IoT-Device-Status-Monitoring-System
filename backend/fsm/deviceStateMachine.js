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
 * @param {Object} device - Mongoose Device document or plain object with deviceId & state
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
