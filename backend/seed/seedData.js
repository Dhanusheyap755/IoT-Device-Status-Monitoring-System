require('dotenv').config();
const mongoose = require('mongoose');
const Device = require('../models/Device');
const SensorReading = require('../models/SensorReading');
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
