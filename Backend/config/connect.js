const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      throw new Error(`Could not connect to MongoDB: ${err}`);
    });
};

module.exports = connectDB;