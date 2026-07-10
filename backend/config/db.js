const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      console.warn('WARNING: MONGODB_URI is not defined in environment variables. Falling back to local MongoDB.');
    }
    const uri = connUri || 'mongodb://127.0.0.1:27017/careersphere';
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not crash server in development if DB is not active immediately
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
