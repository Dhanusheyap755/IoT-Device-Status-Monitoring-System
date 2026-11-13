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
