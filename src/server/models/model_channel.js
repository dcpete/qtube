const _ = require('lodash');
const mongoose = require('mongoose');
const YoutubeVideo = require('./model_youtube_video');
const googleUtil = require('../util/util_google');

const ChannelSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  playlist: [
    {
      added: {
        type: Date,
        default: Date.now
      },
      playcount: {
        type: Number,
        default: 0
      },
      video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YoutubeVideo'
      }
    }
  ],
  currentVideo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YoutubeVideo',
    default: null
  },
  currentVideoStarted: {
    type: Date,
    default: null
  },
  playing: {
    type: Boolean,
    default: false
  }
});

/**
 * Create a new channel
 * @param {string} name 
 * @param {string} owner 
 * @param {function} callback 
 */
const createChannel = function (name, owner) {
  const newChannel = new this({
    name: name,
    owner: owner
  });
  return newChannel.save();
}

/**
 * Get a specific channel by its _id
 * @param {string} id 
 * @returns {Promise} 
 */
const getChannelByID = function (id) {
  return this
    .findById(id)
    .populate('owner')
    .populate('playlist')
    .populate('currentVideo')
    .exec();
}

/**
 * Delete a channel by its _id
 * @param {string} id 
 * @param {function} callback 
 */
const deleteChannel = function (channelId, user) {
  return this
    .findOne({ _id: channelId })
    .populate('owner')
    .exec()
    .then(channel => {
      if (!channel) {
        const error = new Error("Channel not found");
        error.status = 404;
        throw error;
      }
      else if (channel.owner._id.equals(user._id)) {
        return this
          .findByIdAndDelete(channelId)
          .exec();
      }
      else {
        const error = new Error("Not authorized to edit channel");
        error.status = 403;
        throw error;
      }
    });
}

const searchChannel = function (params) {
  // Make each parameter a regex so exact match not required
  Object.keys(params).forEach((key) => {
    params[key] = { $regex: params[key], $options: 'i' };
  })
  return this
    .find(params)
    .exec()
}

const editChannel = function (channelId, user, change) {
  return this
    .findOne({ _id: channelId })
    .populate('owner')
    .exec()
    .then(channel => {
      if (!channel) {
        const error = new Error("Channel not found");
        error.status = 404;
        throw error;
      }
      else if (channel.owner._id.equals(user._id)) {
        return this
          .findOneAndUpdate(
            { _id: channelId },
            { $set: change },
            { new: true }
          )
          .exec();
      }
      else {
        const error = new Error("Not authorized to edit channel");
        error.status = 403;
        throw error;
      }
    });
}

/*
const addVideoToChannel = function (channelId, youtubeId, callback) {
  this.findById(channelId)
    .populate({
      path: 'playlist',
      populate: {
        path: 'video'
      }
    })
    .exec((error, channel) => {
      if (error) {
        error = new Error("Error querying for channel");
        error.name = "DatabaseError";
        callback(error);
      }
      else if (!channel) {
        error = new Error("Channel not found");
        error.name = "NotFoundError";
        callback(error);
      }
      else {
        YoutubeVideo.getByYoutubeId(youtubeId, (error, video) => {
          if (error) {
            switch (error.name) {
              case "NotFoundError":
                googleUtil.getVideoById(youtubeId, (error, videoFromYT) => {
                  if (error) {
                    callback(error);
                  }
                  else if (!videoFromYT || _.isEmpty(videoFromYT)) {
                    error = new Error("Error getting video from youtube");
                    error.name = "NotFoundError";
                    callback(error);
                  }
                  else {
                    YoutubeVideo.create(videoFromYT, (error, dbVideo) => {
                      channel.playlist.push({
                        added: Date.now(),
                        playcount: 0,
                        video: dbVideo
                      });
                      channel.save((error, updatedChannel) => {
                        if (error) {
                          error = new Error("Error updating channel");
                          error.name = "DatabaseError";
                        }
                        callback(error, updatedChannel);
                      });
                    });
                  }
                });
                break;
              default:
                callback(error);
            }
          }
          else {
            channel.playlist.push({
              added: Date.now(),
              playcount: 0,
              video: video
            });
            channel.save((error, updatedChannel) => {
              if (error) {
                error = new Error("Error updating channel");
                error.name = "DatabaseError";
              }
              callback(error, updatedChannel);
            });
          }
        });  
      }
    });
}
*/

ChannelSchema.statics.create = createChannel;
ChannelSchema.statics.getByID = getChannelByID;
ChannelSchema.statics.delete = deleteChannel;
ChannelSchema.statics.search = searchChannel;
ChannelSchema.statics.edit = editChannel;
//ChannelSchema.statics.addVideo = addVideoToChannel;

module.exports = mongoose.model('Channel', ChannelSchema);
