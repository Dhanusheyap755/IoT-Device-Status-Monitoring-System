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
