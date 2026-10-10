const mongoose = require('mongoose');

function connectDB() {
  mongoose.connect(process.env.MONGO_DB, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 15000,
    bufferCommands: false,
  });
}

module.exports = connectDB;
