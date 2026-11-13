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
