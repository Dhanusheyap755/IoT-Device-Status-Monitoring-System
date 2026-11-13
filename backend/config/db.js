const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iot_monitoring';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn(`[MongoDB Warning] Please ensure MongoDB is running locally on port 27017 or provide a valid MONGODB_URI in backend/.env`);
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
