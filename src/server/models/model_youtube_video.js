const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { google } = require('googleapis');
const API_KEY = require('../config/config_google').API_KEY;

const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY
});

const YoutubeVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'YoutubeVideo must have title'
  },
  youtubeId: {
    type: String,
    unique: true,
    index: true,
    required: 'YoutubeVideo must have id'
  },
  thumbnail: {
    type: String,
    required: 'YoutubeVideo must have thumbnail'
  },
  duration: {
    type: Number,
    required: 'YoutubeVideo must have duration'
  },
  firstAdded: {
    type: Date,
    default: Date.now
  },
  playcount: {
    type: Number,
    default: 0 
  }
});
YoutubeVideoSchema.plugin(uniqueValidator);
YoutubeVideoSchema.post('save', (error, doc, next) => {
  if (error.name === 'ValidationError') {
    const dupError = new Error('YoutubeVideo already exists');
    dupError.name = 'DuplicateEntryError';
    dupError.status = 409;
    throw dupError;
  }
  else {
    next(error);
  }
})
YoutubeVideoSchema.post('save', (doc) => {
})
YoutubeVideoSchema.set('toJSON', {
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  }
})

const getDurationInSec = function(duration) {
  var output = [];
  var durationInSec = 0;
  var matches = duration.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
  var parts = [
    { // years
      pos: 1,
      multiplier: 86400 * 365
    },
    { // months
      pos: 2,
      multiplier: 86400 * 30
    },
    { // weeks
      pos: 3,
      multiplier: 604800
    },
    { // days
      pos: 4,
      multiplier: 86400
    },
    { // hours
      pos: 5,
      multiplier: 3600
    },
    { // minutes
      pos: 6,
      multiplier: 60
    },
    { // seconds
      pos: 7,
      multiplier: 1
    }
  ];
  for (var i = 0; i < parts.length; i++) {
    if (typeof matches[parts[i].pos] !== 'undefined') {
      durationInSec += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
    }
  }
  return durationInSec;
};

const createVideo = function (youtubeid) {
  return youtube.videos.list({
    part: 'contentDetails,snippet',
    id: youtubeid
  })
    .then(res => {
      if (!res.data.items || res.data.items.length === 0) {
        const error = new Error("Youtube video not found");
        error.name = "NotFoundError";
        throw error;
      }
      return res.data.items[0];
    }).then(video => {
      const newVideo = new this({
        title: video.snippet.title,
        youtubeId: video.id,
        thumbnail: video.snippet.thumbnails.default.url,
        duration: getDurationInSec(video.contentDetails.duration),
        firstAdded: Date.now(),
        playcount: 0
      });
      return newVideo.save();
    })
}

const deleteVideo = function (id) {
  return this
    .findByIdAndDelete(id)
    .exec();
}

const getVideoByYoutubeId = function (youtubeId) {
  return this
    .findOne({ 'youtubeId': youtubeId })
    .exec();
}

YoutubeVideoSchema.statics.create = createVideo;
YoutubeVideoSchema.statics.delete = deleteVideo;
YoutubeVideoSchema.statics.getByYoutubeId = getVideoByYoutubeId;

module.exports = mongoose.model('YoutubeVideo', YoutubeVideoSchema);
