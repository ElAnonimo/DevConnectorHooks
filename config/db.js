const mongoose  = require('mongoose');
const config = require('config');
const db = config.get('mongoUri');

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoLab connected.');
  } catch(err) {
    console.error('MongoLab connection error:', err.message);
  }
};

module.exports = connectDb;
