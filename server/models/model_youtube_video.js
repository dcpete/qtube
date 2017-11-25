const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const googleUtil = require('../util/util_google');

const YoutubeVideoSchema = mongoose.Schema({
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

const createVideo = function (video, callback) {
  const newVideo = new this({
    title: video.snippet.title,
    youtubeId: video.id,
    thumbnail: video.snippet.thumbnails.default.url,
    duration: googleUtil.getDurationInSec(video.contentDetails.duration),
    firstAdded: Date.now(),
    playcount: 0
  });
  newVideo.save((error, addedVideo) => {
    if (error) {
      error = new Error("Error saving video");
      error.name = "DatabaseError";
    }
    callback(error, addedVideo);
  });
}

const deleteVideo = function (id, callback) {
  console.log(id);
  this
  .findById(id)
    .exec((error, video) => {
      if (error) {
        error = new Error("Error querying for video");
        error.name = "DatbaseError";
        callback(error);
      }
      else if (!video) {
        error = new Error("Video not found");
        error.name = "NotFoundError";
        callback(error);
      }
      else {
        video.remove((error, deletedVideo) => {
          if (error) {
            error = new Error("Error deleting video");
            error.name = "DatabaseError";
          }
          callback(error, deletedVideo);
        });
      }
    });
}

const getVideoById = function (id, callback) {
  this
    .findById(id)
    .exec((error, video) => {
      if (error) {
        error = new Error("Error querying for video");
        error.name = "DatbaseError";
        callback(error);
      }
      else if (!video) {
        error = new Error("Video not found");
        error.name = "NotFoundError";
        callback(error);
      }
      else {
        callback(error, video);
      }
    });
}

const getVideoByYoutubeId = function (youtubeId, callback) {
  this
    .findOne({ 'youtubeId': youtubeId })
    .exec((error, video) => {
      if (error) {
        error = new Error("Error querying for video");
        error.name = "DatbaseError";
        callback(error);
      }
      else if (!video) {
        error = new Error("Video not found");
        error.name = "NotFoundError";
        callback(error);
      }
      else {
        callback(error, video);
      }
    });
}

YoutubeVideoSchema.statics.create = createVideo;
YoutubeVideoSchema.statics.delete = deleteVideo;
YoutubeVideoSchema.statics.getById = getVideoById;
YoutubeVideoSchema.statics.getByYoutubeId = getVideoByYoutubeId;

module.exports = mongoose.model('YoutubeVideo', YoutubeVideoSchema);
