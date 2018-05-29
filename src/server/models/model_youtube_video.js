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

const createVideo = function (video) {
  const newVideo = new this({
    title: video.snippet.title,
    youtubeId: video.id,
    thumbnail: video.snippet.thumbnails.default.url,
    duration: googleUtil.getDurationInSec(video.contentDetails.duration),
    firstAdded: Date.now(),
    playcount: 0
  });
  return newVideo.save();
}

const deleteVideo = function (id) {
  return this
    .findByIdAndDelete(id)
    .exec();
}

const getVideoById = function (id) {
  return this
    .findById(id)
    .exec();
}

const getVideoByYoutubeId = function (youtubeId) {
  return this
    .findOne({ 'youtubeId': youtubeId })
    .exec();
}

YoutubeVideoSchema.statics.create = createVideo;
YoutubeVideoSchema.statics.delete = deleteVideo;
YoutubeVideoSchema.statics.getById = getVideoById;
YoutubeVideoSchema.statics.getByYoutubeId = getVideoByYoutubeId;

module.exports = mongoose.model('YoutubeVideo', YoutubeVideoSchema);
