// models/index.js
const mongoose = require('mongoose');

module.exports.connect = (uri) => {
  mongoose.connect(uri, {
    useMongoClient: true
  });
  // plug in the promise library:
  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
    process.exit(1);
  });

  // load models
  require('./model_user');
  require('./model_channel');
  require('./model_youtube_video');
};