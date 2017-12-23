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
const createChannel = function (name, owner, callback) {
  const newChannel = new this({
    name: name,
    owner: owner
  });
  newChannel.save(callback);
}

/**
 * Get a specific channel by its _id
 * @param {string} id 
 * @param {function} callback
 */
const getChannelByID = function (id, callback) {
  this
    .findById(id)
    .populate('owner')
    .populate('playlist')
    .populate('currentVideo')
    .exec(callback);
}

/**
 * Delete a channel by its _id
 * @param {string} id 
 * @param {function} callback 
 */
const deleteChannel = function (id, user, callback) {
  this
    .findById(id)
    .populate('owner')
    .exec((error, channel) => {
      if (error) {
        error = new Error("Error querying for channel");
        error.name = "DatbaseError";
        callback(error);
      }
      else if (!channel) {
        error = new Error("Channel not found");
        error.name = "NotFoundError";
        callback(error);
      }
      else if (!channel.owner || !channel.owner._id.equals(user._id)) {
        error = new Error("User does not own channel");
        error.name = "UnauthorizedError";
        callback(error);
      }  
      // Try to delete channel  
      else {
        channel.remove((error, deletedChannel) => {
          if (error) {
            error = new Error("Error updating channel");
            error.name = "DatabaseError";
          }
          callback(error, deletedChannel);
        });
      }
  });
}

const searchChannel = function (params, callback) {
  // Make each parameter a regex so exact match not required
  Object.keys(params).forEach((key) => {
    params[key] = { $regex: params[key], $options: 'i' };
  })
  this
    .find(params)
    .exec((error, channels) => {
      if (error) {
        callback(new Error("Error querying for channel"));
      }
      else {
        callback(null, channels);
      }
    })
}

const editChannel = function (channelID, user, action, payload, callback) {
  this
    .findById(channelID)
    .populate('owner')
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
      else if (!channel.owner._id.equals(user._id)) {
        error = new Error("User does not own channel");
        error.name = "UnauthorizedError";
        callback(error);
      }
      else {
        switch (action) {
          case "changeName":
            channel.set(payload);
            channel.save((error, updatedChannel) => {
              if (error) {
                error = new Error("Error updating channel");
                error.name = "DatabaseError";
              }
              callback(error, updatedChannel);
            })  
            break;
          case "addVideo":  
            
            break;
          default:
            break;
        }
      }
    });
}

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
                      callback(error, channel);
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
            callback(error, channel);
          }
        });  
      }
    });
}

ChannelSchema.statics.create = createChannel;
ChannelSchema.statics.getByID = getChannelByID;
ChannelSchema.statics.delete = deleteChannel;
ChannelSchema.statics.search = searchChannel;
ChannelSchema.statics.edit = editChannel;
ChannelSchema.statics.addVideo = addVideoToChannel;

module.exports = mongoose.model('Channel', ChannelSchema);
