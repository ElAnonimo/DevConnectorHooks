const mongoose  = require('mongoose');
const config = require('config');
const db = config.get('mongoUri');

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('MongoDB Atlas connected.');
  } catch(err) {
    console.error('MongoDB Atlas connection error:', err.message);
  }
};

module.exports = connectDb;
