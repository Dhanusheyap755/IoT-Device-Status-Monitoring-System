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
