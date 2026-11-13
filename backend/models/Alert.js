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
